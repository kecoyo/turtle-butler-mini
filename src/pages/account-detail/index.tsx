import { getOpenerEventChannel, showToast } from '@/common/utils';
import Avatar from '@/components/avatar';
import IconSelectPicker from '@/components/icon-select-picker';
import { File } from '@/components/image-picker';
import ImageViewer from '@/components/image-viewer';
import Input from '@/components/input';
import PropertyViewer from '@/components/property-viewer';
import Textarea from '@/components/textarea';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import './index.scss';
import {
  accountDetailSelector,
  addAccountPicture,
  addAccountProperty,
  changeAccountProperty,
  clearAccountDetailState,
  fetchAccountInfo,
  removeAccountPicture,
  removeAccountProperty,
  saveAccountAsync,
  setAccountIcon,
  setAccountName,
  setAccountRemark,
} from './reducer';

const classPrefix = 'lj-account-detail-page';

/**
 * 账号编辑
 */
const AccountDetail = () => {
  const dispatch = useAppDispatch();
  const { account, isEditing } = useAppSelector(accountDetailSelector);
  const router = useRouter();
  const id = Number(router.params.id || 3749);
  const categoryId = Number(router.params.categoryId || 3749);

  useMount(() => {
    if (id) {
      dispatch(fetchAccountInfo(id));
    }
  });

  useUnmount(() => {
    dispatch(clearAccountDetailState());
  });

  const onNameChange = useMemoizedFn((val: string) => dispatch(setAccountName(val)));
  const onIconChange = useMemoizedFn((val: string) => dispatch(setAccountIcon(val)));
  const onRemarkChange = useMemoizedFn((val: string) => dispatch(setAccountRemark(val)));
  const onAddProperty = useMemoizedFn(async (property: AccountProperty) => dispatch(addAccountProperty(property)));
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
      <View className={`${classPrefix}--container`}>
        {account ? (
          <View>
            <View className="account-info">
              <View className="account-icon">
                <IconSelectPicker onChange={onIconChange}>
                  <Avatar image={account.icon} />
                </IconSelectPicker>
              </View>
              <View className="account-title">
                <Input placeholder="请输入名称" value={account.name} onChange={onNameChange} />
                {/* <Text>{account.name}</Text> */}
              </View>
            </View>

            <View className="panel">
              <View className="panel-title">属性</View>
              <View className="panel-content">
                <PropertyViewer properties={account.properties} onAdd={onAddProperty} onRemove={onRemoveProperty} onChange={onChangeProperty} />
              </View>
            </View>

            {/* <View wx:if="{isEditing}">
                <View className="space"></View>
                <View className="weui-cells weui-cells_after-title">
                  <View className="weui-cell weui-cell_link" bindtap="bindAddProperty">
                    <View className="weui-cell__bd">添加属性</View>
                  </View>
                </View>
              </View> */}

            {/* <View wx:if="{isEditing && !hasPicture}">
                <View className="space"></View>
                <View className="weui-cells weui-cells_after-title">
                  <View className="weui-cell weui-cell_link" bindtap="bindAddPicture">
                    <View className="weui-cell__bd">添加图片</View>
                  </View>
                </View>
              </View> */}

            <View className="panel">
              <View className="panel-title">图片</View>
              <View className="panel-content">
                <ImageViewer length={5} files={account.pictures as File[]} onAdd={onAddPicture} onRemove={onRemovePicture} />
              </View>
            </View>

            <View className="panel">
              <View className="panel-title">备注</View>
              <View className="panel-content">
                <Textarea placeholder="请输入备注" height={200} maxLength={1000} value={account.remark} onChange={onRemarkChange} />
              </View>
            </View>

            {/* <View wx:if="{isEditing && !hasRemark}">
                <View className="space"></View>
                <View className="weui-cells weui-cells_after-title">
                  <View className="weui-cell weui-cell_link" bindtap="bindAddRemark">
                    <View className="weui-cell__bd">添加备注</View>
                  </View>
                </View>
              </View> */}

            {/* <View wx:if="{hasRemark}">
                <View className="weui-cells__title">备注</View>
                <View className="weui-cells weui-cells_after-title">
                  <View className="weui-cell">
                    <View className="weui-cell__bd">
                      <textarea wx:if="{isEditing}" className="weui-textarea" placeholder="请输入文本" value="{account.remark}" bindinput="bindRemarkInput" />
                      <text wx:else className="weui-textarea">
                        {account.remark || ''}
                      </text>
                    </View>
                  </View>
                </View>
              </View> */}
          </View>
        ) : null}
      </View>

      <View className={`${classPrefix}--footer`}>
        <View className="footer-left">
          {isEditing ? (
            <View className="button" bindtap="bindEditCancel()">
              取消
            </View>
          ) : null}
        </View>
        <View className="footer-right">
          {isEditing ? (
            <View className="button" bindtap="bindEditDone()">
              完成
            </View>
          ) : (
            <View className="button" bindtap="bindEditStart()">
              编辑
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default AccountDetail;
