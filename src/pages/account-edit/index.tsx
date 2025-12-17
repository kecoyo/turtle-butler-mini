import { getOpenerEventChannel, processImageUrl, showToast } from '@/common/utils';
import AccountPanel from '@/components/account-panel';
import { Avatar } from '@nutui/nutui-react-taro';
import { Button } from '@nutui/nutui-react-taro';
import IconSelectPicker from '@/components/icon-select-picker';
import ImageViewer from '@/components/image-viewer';
import { Input } from '@nutui/nutui-react-taro';
import PropertyViewer from '@/components/property-viewer';
import { Space } from '@nutui/nutui-react-taro';
import TextViewer from '@/components/text-viewer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import './index.scss';
import {
  accountEditSelector,
  addAccountPicture,
  addAccountProperty,
  clearAccountEditState,
  fetchAccountInfo,
  removeAccountPicture,
  removeAccountProperty,
  saveAccountAsync,
  setAccountEditState,
  setAccountIcon,
  setAccountName,
  setAccountRemark,
  sortAccountPicture,
  sortAccountProperty,
  updateAccountProperty,
} from './reducer';

const classPrefix = 'lj-account-edit-page';

/**
 * 账号编辑
 */
const AccountEdit = () => {
  const dispatch = useAppDispatch();
  const { account } = useAppSelector(accountEditSelector);
  const router = useRouter();
  const id = Number(router.params.id);
  const categoryId = Number(router.params.categoryId);

  useMount(() => {
    if (id) {
      dispatch(fetchAccountInfo(id));
    } else if (categoryId) {
      const newAccount = {
        id: 0,
        categoryId,
        name: '新账号',
        icon: "",
        properties: [
          { name: '账号', value: 'abcd' },
          { name: '密码', value: '123456' },
        ],
        pictures: [],
        remark: '',
      };
      dispatch(setAccountEditState({ account: newAccount }));
    }
  });

  useUnmount(() => {
    dispatch(clearAccountEditState());
  });

  const onNameChange = useMemoizedFn((val: string) => dispatch(setAccountName(val)));
  const onIconChange = useMemoizedFn((val: string) => dispatch(setAccountIcon(val)));
  const onRemarkChange = useMemoizedFn((val: string) => dispatch(setAccountRemark(val)));
  const onAddProperty = useMemoizedFn(async (property: PropertyItem) => dispatch(addAccountProperty(property)));
  const onRemoveProperty = useMemoizedFn(async (index: number) => dispatch(removeAccountProperty(index)));
  const onUpdateProperty = useMemoizedFn(async (index: number, value: any) => dispatch(updateAccountProperty({ index, value })));
  const onSortProperty = useMemoizedFn(async (startIndex: number, toIndex: number) => dispatch(sortAccountProperty({ startIndex, toIndex })));
  const onAddPicture = useMemoizedFn(async (file: ImageItem) => dispatch(addAccountPicture(file)));
  const onRemovePicture = useMemoizedFn(async (index: number) => dispatch(removeAccountPicture(index)));
  const onSortPicture = useMemoizedFn(async (startIndex: number, toIndex: number) => dispatch(sortAccountPicture({ startIndex, toIndex })));

  const onSave = useMemoizedFn(async () => {
    if (!account) return;

    if (!account.name) {
      showToast('请输入名称');
      return;
    }

    if (account.properties.length === 0) {
      showToast('至少要添加一个属性');
      return;
    }

    await dispatch(saveAccountAsync({ ...account }));

    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk');
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      {account ? (
        <View className={`${classPrefix}--container`}>
          <View className="account-info">
            <View className="account-icon">
              <IconSelectPicker onChange={onIconChange}>
                <Avatar src={processImageUrl(account.icon)} />
              </IconSelectPicker>
            </View>
            <View className="account-title">
              <Input placeholder="请输入名称" value={account.name} onChange={onNameChange} />
            </View>
          </View>

          <AccountPanel title="属性">
            <PropertyViewer
              properties={account.properties} //
              editable
              onAdd={onAddProperty}
              onRemove={onRemoveProperty}
              onUpdate={onUpdateProperty}
              onSort={onSortProperty}
            />
          </AccountPanel>

          <AccountPanel title="图片">
            <ImageViewer images={account.pictures} editable onAdd={onAddPicture} onRemove={onRemovePicture} onSort={onSortPicture} />
          </AccountPanel>

          <AccountPanel title="备注">
            <TextViewer maxLength={1000} text={account.remark} editable onChange={onRemarkChange} />
          </AccountPanel>

          <View className={`${classPrefix}--footer`}>
            <Space justify="evenly">
              <Button type="primary" block size="large" style={{ width: '100px' }} onClick={onSave}>
                保存
              </Button>
            </Space>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default AccountEdit;
