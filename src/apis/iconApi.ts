import request from './request';

/**
 * 图标
 */
const iconApi = {
  /**
   * 获取图标列表
   * @returns
   */
  getIconList: async () => {
    return request.get('/api/icon/getIconList');
  },
};

export default iconApi;
