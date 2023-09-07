import categoryApi from '@/apis/categoryApi';
import { showToast } from '@/common/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface CategoryListState {
  list: CategoryInfo[]; // 分类列表
}

// 使用该类型定义初始 state
const initialState: CategoryListState = {
  list: [],
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
    },

    // 关闭列表项的SwipeAction
    setSwipeActionOpened: (state, action) => {
      for (let i = 0; i < state.list.length; i++) {
        const item = state.list[i];
        item.isOpened = i === action.payload;
      }
    },
    // 打开列表项的SwipeAction
    setSwipeActionClosed: (state, action) => {
      let index = action.payload;
      state.list[index].isOpened = false;
    },
  },
});

export const { setCategoryListState, clearCategoryListState, setCategoryList, setSwipeActionOpened, setSwipeActionClosed } = categoryListSlice.actions;
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
export const deleteCategoryAsync = (id: number, index?: number) => async (dispatch: AppDispatch) => {
  await categoryApi.deleteCategory({ id });
  showToast('删除成功');
};

export default categoryListSlice.reducer;
