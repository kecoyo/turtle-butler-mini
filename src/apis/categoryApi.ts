import request from './request';

/**
 * 账号分类
 */
const categoryApi = {
  /**
   * 获取账号分类列表
   * @description
   * @returns
   */
  getCategoryList: async () => {
    return request.get('/api/category/getCategoryList');
  },

  /**
   * 获取账号分类信息
   * @description
   * @returns
   */
  getCategoryInfo: async (data: {
    id: number; // 分类ID
  }) => {
    return request.get('/api/category/getCategoryInfo', data);
  },

  /**
   * 创建账号分类
   * @description
   * @returns
   */
  createCategory: async (data: {
    name: string; // 分类名称
    icon: string; // 分类图标
  }) => {
    return request.post('/api/category/createCategory', data);
  },

  /**
   * 修改账号分类
   * @description
   * @returns
   */
  updateCategory: async (data: {
    id: number; // 分类ID
    name: string; // 分类名称
    icon: string; // 分类图标
  }) => {
    return request.post('/api/category/updateCategory', data);
  },

  /**
   * 删除账号分类
   * @description
   * @returns
   */
  deleteCategory: async (data: {
    id: number; // 分类ID
  }) => {
    return request.post('/api/category/deleteCategory', data);
  },

  /**
   * 排序账号分类
   * @description
   * @returns
   */
  sortCategory: async (data: {
    ids: number[]; // 分类ID数组
  }) => {
    return request.post('/api/category/sortCategory', data);
  },
};

export default categoryApi;
