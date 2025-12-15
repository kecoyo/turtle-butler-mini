import request from './request';

/**
 * 登录相关接口
 */
const loginApi = {
  /**
   * 微信小程序，使用code登录
   */
  miniProgram: async (data: {
    code: string;
  }) => {
    return request.post(`${BASE_URL}/api/login/miniProgram`, { code: data.code }, { showLoading: false }).then((res) => {
      if (res.code === 0) {
        return res.data; // {code: 0, msg: "success", data: {…}}
      } else if (res.code === 1) {
        return null; // {code: 1, msg: "需要获取用户信息"}
      } else {
        throw new Error(res.msg);
      }
    });
  },
};

export default loginApi;
