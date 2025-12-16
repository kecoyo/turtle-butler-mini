import { processImageUrl } from '@/common/utils';
import { Avatar } from '@nutui/nutui-react-taro';
import { IconFont, Plus } from '@nutui/icons-react-taro';
import ListItem from '@/components/list-item';
import ListView from '@/components/list-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import _ from 'lodash';
import { ActionSheet, Button } from '@nutui/nutui-react-taro';
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
    e.stopPropagation();
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
            icon={<Avatar src={processImageUrl(item.icon)} />}
            title={item.name}
            note={_.get(item, 'properties[0].name') + '：' + _.get(item, 'properties[0].value')}
            extra={
              <>
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
        title={'账号：' + moreItem?.name}
        onClose={onCloseMoreActionSheet}
        onCancel={onCloseMoreActionSheet}
        options={[
          { name: '编辑' },
          { name: '删除' },
          { name: '移动' },
        ]}
        onSelect={(item) => {
          if (item.name === '编辑') {
            onUpdate(moreItem!, moreItemIndex!);
          } else if (item.name === '删除') {
            onDelete(moreItem!, moreItemIndex!);
          } else if (item.name === '移动') {
            onMove(moreItem!, moreItemIndex!);
          }
        }}
      />
    </View>
  );
};

export default AccountList;
