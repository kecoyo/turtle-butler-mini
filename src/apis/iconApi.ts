import request from './request';

/**
 * 图标
 */
const iconApi = {
  /**
   * 获取图标列表（分组）
   * 用于图标选择加载按图标分类把所有图标分组
   * @returns
   */
  getIconList: async () => {
    return request.get('/api/icon/listGroup');
  },
};

export default iconApi;
