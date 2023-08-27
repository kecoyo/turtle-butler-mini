import request from './request';

/**
 * 账号分类
 */
const categoryApi = {
  /**
   * 获取分类列表
   * @description
   * @returns
   */
  getCategoryList: async () => {
    return request.get('/api/category/list');
  },

  /**
   * 获取分类信息
   * @description
   * @returns
   */
  getCategoryInfo: async (data: {
    id: number; // 分类ID
  }) => {
    return request.post('/api/category/info', data);
  },
};

export default categoryApi;
