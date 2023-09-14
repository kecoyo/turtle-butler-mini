import categoryApi from '@/apis/categoryApi';
import { showConfirm, showToast } from '@/common/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface CategoryListState {
  list: CategoryInfo[]; // 分类列表

  // more actionsheet
  moreOpened: boolean;
  moreItem?: CategoryInfo;
  moreItemIndex?: number;

  // 数据已经变化，需要刷新
  dataChanged: boolean;
}

// 使用该类型定义初始 state
const initialState: CategoryListState = {
  list: [],

  moreOpened: false,
  moreItem: undefined,
  moreItemIndex: undefined,

  dataChanged: false,
};

export const categoryListSlice = createSlice({
  name: 'categoryList',
  initialState: initialState,
  reducers: {
    // set state
    setCategoryListState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearCategoryListState: (state) => {
      Object.assign(state, initialState);
    },

    // 设置分类列表
    setCategoryList: (state, action) => {
      let list = action.payload;
      const categoryList: CategoryInfo[] = list.map(
        (item: any): CategoryInfo => ({
          ...item,
        }),
      );
      state.list = categoryList;
      state.dataChanged = false;
    },

    // 设置分类列表数据改变了，需要刷新
    setCategoryListDataChanged: (state) => {
      state.dataChanged = true;
    },

    // 删除分类
    deleteCategory: (state, action) => {
      let id = action.payload;
      let index = state.list.findIndex((item) => item.id === id);
      if (index >= 0) {
        state.list.splice(index, 1);
      }
    },

    // 打开MoreActionSheet
    openMoreActionSheet: (state, action) => {
      const { item, index } = action.payload;
      state.moreOpened = true;
      state.moreItem = item;
      state.moreItemIndex = index;
    },

    // 关闭MoreActionSheet
    closeMoreActionSheet: (state) => {
      state.moreOpened = false;
      state.moreItem = undefined;
      state.moreItemIndex = undefined;
    },
  },
});

export const { setCategoryListState, clearCategoryListState, setCategoryList, setCategoryListDataChanged, deleteCategory, openMoreActionSheet, closeMoreActionSheet } =
  categoryListSlice.actions;
export const categoryListSelector = (state: RootState) => state.categoryList;

/**
 *  获取分类列表
 */
export const fetchCategoryList = () => async (dispatch: AppDispatch) => {
  let list = await categoryApi.getCategoryList();
  dispatch(setCategoryList(list));
};

/**
 * 删除分类
 */
export const deleteCategoryAsync = (id: number) => async (dispatch: AppDispatch) => {
  await new Promise((resolve, reject) => {
    showConfirm({
      content: '您确定要删除该分类吗？',
      onOk: async () => {
        await categoryApi.deleteCategory({ id });
        await showToast('删除成功');

        dispatch(deleteCategory(id));

        resolve(true);
      },
    });
  });
};

export default categoryListSlice.reducer;
