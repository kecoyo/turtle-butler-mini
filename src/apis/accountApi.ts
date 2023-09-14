import request from './request';

/**
 * 账号
 */
const accountApi = {
  /**
   * 获取账号列表
   * @description
   * @returns
   */
  getAccountList: async (data: {
    categoryId: number; // 分类ID
  }) => {
    return request.get('/api/account/getAccountList', data);
  },

  /**
   * 获取账号信息
   * @description
   * @returns
   */
  getAccountInfo: async (data: {
    id: number; // 账号ID
  }) => {
    return request.get('/api/account/getAccountInfo', data);
  },

  /**
   * 创建账号
   * @description
   * @returns
   */
  createAccount: async (data: {
    name: string; // 账号名称
    icon: string; // 账号图标
  }) => {
    return request.post('/api/account/createAccount', data);
  },

  /**
   * 修改账号
   * @description
   * @returns
   */
  updateAccount: async (data: {
    id: number; // 账号ID
    name: string; // 账号名称
    icon: string; // 账号图标
  }) => {
    return request.post('/api/account/updateAccount', data);
  },

  /**
   * 删除账号
   * @description
   * @returns
   */
  deleteAccount: async (data: {
    id: number; // 账号ID
  }) => {
    return request.post('/api/account/deleteAccount', data);
  },

  /**
   * 排序账号
   * @description
   * @returns
   */
  sortAccount: async (data: {
    ids: number[]; // 账号ID数组
  }) => {
    return request.post('/api/account/sortAccount', data);
  },

  /**
   * 移动账号
   * @description
   * @returns
   */
  moveAccount: async (data: {
    id: number; // 要移动的账号id
    categoryId: number; // 目标分类id
  }) => {
    return request.post('/api/account/moveAccount', data);
  },
};

export default accountApi;
