import React from 'react';
import { Provider } from 'react-redux';
import { hideLoading, showErrorMsg, showLoading } from './common/utils';
import { checkLogin } from './common/wxLogin';
import { fetchConfig, initConfigFromStorage } from './redux/reducers/config';
import { fetchAllAreas } from './redux/reducers/global';
import store from './redux/store';
import './styles/global.scss';

type Props = {
  children: React.ReactNode;
};

class App extends React.Component<Props> {
  async onLaunch() {
    store.dispatch(fetchAllAreas());

    showLoading();
    try {
      await checkLogin();
    } catch (err) {
      showErrorMsg(err);
    } finally {
      hideLoading();
    }

    store.dispatch(initConfigFromStorage());
    // store.dispatch(fetchConfig());
  }

  render() {
    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}
export default App;
