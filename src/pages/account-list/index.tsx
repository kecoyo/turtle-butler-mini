import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import ListItem from '@/components/list-item';
import ListView from '@/components/list-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import _ from 'lodash';
import { AtActionSheet, AtActionSheetItem, AtFab } from 'taro-ui';
import { setCategoryListDataChanged } from '../category-list/reducer';
import './index.scss';
import { accountListSelector, clearAccountListState, closeMoreActionSheet, deleteAccountAsync, fetchAccountList, openMoreActionSheet } from './reducer';

const classPrefix = 'lj-account-list-page';

/**
 * 账号列表
 */
const AccountList = () => {
  const dispatch = useAppDispatch();
  const { list, moreOpened, moreItem, moreItemIndex, dataChanged } = useAppSelector(accountListSelector);
  const router = useRouter();
  const categoryId = Number(router.params.categoryId);
  const categoryName = String(router.params.categoryName);

  useMount(() => {
    Taro.setNavigationBarTitle({
      title: categoryName,
    });
    onLoad();
  });

  useDidShow(() => {
    if (dataChanged) {
      onLoad();
    }
  });

  useUnmount(() => {
    dispatch(clearAccountListState());
  });

  const onLoad = useMemoizedFn(async () => {
    await dispatch(fetchAccountList(categoryId));
  });

  const onCreate = useMemoizedFn(async () => {
    Taro.navigateTo({
      url: '/pages/account-edit/index?categoryId=' + categoryId,
      events: {
        onOk: () => {
          onLoad();
          // 添加了新账号，需要刷新分类列表中账号数量
          dispatch(setCategoryListDataChanged());
        },
      },
    });
  });

  const onUpdate = useMemoizedFn((item: AccountInfo, index: number) => {
    onCloseMoreActionSheet();

    Taro.navigateTo({
      url: '/pages/account-edit/index?id=' + item.id,
      events: {
        onOk: onLoad,
      },
    });
  });

  const onMove = useMemoizedFn((item: AccountInfo, index: number) => {
    onCloseMoreActionSheet();

    Taro.navigateTo({
      url: '/pages/account-move/index?id=' + item.id + '&categoryId=' + categoryId,
      events: {
        onOk: onLoad,
      },
    });
  });

  const onDelete = useMemoizedFn((item: AccountInfo, index: number) => {
    onCloseMoreActionSheet();

    dispatch(deleteAccountAsync(item.id));
  });

  // 点击more, 打开ActionSheet
  const onItemMoreClick = useMemoizedFn((e: any, item: AccountInfo, index?: number) => {
    e[0].stopPropagation();

    dispatch(openMoreActionSheet({ item, index }));
  });

  // 关闭ActionSheet
  const onCloseMoreActionSheet = useMemoizedFn(() => {
    dispatch(closeMoreActionSheet());
  });

  const onItemClick = useMemoizedFn((item: AccountInfo) => {
    Taro.navigateTo({
      url: '/pages/account-detail/index?id=' + item.id,
    });
  });

  const onItemLongPress = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/account-sort/index?categoryId=' + categoryId,
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
            note={_.get(item, 'properties[0].name') + '：' + _.get(item, 'properties[0].value')}
            extra={
              <>
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

      <AtActionSheet isOpened={moreOpened} cancelText="取消" title={'账号：' + moreItem?.name} onClose={onCloseMoreActionSheet} onCancel={onCloseMoreActionSheet}>
        <AtActionSheetItem className="item-update" onClick={() => onUpdate(moreItem!, moreItemIndex!)}>
          编辑
        </AtActionSheetItem>
        <AtActionSheetItem className="item-delete" onClick={() => onDelete(moreItem!, moreItemIndex!)}>
          删除
        </AtActionSheetItem>
        <AtActionSheetItem className="item-move" onClick={() => onMove(moreItem!, moreItemIndex!)}>
          移动
        </AtActionSheetItem>
      </AtActionSheet>
    </View>
  );
};

export default AccountList;
