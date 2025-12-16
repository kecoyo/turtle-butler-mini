import userApi from '@/apis/userApi';
import { showToast } from '@/common/utils';
import { updateUserInfo } from '@/redux/reducers/global';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface UpdateProfileState {
  // 基本信息
  nickname: string; // 昵称
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
  nickname: '',
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


// 修改用户信息
export const updateUserInfoAsync = (baseInfo: any) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const response = await userApi.updateUserInfo(baseInfo);
  showToast('修改成功');
  // 使用API返回的完整用户数据更新本地状态
  if (response) {
    dispatch(setUpdateProfileState(response));
    // 更新全局userInfo，使用服务器返回的完整数据
    dispatch(updateUserInfo(response));
  } else {
    // 如果API没有返回数据，则使用传入的数据
    dispatch(setUpdateProfileState(baseInfo));
    const updateData = { ...baseInfo };
    // 统一使用nickname字段，如果传入了name则转换为nickname
    if ((updateData as any).name && !updateData.nickname) {
      updateData.nickname = (updateData as any).name;
      delete (updateData as any).name;
    }
    dispatch(updateUserInfo(updateData));
  }
};

export default updateProfileSlice.reducer;
