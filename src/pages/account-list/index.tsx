import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import ListItem from '@/components/list-item';
import ListView from '@/components/list-view';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount } from 'ahooks';
import _ from 'lodash';
import { AtFab, AtSwipeAction } from 'taro-ui';
import { setCategoryListDataChanged } from '../category-list/reducer';
import './index.scss';
import { accountListSelector, deleteAccountAsync, fetchAccountList, setSwipeActionClosed, setSwipeActionOpened } from './reducer';

const classPrefix = 'lj-account-list-page';

/**
 * 账号列表
 */
const AccountList = () => {
  const dispatch = useAppDispatch();
  const { list, dataChanged } = useAppSelector(accountListSelector);
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

  const onSwipeActionOpened = useMemoizedFn((index: number) => {
    dispatch(setSwipeActionOpened(index));
  });

  const onSwipeActionClosed = useMemoizedFn((index: number) => {
    dispatch(setSwipeActionClosed(index));
  });

  const onSwipeActionClick = useMemoizedFn((e, item) => {
    switch (e.text) {
      case '编辑':
        onEdit(item);
        break;
      case '删除':
        onDelete(item);
        break;
      default:
        break;
    }
  });

  const onEdit = useMemoizedFn((item: CategoryInfo) => {
    Taro.navigateTo({
      url: '/pages/account-edit/index?id=' + item.id,
      events: {
        onOk: onLoad,
      },
    });
  });

  const onDelete = useMemoizedFn((item: AccountInfo) => {
    dispatch(deleteAccountAsync(item.id));
  });

  const onItemClick = useMemoizedFn((item: AccountInfo) => {
    Taro.navigateTo({
      url: '/pages/account-detail/index?id=' + item.id,
    });
  });

  return (
    <View className={classPrefix}>
      <ListView
        onLoad={onLoad}
        list={list}
        renderItem={(item, i) => (
          <AtSwipeAction
            onOpened={() => onSwipeActionOpened(i || 0)}
            onClosed={() => onSwipeActionClosed(i || 0)}
            isOpened={item.isOpened}
            autoClose
            options={[
              { text: '编辑', style: { backgroundColor: '#6190E8' } },
              { text: '删除', style: { backgroundColor: '#FF4949' } },
            ]}
            onClick={(e) => onSwipeActionClick(e, item)}
          >
            <ListItem
              key={item.id} //
              icon={<Avatar image={item.icon} circle />}
              title={item.name}
              note={_.get(item, 'properties[0].name') + '：' + _.get(item, 'properties[0].value')}
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

export default AccountList;
