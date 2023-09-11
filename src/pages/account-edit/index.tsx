import { getOpenerEventChannel, showToast } from '@/common/utils';
import AccountPanel from '@/components/account-panel';
import Avatar from '@/components/avatar';
import Button from '@/components/button';
import IconSelectPicker from '@/components/icon-select-picker';
import { File } from '@/components/image-picker';
import ImageViewer from '@/components/image-viewer';
import Input from '@/components/input';
import PropertyViewer from '@/components/property-viewer';
import Space from '@/components/space';
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
  changeAccountProperty,
  clearAccountEditState,
  fetchAccountInfo,
  removeAccountPicture,
  removeAccountProperty,
  saveAccountAsync,
  setAccountEditState,
  setAccountIcon,
  setAccountName,
  setAccountRemark,
} from './reducer';

const classPrefix = 'lj-account-edit-page';

/**
 * 账号编辑
 */
const AccountEdit = () => {
  const dispatch = useAppDispatch();
  const { account } = useAppSelector(accountEditSelector);
  const config = useAppSelector(configSelector);
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
        icon: config.account.default_icon,
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
  const onChangeProperty = useMemoizedFn(async (index: number, value: any) => dispatch(changeAccountProperty({ index, value })));
  const onAddPicture = useMemoizedFn(async (file: File) => dispatch(addAccountPicture(file)));
  const onRemovePicture = useMemoizedFn(async (index: number) => dispatch(removeAccountPicture(index)));

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
                <Avatar image={account.icon} circle />
              </IconSelectPicker>
            </View>
            <View className="account-title">
              <Input placeholder="请输入名称" value={account.name} onChange={onNameChange} />
            </View>
          </View>

          <AccountPanel title="属性">
            <PropertyViewer properties={account.properties} editable onAdd={onAddProperty} onRemove={onRemoveProperty} onChange={onChangeProperty} />
          </AccountPanel>

          <AccountPanel title="图片">
            <ImageViewer length={5} images={account.pictures} editable onAdd={onAddPicture} onRemove={onRemovePicture} />
          </AccountPanel>

          <AccountPanel title="备注">
            <TextViewer maxLength={1000} text={account.remark} editable onChange={onRemarkChange} />
          </AccountPanel>

          <View className={`${classPrefix}--footer`}>
            <Space justifyContent="space-evenly">
              <Button type="primary" full onClick={onSave}>
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
