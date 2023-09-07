import { showModal, showToast } from '@/common/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';

/**
 * 加入学校申请
 */
export interface ApplyInfo {
  schoolId: number;
  schoolName: string;
  status: number;
}

// 为 slice state 定义一个类型
interface MyTaskState {
  applyInfo?: ApplyInfo;

  // 退出学校
  sendCodeModalVisible?: boolean;
}

// 使用该类型定义初始 state
const initialState: MyTaskState = {
  applyInfo: undefined,
  sendCodeModalVisible: false,
};

export const myTaskSlice = createSlice({
  name: 'myTask',
  initialState: initialState,
  reducers: {
    // set state
    setMyTaskState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearMyTaskState: (state) => {
      Object.assign(state, initialState);
    },
    // 打开退出学校弹框
    openSendCodeModal: (state) => {
      state.sendCodeModalVisible = true;
    },
    // 关闭退出学校弹框
    closeSendCodeModal: (state) => {
      state.sendCodeModalVisible = false;
    },
    // 设置加入学校申请信息
    setApplyInfo: (state, action) => {
      const payload = action.payload;
      if (payload && payload.schoolId) {
        let applyInfo: ApplyInfo = {
          schoolId: payload.schoolId,
          schoolName: payload.name,
          status: payload.status,
        };
        state.applyInfo = applyInfo;
      } else {
        state.applyInfo = undefined;
      }
    },
    // 清除加入学校的申请
    clearApplyInfo: (state) => {
      state.applyInfo = undefined;
    },
  },
});
export const { setMyTaskState, clearMyTaskState, openSendCodeModal, closeSendCodeModal, setApplyInfo, clearApplyInfo } = myTaskSlice.actions;

export const myTaskSelector = (state: RootState) => state.myTask;

/**
 * 获取我的任务信息
 * @param id
 * @returns
 */
export const fetchJoinSchoolApplyInfo = () => async (dispatch: AppDispatch) => {
  const { schoolInfo, applyInfo } = await schoolApi.getMyTaskInfo();
  // 返回数据里有schoolInfo:学校信息,applyInfo:申请入校信息，两个不会同时有
  dispatch(setApplyInfo(applyInfo));
};

/**
 * 退出学校
 */
export const quitSchoolAsync = (phone: string, code: string) => async (dispatch: AppDispatch) => {
  await schoolApi.quitSchool({ phone: phone, code });
  showModal({
    content: '已退出学校',
    onOk: () => {
      Taro.navigateBack();
    },
  });
};

/**
 * 取消申请入校
 */
export const cancelApplyAsync = () => async (dispatch: AppDispatch) => {
  await schoolApi.cancelApply();
  dispatch(clearApplyInfo());
  showToast('取消成功');
};

export default myTaskSlice.reducer;
