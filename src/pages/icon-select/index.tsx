import { getOpenerEventChannel } from '@/common/utils';
import Avatar from '@/components/avatar';
import ScrollView from '@/components/scroll-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn, useMount } from 'ahooks';
import { AtTabs, AtTabsPane } from 'taro-ui';
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

  const onTabIndexChange = useMemoizedFn((index: number) => dispatch(setIconSelectState({ tabIndex: index })));

  const onIconClick = useMemoizedFn((icon: string) => {
    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk', icon);
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      <AtTabs tabList={tabList} current={tabIndex} onClick={onTabIndexChange}>
        {iconList.map((item, i) => (
          <AtTabsPane key={i} current={tabIndex} index={i}>
            <ScrollView>
              <View className={`${classPrefix}--icon-list`}>
                {(item.icons || []).map((icon, j) => (
                  <View key={j} className={`${classPrefix}--icon-item`} onClick={() => onIconClick(icon)}>
                    <Avatar image={icon} circle />
                  </View>
                ))}
              </View>
            </ScrollView>
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  );
};

export default IconSelect;
