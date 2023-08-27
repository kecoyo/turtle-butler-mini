/* Core */
import { configureStore } from '@reduxjs/toolkit';
import banpaiBind from '../pages/banpai-bind/reducer';
import index from '../pages/index/reducer';
import mine from '../pages/mine/reducer';
import myTask from '../pages/my-task/reducer';
import schoolDetail from '../pages/school-detail/reducer';
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
    index,
    mine,
    updateProfile,
    myTask,
    schoolDetail,
    banpaiBind,
    textEdit,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppGetState = typeof store.getState;

export type AppDispatch = typeof store.dispatch;

export default store;
