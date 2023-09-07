import categoryApi from '@/apis/categoryApi';
import { showToast } from '@/common/utils';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface CategoryEditState {
  id: number; // 分类ID
  name: string; // 分类名称
  icon: string; // 分类图标
}

// 使用该类型定义初始 state
const initialState: CategoryEditState = {
  id: 0,
  name: '',
  icon: '',
};

export const categoryEditSlice = createSlice({
  name: 'categoryEdit',
  initialState: initialState,
  reducers: {
    // set state
    setCategoryEditState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearCategoryEditState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setCategoryEditState, clearCategoryEditState } = categoryEditSlice.actions;
export const categoryEditSelector = (state: RootState) => state.categoryEdit;

/**
 * 获取分类信息
 */
export const fetchCategoryInfo = (categoryId: number) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const info = await categoryApi.getCategoryInfo({
    id: categoryId,
  });
  dispatch(setCategoryEditState(info));
};

/**
 * 保存账号分类
 */
export const saveCategoryAsync = (data: { id?: number; name: string; icon: string }) => async (dispatch: AppDispatch) => {
  if (data.id) {
    await categoryApi.updateCategory({ ...data, id: data.id });
  } else {
    await categoryApi.createCategory({ ...data });
  }
  showToast('保存成功');
};

export default categoryEditSlice.reducer;
