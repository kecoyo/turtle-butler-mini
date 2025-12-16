import { getOpenerEventChannel, processImageUrl } from '@/common/utils';
import { Avatar } from '@nutui/nutui-react-taro';
import ScrollView from '@/components/scroll-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn, useMount } from 'ahooks';
import { Tabs } from '@nutui/nutui-react-taro';
import './index.scss';
import { fetchIconSelectList, iconSelectSelector, setIconSelectState } from './reducer';

const classPrefix = 'lj-icon-select-page';

/**
 * 图片选择
 */
const IconSelect = () => {
  const dispatch = useAppDispatch();
  const { iconList, tabList, tabIndex } = useAppSelector(iconSelectSelector);

  useMount(() => {
    if (iconList.length === 0) {
      dispatch(fetchIconSelectList());
    }
  });

  const onTabIndexChange = useMemoizedFn((value: string | number) => {
    const index = typeof value === 'number' ? value : parseInt(value as string, 10);
    dispatch(setIconSelectState({ tabIndex: index }));
  });

  const onIconClick = useMemoizedFn((icon: string) => {
    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk', icon);
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      <Tabs value={tabIndex} onChange={onTabIndexChange}>
        {iconList.map((item, i) => (
          <Tabs.TabPane key={i} title={tabList[i]?.title || ''}>
            <ScrollView>
              <View className={`${classPrefix}--icon-list`}>
                {(item.icons || []).map((icon, j) => (
                  <View key={j} className={`${classPrefix}--icon-item`} onClick={() => onIconClick(icon)}>
                    <Avatar src={processImageUrl(icon)} />
                  </View>
                ))}
              </View>
            </ScrollView>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </View>
  );
};

export default IconSelect;
