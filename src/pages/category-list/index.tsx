import { showToast } from '@/common/utils';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import ListItem from '@/components/list-item';
import ListView from '@/components/list-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { globalSelector } from '@/redux/reducers/global';
import { Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import { AtActionSheet, AtActionSheetItem, AtFab } from 'taro-ui';
import './index.scss';
import { categoryListSelector, closeMoreActionSheet, deleteCategoryAsync, fetchCategoryList, openMoreActionSheet } from './reducer';

const classPrefix = 'lj-category-list-page';

/**
 * 分类列表
 */
const CategoryList = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(globalSelector);
  const { list, moreOpened, moreItem, moreItemIndex, dataChanged } = useAppSelector(categoryListSelector);

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

  const onUpdate = useMemoizedFn((item: CategoryInfo, index?: number) => {
    onCloseMoreActionSheet();

    Taro.navigateTo({
      url: '/pages/category-edit/index?id=' + item.id,
      events: {
        onOk: onLoad,
      },
    });
  });

  const onDelete = useMemoizedFn(async (item: CategoryInfo, index?: number) => {
    onCloseMoreActionSheet();

    if ((item.count || 0) > 0) {
      showToast('分类不为空，不能删除');
      return;
    }

    await dispatch(deleteCategoryAsync(item.id));
  });

  // 关闭ActionSheet
  const onCloseMoreActionSheet = useMemoizedFn(() => {
    dispatch(closeMoreActionSheet());
  });

  const onItemMoreClick = useMemoizedFn((e: any, item: CategoryInfo, index?: number) => {
    e[0].stopPropagation();

    dispatch(openMoreActionSheet({ item, index }));
  });

  const onItemClick = useMemoizedFn((item) => {
    Taro.navigateTo({
      url: '/pages/account-list/index?categoryId=' + item.id + '&categoryName=' + item.name,
      events: {
        onRefresh: onLoad,
      },
    });
  });

  const onItemLongPress = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/category-sort/index',
      events: {
        onOk: onLoad,
      },
    });
  });

  const renderFooter = useMemoizedFn(() => {
    return <View className={`${classPrefix}--footer`}></View>;
  });

  return (
    <View className={classPrefix}>
      <ListView
        onLoad={onLoad}
        list={list}
        renderItem={(item, i) => (
          <ListItem
            key={item.id} //
            icon={<Avatar image={item.icon} circle />}
            title={item.name}
            extra={
              <>
                <Text className="item-count">{item.count}</Text>
                <Icon className="item-more" value="more" prefixClass="iconfont" onClick={(e) => onItemMoreClick(e, item, i)} />
              </>
            }
            arrow="none"
            onClick={() => onItemClick(item)}
            onLongPress={() => onItemLongPress()}
          />
        )}
        pullDownRefresh
        renderFooter={renderFooter}
      />
      <AtFab className={`${classPrefix}--fab-button`} onClick={onCreate}>
        <Icon value="add" color="#ffffff" />
      </AtFab>

      <AtActionSheet isOpened={moreOpened} cancelText="取消" title={'账号分类：' + moreItem?.name} onClose={onCloseMoreActionSheet} onCancel={onCloseMoreActionSheet}>
        <AtActionSheetItem onClick={() => onUpdate(moreItem!, moreItemIndex)}>编辑</AtActionSheetItem>
        <AtActionSheetItem onClick={() => onDelete(moreItem!, moreItemIndex)}>
          <Text className="item-delete">删除</Text>
        </AtActionSheetItem>
      </AtActionSheet>
    </View>
  );
};

export default CategoryList;
