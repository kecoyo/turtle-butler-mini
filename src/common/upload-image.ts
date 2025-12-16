import uploadApi from '@/apis/uploadApi';
import Taro from '@tarojs/taro';
import mineType from 'mine-type';
import SparkMD5 from 'spark-md5';
import { APP_ID } from './constants';
import { hideLoading, showErrorMsg, showLoading } from './utils';

interface TempFile {
  path: string; // 文件路径
  size: number; // 文件大小
  tags: string; // 文件标签
  name: string; // 文件名称
  ext: string; // 扩展名
  mime: string; // 文件类型
  hash: string; // md5 hash
  percent: number; // 进度
  status: string; // 状态
}

// 选择图片，可多选
const chooseImage = (count?: number) => {
  return new Promise<TempFile[]>((resolve) => {
    Taro.chooseImage({
      count, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        let files = result.tempFiles as TempFile[];
        for (const file of files) {
          file.name = file.path.substring(file.path.lastIndexOf('/') + 1).toLowerCase();
          file.ext = file.name.substring(file.name.lastIndexOf('.') + 1);
          file.mime = mineType.getContentType(file.ext);
        }
        resolve(files);
      },
      fail: () => {
        resolve([]);
      },
    });
  });
};

// 获取文件md5
const getFileMd5 = (filePath: string) => {
  return new Promise<string>((resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      filePath: filePath,
      success: async (res) => {
        const buffer = res.data as ArrayBuffer;
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(buffer);
        const fileMd5 = spark.end(false);
        resolve(fileMd5);
      },
      fail: (err) => {
        reject(err.errMsg);
      },
    });
  });
};

// 整个文件上传
const uploadFile = async (file: TempFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: uploadApi.uploadFile.url,
      name: uploadApi.uploadFile.name,
      filePath: file.path,
      fileName: file.name,
      header: { Authorization: Taro.getStorageSync('token') },
      formData: {
        tags: file.tags,
      },
      success: (result) => {
        const res = JSON.parse(result.data);
        if (res.code === 0) {
          resolve(res.data.url);
        } else {
          reject(new Error(res.msg));
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg));
      },
    });
  });
};

// 读取文件分块（base64）
const readFileChunk = (file: TempFile, position: number, length: number): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      filePath: file.path,
      encoding: 'base64',
      position: position,
      length: length,
      success: async (res) => {
        resolve(res.data as string);
      },
      fail: (err) => {
        reject(err.errMsg);
      },
    });
  });
};

// 分片上传文件
const uploadFileChunk = async (file: TempFile, start?: number): Promise<string> => {
  const chunkSize = 1048576; // 每次读取1MB
  start = start || 0;

  file.status = 'uploading';
  file.percent = Math.round((start / file.size) * 100);

  const length = file.size - start >= chunkSize ? chunkSize : file.size - start;
  const chunk = await readFileChunk(file, start, length);
  const res = await uploadApi.uploadChunk({
    tags: file.tags,
    hash: file.hash,
    name: file.name,
    size: file.size,
    mime: file.mime,
    start: start,
    length: length,
    content: chunk,
  });
  if (res.code === 0) {
    file.status = 'done';
    file.percent = 100;
    return res.data.url; // 成功返回url
  } else if (res.code === 1) {
    // 继续上传，使用返回的position或计算下一个位置
    const nextPosition = res.data?.position ?? res.data ?? start + length;
    return await uploadFileChunk(file, nextPosition); // 继续上传
  } else {
    throw new Error(res.msg);
  }
};

// 查询，并上传文件
const queryAndUploadFile = async (file: TempFile) => {
  const res = await uploadApi.query({
    tags: file.tags,
    hash: file.hash,
  });
  if (res.code === 0) {
    return res.data.url; // 成功返回url
  } else if (res.code === 1) {
    // return await uploadFile(file); // 开始上传
    // 开始上传、继续上传，使用返回的position或默认0
    const startPosition = res.data?.position ?? res.data ?? 0;
    return await uploadFileChunk(file, startPosition);
  } else {
    throw new Error(res.msg);
  }
};

// 选择图片，并上传
const chooseImageAndUpload = async (tags: string, count: number) => {
  let files = await chooseImage(count);
  if (files.length === 0) {
    return; // 取消上传
  }

  try {
    showLoading('上传中...');
    for (const file of files) {
      let fileMd5 = await getFileMd5(file.path);
      if (!fileMd5) throw new Error('getFileMd5 error');

      file.hash = fileMd5;
      file.tags = tags;

      let url = await queryAndUploadFile(file);
      if (!url) throw new Error('uploadFile error');

      return url;
    }
    hideLoading();
  } catch (err) {
    hideLoading();
    showErrorMsg(err);
  }
};

// 上传裁剪后的图片
const uploadCropperImage = async (tags: string, filePath: string): Promise<string> => {
  try {
    showLoading('上传中...');

    // 获取文件信息
    const fileInfo = await Taro.getFileInfo({ filePath });
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1).toLowerCase();
    const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    const mime = mineType.getContentType(ext);

    // 创建文件对象
    const file: TempFile = {
      path: filePath,
      size: (fileInfo as any).size || 0,
      tags: tags,
      name: fileName,
      ext: ext,
      mime: mime,
      hash: '',
      percent: 0,
      status: '',
    };

    // 计算 MD5
    const fileMd5 = await getFileMd5(filePath);
    file.hash = fileMd5;

    // 查询并上传文件
    const queryRes = await uploadApi.query({
      tags: file.tags,
      hash: file.hash,
    });

    let url: string;
    if (queryRes.code === 0) {
      url = queryRes.data.url;
    } else {
      // 需要上传文件
      url = await uploadFile(file);
    }

    hideLoading();
    return url;
  } catch (err) {
    hideLoading();
    showErrorMsg(err);
    throw err;
  }
};

export { chooseImageAndUpload, uploadCropperImage };
