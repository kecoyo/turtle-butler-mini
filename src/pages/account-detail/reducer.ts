import accountApi from '@/apis/accountApi';
import { showToast } from '@/common/utils';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface AccountDetailState {
  account?: AccountInfo; // 账号信息

  isEditing: boolean;
}

// 使用该类型定义初始 state
const initialState: AccountDetailState = {
  account: undefined,
  isEditing: false,
};

export const accountDetailSlice = createSlice({
  name: 'accountDetail',
  initialState: initialState,
  reducers: {
    // set state
    setAccountDetailState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearAccountDetailState: (state) => {
      Object.assign(state, initialState);
    },

    // 设置账号名称
    setAccountName: (state, action) => {
      if (state.account) {
        state.account.name = action.payload;
      }
    },
    // 设置账号图标
    setAccountIcon: (state, action) => {
      if (state.account) {
        state.account.icon = action.payload;
      }
    },
    // 设置账号备注
    setAccountRemark: (state, action) => {
      if (state.account) {
        state.account.remark = action.payload;
      }
    },
    // 添加账号属性
    addAccountProperty: (state, action) => {
      if (state.account) {
        const property = action.payload as AccountProperty;
        state.account.properties.push(property);
      }
    },
    // 删除账号属性
    removeAccountProperty: (state, action) => {
      if (state.account) {
        const index = action.payload as number;
        state.account.properties.splice(index, 1);
      }
    },
    // 修改账号属性值
    changeAccountProperty: (state, action) => {
      if (state.account) {
        const { index, value } = action.payload;
        state.account.properties[index].value = value;
      }
    },
    // 添加账号图片
    addAccountPicture: (state, action) => {
      if (state.account) {
        const picture = action.payload as AccountPicture;
        state.account.pictures.push(picture);
      }
    },
    // 删除账号图片
    removeAccountPicture: (state, action) => {
      if (state.account) {
        const index = action.payload as number;
        state.account.pictures.splice(index, 1);
      }
    },
  },
});

export const {
  setAccountDetailState,
  clearAccountDetailState,
  setAccountName,
  setAccountIcon,
  setAccountRemark,
  addAccountProperty,
  removeAccountProperty,
  changeAccountProperty,
  addAccountPicture,
  removeAccountPicture,
} = accountDetailSlice.actions;
export const accountDetailSelector = (state: RootState) => state.accountDetail;

/**
 * 获取账号信息
 */
export const fetchAccountInfo = (id: number) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const info = await accountApi.getAccountInfo({ id });
  dispatch(setAccountDetailState({ account: info }));
};

/**
 * 保存账号信息
 */
export const saveAccountAsync = (account: AccountInfo) => async (dispatch: AppDispatch) => {
  if (account.id) {
    await accountApi.updateAccount(account);
  } else {
    await accountApi.createAccount(account);
  }
  showToast('保存成功');
};

export default accountDetailSlice.reducer;
