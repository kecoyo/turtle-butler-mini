import { getConfigUrl } from '@/common/utils';
import { useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { View, WebView as TaroWebView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { useMount } from 'ahooks';
import _ from 'lodash';
import { useState } from 'react';
import './index.scss';

const classPrefix = 'lj-web-view-page';

/**
 * 内嵌网页
 */
const WebView = () => {
  const config = useAppSelector(configSelector);
  const router = useRouter();
  const [src, setSrc] = useState('');

  useMount(() => {
    const { key } = router.params;
    let url = _.get(config, `webview.${key}`);
    if (url) {
      setSrc(getConfigUrl(url));
    }
  });

  return (
    <View className={classPrefix}>
      <TaroWebView src={src} />
    </View>
  );
};

export default WebView;
