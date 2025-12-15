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
    return request.get('/api/account/list', { category_id: data.categoryId });
  },

  /**
   * 获取账号信息
   * @description
   * @returns
   */
  getAccountInfo: async (data: {
    id: number; // 账号ID
  }) => {
    return request.get('/api/account/info', { id: data.id });
  },

  /**
   * 添加账号
   * @description
   * @returns
   */
  addAccount: async (data: {
    id?: number; // 账号ID（新建时为0）
    categoryId: number; // 分类ID
    name: string; // 账号名称
    icon: string; // 账号图标
    properties?: PropertyItem[]; // 属性列表
    pictures?: AccountPicture[]; // 图片列表
    remark?: string; // 备注
  }) => {
    return request.post('/api/account/add', {
      category_id: data.categoryId,
      name: data.name,
      icon: data.icon,
      properties: data.properties || [],
      pictures: data.pictures || [],
      remark: data.remark || '',
    });
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
    properties?: PropertyItem[]; // 属性列表
    pictures?: AccountPicture[]; // 图片列表
    remark?: string; // 备注
  }) => {
    return request.post('/api/account/update', {
      id: data.id,
      name: data.name,
      icon: data.icon,
      properties: data.properties || [],
      pictures: data.pictures || [],
      remark: data.remark || '',
    });
  },

  /**
   * 删除账号
   * @description
   * @returns
   */
  deleteAccount: async (data: {
    id: number; // 账号ID
  }) => {
    return request.post('/api/account/delete', { id: data.id });
  },

  /**
   * 排序账号
   * @description
   * @returns
   */
  sortAccount: async (data: {
    ids: number[]; // 账号ID数组
  }) => {
    return request.post('/api/account/sort', { ids: data.ids });
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
    return request.post('/api/account/move', {
      id: data.id,
      category_id: data.categoryId,
    });
  },
};

export default accountApi;
