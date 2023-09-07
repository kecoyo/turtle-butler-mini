/* Core */
import { configureStore } from '@reduxjs/toolkit';
import accountDetail from '../pages/account-detail/reducer';
import accountEdit from '../pages/account-edit/reducer';
import accountList from '../pages/account-list/reducer';
import categoryEdit from '../pages/category-edit/reducer';
import categoryList from '../pages/category-list/reducer';
import iconSelect from '../pages/icon-select/reducer';
import mine from '../pages/mine/reducer';
import textEdit from '../pages/text-edit/reducer';
import updateProfile from '../pages/update-profile/reducer';
import { middleware } from './middleware';
import config from './reducers/config';
import global from './reducers/global';

const store = configureStore({
  reducer: {
    // common
    global,
    config,

    // pages
    categoryList,
    categoryEdit,
    accountList,
    accountEdit,
    accountDetail,

    mine,
    updateProfile,

    textEdit,
    iconSelect,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppGetState = typeof store.getState;

export type AppDispatch = typeof store.dispatch;

export default store;
