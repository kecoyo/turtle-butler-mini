import request from './request';

/**
 * 开放接口
 */
const openApi = {
  /**
   * 使用code登录
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

  // 上传前查询文件是否上传过
  queryFile: async (data: {}) => {
    return request.post(`${OPEN_BASE_URL}/api/upload/queryFile`, data, { showLoading: false });
  },

  // 表单文件上传
  uploadFile: {
    url: `${OPEN_BASE_URL}/api/upload/uploadFile`,
    name: 'file',
  },

  // 分块上传文件
  uploadFileChunk: async (data: {}) => {
    return request.post(`${OPEN_BASE_URL}/api/upload/uploadFileChunk`, data, { showLoading: false });
  },

  /**
   * 更新用户资料
   * @description 无userId,更新自己的资料，有userid，token用户更新userid的资料
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

  // 获取所有区域
  getAllAreas: async () => {
    return request.post(`${OPEN_BASE_URL}/api/area/getAllAreas`);
  },
};

export default openApi;
