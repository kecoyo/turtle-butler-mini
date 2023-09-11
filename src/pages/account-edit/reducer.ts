import accountApi from '@/apis/accountApi';
import { showToast } from '@/common/utils';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface AccountEditState {
  account?: AccountInfo; // 账号信息

  isEditing: boolean;
}

// 使用该类型定义初始 state
const initialState: AccountEditState = {
  account: undefined,
  isEditing: false,
};

export const accountEditSlice = createSlice({
  name: 'accountEdit',
  initialState: initialState,
  reducers: {
    // set state
    setAccountEditState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearAccountEditState: (state) => {
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
        const property = action.payload as PropertyItem;
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
    updateAccountProperty: (state, action) => {
      if (state.account) {
        const { index, value } = action.payload;
        state.account.properties[index].value = value;
      }
    },
    // 排序账号属性
    sortAccountProperty: (state, action) => {
      if (state.account) {
        const { startIndex, toIndex } = action.payload;
        let item = state.account.properties[startIndex];
        state.account.properties.splice(startIndex, 1);
        state.account.properties.splice(toIndex, 0, item);
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
  setAccountEditState,
  clearAccountEditState,
  setAccountName,
  setAccountIcon,
  setAccountRemark,
  addAccountProperty,
  removeAccountProperty,
  updateAccountProperty,
  sortAccountProperty,
  addAccountPicture,
  removeAccountPicture,
} = accountEditSlice.actions;
export const accountEditSelector = (state: RootState) => state.accountEdit;

/**
 * 获取账号信息
 */
export const fetchAccountInfo = (id: number) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const info = await accountApi.getAccountInfo({ id });
  dispatch(setAccountEditState({ account: info }));
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

export default accountEditSlice.reducer;
