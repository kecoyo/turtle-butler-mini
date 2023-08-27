import openApi from '@/apis/openApi';
import userApi from '@/apis/userApi';
import { showModal, showToast } from '@/common/utils';
import { silentLogin } from '@/common/wxLogin';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';

// 为 slice state 定义一个类型
interface UpdateProfileState {
  // 基本信息
  name: string; // 姓名
  avatar: string; // 头像
  gender: number; // 性别
  phone: string; // 手机号
  code: string; // 手机验证码
  idCard: string; // 身份证
  birthday: string; // 出生日期
  email: string; // 邮箱
  province: number; // 省
  city: number; // 市
  county: number; // 区县
  remark: string; // 个性签名
}

// 使用该类型定义初始 state
const initialState: UpdateProfileState = {
  name: '',
  avatar: '',
  gender: 0,
  phone: '',
  code: '',
  idCard: '',
  email: '',
  birthday: '',
  province: 0,
  city: 0,
  county: 0,
  remark: '',
};

export const updateProfileSlice = createSlice({
  name: 'updateProfile',
  initialState: initialState,
  reducers: {
    // set state
    setUpdateProfileState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearUpdateProfileState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUpdateProfileState, clearUpdateProfileState } = updateProfileSlice.actions;
export const updateProfileSelector = (state: RootState) => state.updateProfile;

/**
 * 获取手机公开设置
 * @returns
 */
export const fetchExtendInfo = () => async (dispatch: AppDispatch) => {
  const extendInfo = await userApi.getExtendInfo({});
  dispatch(
    setUpdateProfileState({
      ...extendInfo,
      birth: extendInfo.birth ? dayjs(extendInfo.birth * 1000).format('YYYY-MM-DD') : '',
    }),
  );
};

export const updateProfileAsync = () => async (dispatch: AppDispatch, getState: AppGetState) => {
  const { avatar, name, phone, gender, email, idCard, code } = getState().updateProfile;
  const { faceImg, birth, bloodType, interests, introduce } = getState().updateProfile;

  if (!name) {
    showToast('请输入真实姓名');
    return;
  }
  if (!phone) {
    showToast('请输入手机号');
    return;
  }

  // 基本信息
  const baseInfo = { avatar, name, phone, gender, email, idCard, code };
  const extendInfo = {
    faceImg,
    birth: birth ? dayjs(birth).unix() : 0,
    bloodType,
    interests,
    introduce,
  };

  await userApi.updateUserInfo({ role: 1, ...baseInfo, ...extendInfo });
  // token变化了，静默登录，获取最新用户信息
  silentLogin();

  showModal({
    content: '修改成功',
    onOk: () => {
      Taro.navigateBack();
    },
  });
};

// 修改基本信息
export const updateBaseInfoAsync = (baseInfo: any) => async (dispatch: AppDispatch, getState: AppGetState) => {
  await openApi.updateBaseInfo(baseInfo);
  showToast('修改成功');
  dispatch(setUpdateProfileState(baseInfo));
};

export default updateProfileSlice.reducer;
