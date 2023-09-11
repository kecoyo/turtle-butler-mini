import { showConfirm, showToast } from '@/common/utils';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import ListItem from '@/components/list-item';
import ListView from '@/components/list-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { globalSelector } from '@/redux/reducers/global';
import { MovableArea, MovableView, Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import { AtFab, AtSwipeAction } from 'taro-ui';
import './index.scss';
import { categoryListSelector, deleteCategoryAsync, fetchCategoryList, setSwipeActionClosed, setSwipeActionOpened } from './reducer';

const classPrefix = 'lj-category-list-page';

/**
 * 分类列表
 */
const CategoryList = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(globalSelector);
  const { list, dataChanged } = useAppSelector(categoryListSelector);

  // 登录成功后，加载分类列表
  useMount(() => {
    if (userInfo) onLoad();
  });

  useDidShow(() => {
    if (dataChanged) {
      onLoad();
    }
  });

  // 用户信息变化时，更新分类列表
  useUpdateEffect(() => {
    if (userInfo) onLoad();
  }, [userInfo]);

  const onLoad = useMemoizedFn(async () => {
    await dispatch(fetchCategoryList());
  });

  const onCreate = useMemoizedFn(async () => {
    Taro.navigateTo({
      url: '/pages/category-edit/index',
      events: {
        onOk: onLoad,
      },
    });
  });

  const onSwipeActionOpened = useMemoizedFn((index?: number) => {
    dispatch(setSwipeActionOpened(index));
  });

  const onSwipeActionClosed = useMemoizedFn((index?: number) => {
    dispatch(setSwipeActionClosed(index));
  });

  const onSwipeActionClick = useMemoizedFn((e, item, index?: number) => {
    switch (e.text) {
      case '编辑':
        onUpdate(item, index);
        break;
      case '删除':
        onDelete(item, index);
        break;
      default:
        break;
    }
  });

  const onUpdate = useMemoizedFn((item: any, index?: number) => {
    Taro.navigateTo({
      url: '/pages/category-edit/index?id=' + item.id,
      events: {
        onOk: onLoad,
      },
    });
  });

  const onDelete = useMemoizedFn((item: CategoryInfo, index?: number) => {
    if ((item.count || 0) > 0) {
      showToast('分类不为空，不能删除');
      return;
    }

    showConfirm({
      content: '您确定要删除该分类吗？',
      onOk: async () => {
        await dispatch(deleteCategoryAsync(item.id, index));
        await onLoad();
      },
    });
  });

  const onItemClick = useMemoizedFn((item) => {
    Taro.navigateTo({
      url: '/pages/account-list/index?categoryId=' + item.id + '&categoryName=' + item.name,
      events: {
        onRefresh: onLoad,
      },
    });
  });

  return (
    <View className={classPrefix}>
      <MovableArea style={{ display: 'none' }}></MovableArea>
      <MovableView style={{ display: 'none' }}></MovableView>
      <ListView
        onLoad={onLoad}
        list={list}
        renderItem={(item, i) => (
          <AtSwipeAction
            onOpened={() => onSwipeActionOpened(i)}
            onClosed={() => onSwipeActionClosed(i)}
            isOpened={item.isOpened}
            autoClose
            options={[
              { text: '编辑', style: { backgroundColor: '#6190E8' } },
              { text: '删除', style: { backgroundColor: '#FF4949' } },
            ]}
            onClick={(e) => onSwipeActionClick(e, item, i)}
          >
            <ListItem
              key={item.id} //
              icon={<Avatar image={item.icon} circle />}
              title={item.name}
              extra={<Text className="item-count">{item.count}</Text>}
              onClick={() => onItemClick(item)}
            />
          </AtSwipeAction>
        )}
        pullDownRefresh
      />
      <AtFab className={`${classPrefix}--fab-button`} onClick={onCreate}>
        <Icon value="add" color="#ffffff" />
      </AtFab>
    </View>
  );
};

export default CategoryList;
