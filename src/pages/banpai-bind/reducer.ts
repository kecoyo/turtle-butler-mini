import serviceApi from '@/apis/serviceApi';
import { PAGE_SIZE } from '@/common/constants';
import { showToast } from '@/common/utils';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

export interface ClassManangeInfo extends ClassInfo {
  devices: string[]; // 班级绑定的设备号
}

// 为 slice state 定义一个类型
interface BanpaiBindState {
  // 筛选条件
  gradeId: number; // 年级

  // 列表数据
  list: ClassManangeInfo[];
  hasMore: boolean;
  pageIndex: number;
  pageSize: number;

  installPicture: string; // 安装照片
  envPicture: string; // 环境照片
}

// 使用该类型定义初始 state
const initialState: BanpaiBindState = {
  gradeId: 0,
  list: [],
  hasMore: true,
  pageIndex: 1,
  pageSize: PAGE_SIZE,

  installPicture: '',
  envPicture: '',
};

export const banpaiBindSlice = createSlice({
  name: 'banpaiBind',
  initialState: initialState,
  reducers: {
    // set state
    setBanpaiBindState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearBanpaiBindState: (state) => {
      Object.assign(state, initialState);
    },

    // 设置班牌绑定列表
    setBanpaiBindList: (state, action) => {
      const { classInfo, cardInfo } = action.payload;
      const classCardGroup = _.groupBy(cardInfo, 'classId');
      const banpaiBindList = classInfo.map(
        (c: any): ClassManangeInfo => ({
          id: c.classId,
          name: c.name,
          gradeId: c.gradeId,
          devices: (classCardGroup[c.classId] || []).map((card) => card.uuid),
        }),
      );
      state.list = banpaiBindList;
    },

    // 添加绑定班牌
    addBindCard: (state, action) => {
      const { classId, uuid } = action.payload;
      let info = _.find(state.list, { id: classId });
      if (info) {
        info.devices.push(uuid);
      }
    },

    // 移除绑定班牌
    removeBindCard: (state, action) => {
      const { classId, uuid } = action.payload;
      let info = _.find(state.list, { id: classId });
      if (info) {
        _.pull(info.devices, uuid);
      }
    },
  },
});

export const { setBanpaiBindState, clearBanpaiBindState, setBanpaiBindList, addBindCard, removeBindCard } = banpaiBindSlice.actions;
export const banpaiBindSelector = (state: RootState) => state.banpaiBind;

/**
 * 获取班牌列表
 */
export const fetchBanpaiList = (gradeId: number) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const { classInfo, cardInfo } = await serviceApi.getCardInfo({
    gradeId,
  });
  dispatch(setBanpaiBindList({ classInfo, cardInfo }));
};

/**
 * 班牌绑定
 */
export const bindCardAsync = (gradeId: number, classId: number, uuid: string) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const { list } = getState().banpaiBind;

  let classCardInfo = _.find(list, { id: classId });
  if (classCardInfo?.devices.includes(uuid)) {
    showToast('班牌已绑定');
    return;
  }

  await serviceApi.bindCard({
    gradeId: gradeId,
    classId: classId,
    uuid: uuid,
  });
  dispatch(addBindCard({ classId, uuid }));
  showToast('绑定成功');
};

/**
 * 取消班牌绑定
 */
export const cancelBindCardAsync = (classId: number, uuid: string) => async (dispatch: AppDispatch) => {
  await serviceApi.cancleBindCard({
    classId: classId, // 班级id
    uuid: uuid, // 设备编号
  });
  dispatch(removeBindCard({ classId, uuid }));
  showToast('解除绑定成功');
};

export default banpaiBindSlice.reducer;
