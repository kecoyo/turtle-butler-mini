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
    return request.get('/api/category/list');
  },

  /**
   * 获取账号分类信息
   * @description
   * @returns
   */
  getCategoryInfo: async (data: {
    id: number; // 分类ID
  }) => {
    return request.get('/api/category/info', { id: data.id });
  },

  /**
   * 添加账号分类
   * @description
   * @returns
   */
  createCategory: async (data: {
    name: string; // 分类名称
    icon?: string; // 分类图标（可选）
  }) => {
    return request.post('/api/category/add', {
      name: data.name,
      icon: data.icon || '',
    });
  },

  /**
   * 修改账号分类
   * @description
   * @returns
   */
  updateCategory: async (data: {
    id: number; // 分类ID
    name: string; // 分类名称
    icon?: string; // 分类图标（可选）
  }) => {
    return request.post('/api/category/update', {
      id: data.id,
      name: data.name,
      icon: data.icon || '',
    });
  },

  /**
   * 删除账号分类
   * @description
   * @returns
   */
  deleteCategory: async (data: {
    id: number; // 分类ID
  }) => {
    return request.post('/api/category/delete', { id: data.id });
  },

  /**
   * 排序账号分类
   * @description
   * @returns
   */
  sortCategory: async (data: {
    ids: number[]; // 分类ID数组
  }) => {
    return request.post('/api/category/sort', { ids: data.ids });
  },
};

export default categoryApi;
