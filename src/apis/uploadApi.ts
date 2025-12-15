import request from './request';

/**
 * 开放接口
 */
const uploadApi = {
  /**
   * 上传文件前，查询文件是否已存在
   */
  query: async (data: {
    tags: string; // 文件标签
    hash: string; // 文件hash
  }) => {
    return request.post(`${BASE_URL}/api/upload/query`, data, { showLoading: false });
  },

  /**
   * 表单文件上传（使用Taro.uploadFile上传）
   */
  uploadFile: {
    url: `${BASE_URL}/api/upload/uploadFile`,
    name: 'file',
  },

  /**
   * 文件分块成base64上传
   * @param data
   * @returns
   */
  uploadChunk: async (data: {
    tags: string; // 文件标签
    hash: string; // 文件hash
    name: string; // 文件名称
    size: number; // 文件大小
    mime: string; // 文件类型
    start: number; // 分片的起始位置
    length: number; // 分片长度
    content: string; // 分片内容（base64）
  }) => {
    return request.post(`${BASE_URL}/api/upload/uploadChunk`, data, { showLoading: false });
  },
};

export default uploadApi;
