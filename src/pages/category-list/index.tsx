import { processImageUrl, showToast } from '@/common/utils';
import { Avatar } from '@nutui/nutui-react-taro';
import { IconFont, Plus } from '@nutui/icons-react-taro';
import ListItem from '@/components/list-item';
import ListView from '@/components/list-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { globalSelector } from '@/redux/reducers/global';
import { Text, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import { ActionSheet, Button } from '@nutui/nutui-react-taro';
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
    e.stopPropagation();
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
            icon={<Avatar src={processImageUrl(item.icon)} />}
            title={item.name}
            extra={
              <>
                <Text className="item-count">{item.count}</Text>
                <IconFont className="item-more" name="more" fontClassName="iconfont" classPrefix="iconfont" size={16} onClick={(e) => onItemMoreClick(e, item, i)} />
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
      <Button
        className={`${classPrefix}--hover-button`}
        shape="round"
        type="primary"
        size="xlarge"
        onClick={onCreate}>
        <Plus color="#ffffff" size={18} />
      </Button>

      <ActionSheet
        visible={moreOpened}
        cancelText="取消"
        title={'账号分类：' + moreItem?.name}
        onClose={onCloseMoreActionSheet}
        onCancel={onCloseMoreActionSheet}
        options={[
          { name: '编辑' },
          { name: '删除' },
        ]}
        onSelect={(item) => {
          if (item.name === '编辑') {
            onUpdate(moreItem!, moreItemIndex);
          } else if (item.name === '删除') {
            onDelete(moreItem!, moreItemIndex);
          }
        }}
      />
    </View>
  );
};

export default CategoryList;
