import request from './request';

/**
 * 开放接口
 */
const openApi = {
  /**
   * 微信小程序，使用code登录
   */
  loginByCode: async (data: {
    appId: number; // 应用ID
    code: string; // wx.login()
  }) => {
    return request.post(`${OPEN_BASE_URL}/api/wxapp/mpLogin`, data, { showLoading: false }).then((res) => {
      if (res.code === 0) {
        return res.data; // {code: 0, msg: "success", data: {…}}
      } else if (res.code === 1) {
        return null; // {code: 1, msg: "需要获取用户信息"}
      } else {
        throw new Error(res.msg);
      }
    });
  },

  /**
   * 上传文件前，查询文件是否已存在
   */
  queryFile: async (data: {
    appId: number; // 应用ID
    hash: string; // 文件hash
  }) => {
    return request.post(`${OPEN_BASE_URL}/api/upload/queryFile`, data, { showLoading: false });
  },

  /**
   * 表单文件上传（使用Taro.uploadFile上传）
   */
  uploadFile: {
    url: `${OPEN_BASE_URL}/api/upload/uploadFile`,
    name: 'file',
  },

  /**
   * 文件分块成base64上传
   * @param data
   * @returns
   */
  uploadFileChunk: async (data: {
    appId: number; // 应用ID
    tags: string; // 文件标签
    hash: string; // 文件hash
    name: string; // 文件名称
    size: number; // 文件大小
    mime: string; // 文件类型
    start: number; // 分片的起始位置
    length: number; // 分片长度
    content: string; // 分片内容（base64）
  }) => {
    return request.post(`${OPEN_BASE_URL}/api/upload/uploadFileChunk`, data, { showLoading: false });
  },

  /**
   * 更新用户基本信息
   * @param data
   * @returns
   */
  updateBaseInfo: async (data: {
    name?: string; // 姓名
    avatar?: string; // 头像
    gender?: number; // 性别
    idCard?: string; // 身份证
    email?: string; // 邮箱
    birthday?: string; // 出生日期
    remark?: string; // 备注
  }) => {
    return request.post(`${OPEN_BASE_URL}/api/user/updateBaseInfo`, data);
  },

  /**
   * 获取所有区域
   * @returns
   */
  getAllAreas: async () => {
    return request.post(`${OPEN_BASE_URL}/api/area/getAllAreas`);
  },
};

export default openApi;
