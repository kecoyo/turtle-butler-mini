import { getConfigUrl } from '@/common/utils';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import Image from '@/components/image';
import ListItem from '@/components/list-item';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { globalSelector } from '@/redux/reducers/global';
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import './index.scss';

const classPrefix = 'lj-mine-page';

/**
 * 我的
 */
const Mine = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(configSelector);
  const { userInfo } = useAppSelector(globalSelector);

  const items = [
    { key: 'update-profile', title: '修改个人资料', icon: <Icon prefixClass="iconfont" value="profile" size="small" />, extra: null },
    { key: 'logoff', title: '退出账号', icon: <Icon prefixClass="iconfont" value="exit" size="small" />, extra: null },
  ];

  const onItemClick = useMemoizedFn((item) => {
    switch (item.key) {
      case 'update-profile':
        Taro.navigateTo({ url: '/pages/update-profile/index' });
        break;
      case 'logoff':
        Taro.navigateTo({ url: '/pages/logoff/index' });
        break;
      default:
        break;
    }
  });

  return (
    <View className={classPrefix}>
      <Image className="top-image" src={getConfigUrl(config.mine.bg_png)} mode="aspectFill" />
      <View className={`${classPrefix}--user-info`}>
        <Avatar className="avatar" image={userInfo?.avatar} circle size="large" />
        <Text className="user-name">{userInfo?.name || (userInfo as any)?.nickname || '未登录'}</Text>
      </View>
      <View className={`${classPrefix}--list`}>
        {items.map((item) => (
          <ListItem
            key={item.key} //
            icon={item.icon}
            title={item.title}
            extra={item.extra}
            onClick={() => onItemClick(item)}
          />
        ))}
      </View>
    </View>
  );
};

export default Mine;
