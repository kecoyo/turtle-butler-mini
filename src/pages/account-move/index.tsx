import accountApi from '@/apis/accountApi';
import { getOpenerEventChannel, showToast } from '@/common/utils';
import Avatar from '@/components/avatar';
import Button from '@/components/button';
import ListItem from '@/components/list-item';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Radio, RadioGroup, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import classNames from 'classnames';
import { setCategoryListDataChanged } from '../category-list/reducer';
import './index.scss';
import { accountMoveSelector, clearAccountMoveState, fetchCategoryList, setAccountMoveState } from './reducer';

const classPrefix = 'lj-account-move-page';

/**
 * 账号移动
 */
const AccountMove = () => {
  const dispatch = useAppDispatch();
  const { list, selected } = useAppSelector(accountMoveSelector);
  const router = useRouter();
  const id = Number(router.params.id);
  const categoryId = Number(router.params.categoryId);

  useMount(async () => {
    await dispatch(fetchCategoryList());
    await dispatch(setAccountMoveState({ selected: categoryId }));
  });

  useUnmount(() => {
    dispatch(clearAccountMoveState());
  });

  const onRadioChange = useMemoizedFn(async (e) => {
    dispatch(setAccountMoveState({ selected: Number(e.detail.value) }));
  });

  const onSave = useMemoizedFn(async () => {
    if (!selected) {
      showToast('请选择一个分类');
      return;
    }

    // 移动账号
    await accountApi.moveAccount({ id, categoryId: selected });
    await showToast('保存成功');

    // 移动账号，需要刷新分类列表中账号数量
    dispatch(setCategoryListDataChanged());

    // 返回并通知列表刷新
    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk');
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      <RadioGroup onChange={onRadioChange}>
        <View className={`${classPrefix}--list`}>
          {list.map((item, index) => (
            <ListItem
              className={classNames({})}
              key={item.id} //
              icon={<Avatar image={item.icon} circle />}
              title={item.name}
              extra={
                <View className="item-drag">
                  <Radio value={String(item.id)} checked={selected === item.id} />
                </View>
              }
              arrow="none"
            />
          ))}
        </View>
      </RadioGroup>

      {list.length > 0 && (
        <View className={`${classPrefix}--footer`}>
          <Button type="primary" full onClick={onSave}>
            保存
          </Button>
        </View>
      )}
    </View>
  );
};

export default AccountMove;
