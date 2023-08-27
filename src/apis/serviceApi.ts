// 该文件由 API文档 自动生成，请勿手动修改！
import request from './request';

/**
 * 班牌
 */
const serviceApi = {
  /**
   * 获取班牌信息
   * @description 不填gradeId，默认搜索全校班牌,可以通过deviceId查找对应设备的绑定信息
   * @param data
   * @returns
   */
  getCardInfo: async (data: {
    gradeId?: number; // 年级id
    classId?: number; // 班级id
    uuid?: string; // 设备id
  }) => {
    return request.post('/api/service/getCardInfo', data);
  },

  /**
   * 班牌绑定
   * @description
   * @param data
   * @returns
   */
  bindCard: async (data: {
    gradeId: number; // 年级id
    classId: number; // 班级id
    uuid: string; // 设备uuid
  }) => {
    return request.post('/api/service/bindCard', data);
  },

  /**
   * 班牌解绑
   * @description
   * @param data
   * @returns
   */
  cancleBindCard: async (data: {
    classId: number; // 班级id
    uuid: string; // 设备uuid
  }) => {
    return request.post('/api/service/cancleBindCard', data);
  },

  /**
   * 获取开关机时间
   * @description
   * @param data
   * @returns
   */
  getCtrlTime: async (data: {
    schoolId: number; // 学校id
    gradeId: number; // 年级id
    classIds: number[]; // 班级id
  }) => {
    return request.post('/api/service/getCtrlTime', data);
  },

  /**
   * 设置开关机时间
   * @description schoolId和classId不能够同时为0
   * @param data
   * @returns
   */
  setCtrlTime: async (data: {
    configId?: number; // 配置id
    schoolId?: number; // 学校id
    gradeId?: number; // 年级id
    classId?: number; // 班级id
    launchTime: number; // 开机时间 从0点0分0秒开始的秒数
    shutTime: number; // 关机时间 当天0点开始算的秒数
  }) => {
    return request.post('/api/service/setCtrlTime', data);
  },

  /**
   * 批量设置开关机时间
   * @description
   * @param data
   * @returns
   */
  batchSetCtrlTime: async (data: {
    schoolId?: number; // 学校id
    launchTime: number; // 开机时间 从0点0分0秒开始的秒数
    shutTime: number; // 关机时间 当天0点开始算的秒数
  }) => {
    return request.post('/api/service/batchSetCtrlTime', data);
  },
};

export default serviceApi;
