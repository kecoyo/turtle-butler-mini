import request from './request';

/**
 * 用户相关接口
 */
const userApi = {
  /**
   * 更新用户信息
   * @param data
   * @returns
   */
  updateUserInfo: async (data: {
    nickname?: string; // 昵称
    avatar?: string; // 头像
    gender?: number; // 性别
    idCard?: string; // 身份证
    email?: string; // 邮箱
    birthday?: string; // 出生日期
    remark?: string; // 备注
    province?: number; // 省
    city?: number; // 市
    county?: number; // 区县
  }) => {
    return request.post(`${BASE_URL}/api/user/update`, data);
  },
};

export default userApi;
