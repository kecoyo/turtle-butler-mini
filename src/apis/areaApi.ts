import request from './request';

/**
 * 区域相关接口
 */
const areaApi = {
  /**
   * 获取所有区域
   * @returns
   */
  getAllAreas: async () => {
    return request.post(`${OPEN_BASE_URL}/api/area/list`);
  },
};

export default areaApi;
