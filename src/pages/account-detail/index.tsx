import { processImageUrl } from '@/common/utils';
import AccountPanel from '@/components/account-panel';
import { Avatar } from '@nutui/nutui-react-taro';
import { Button } from '@nutui/nutui-react-taro';
import ImageViewer from '@/components/image-viewer';
import PropertyViewer from '@/components/property-viewer';
import { Space } from '@nutui/nutui-react-taro';
import TextViewer from '@/components/text-viewer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { deleteAccountAsync, setAccountListDataChanged } from '../account-list/reducer';
import './index.scss';
import { accountDetailSelector, clearAccountDetailState, fetchAccountInfo } from './reducer';

const classPrefix = 'lj-account-detail-page';

/**
 * 账号详情
 */
const AccountDetail = () => {
  const dispatch = useAppDispatch();
  const { account } = useAppSelector(accountDetailSelector);
  const router = useRouter();
  const id = Number(router.params.id || 3749);

  useMount(() => {
    if (id) {
      dispatch(fetchAccountInfo(id));
    }
  });

  useUnmount(() => {
    dispatch(clearAccountDetailState());
  });

  const onEdit = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/account-edit/index?id=' + id,
      events: {
        onOk: () => {
          dispatch(clearAccountDetailState());
          dispatch(fetchAccountInfo(id));
          // 修改账号了，需要刷新账号列表
          dispatch(setAccountListDataChanged());
        },
      },
    });
  });

  const onDelete = useMemoizedFn(async () => {
    await dispatch(deleteAccountAsync(id));

    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      {account ? (
        <View className={`${classPrefix}--container`}>
          <View className="account-info">
            <View className="account-icon">
              <Avatar src={processImageUrl(account.icon)} />
            </View>
            <View className="account-title">
              <Text>{account.name}</Text>
            </View>
          </View>

          <AccountPanel title="属性">
            <PropertyViewer properties={account.properties} />
          </AccountPanel>

          {account.pictures.length > 0 && (
            <AccountPanel title="图片">
              <ImageViewer length={5} images={account.pictures} />
            </AccountPanel>
          )}

          {account.remark && (
            <AccountPanel title="备注">
              <TextViewer text={account.remark} />
            </AccountPanel>
          )}

          <View className={`${classPrefix}--footer`}>
            <Space justify="evenly">
              <Button type="info" style={{ width: '100px' }} onClick={onEdit}>
                编辑
              </Button>
              <Button type="danger" style={{ width: '100px' }} onClick={onDelete}>
                删除
              </Button>
            </Space>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default AccountDetail;
