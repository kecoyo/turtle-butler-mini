import { getOpenerEventChannel, showToast } from '@/common/utils';
import { Button } from '@nutui/nutui-react-taro';
import { Input } from '@nutui/nutui-react-taro';
import { Space, TextArea } from '@nutui/nutui-react-taro';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import './index.scss';
import { clearTextEditState, setTextEditState, textEditSelector } from './reducer';

const classPrefix = 'lj-input-edit-page';

const TextEdit = () => {
  const dispatch = useAppDispatch();
  const { type, value, title: title, require, maxLength } = useAppSelector(textEditSelector);

  useMount(() => {
    Taro.setNavigationBarTitle({
      title: title,
    });
  });

  useUnmount(() => {
    dispatch(clearTextEditState());
  });

  const onChange = useMemoizedFn((val) => dispatch(setTextEditState({ value: val })));

  const onOk = useMemoizedFn(() => {
    if (require && !value) {
      showToast(`请输入${title}`);
      return;
    }

    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk', value);
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      <Space className={`${classPrefix}--container`} direction="vertical">
        {type === 'textarea' ? ( //
          <TextArea placeholder="请输入" maxLength={maxLength} value={value || ''} onChange={onChange} />
        ) : (
          <Input placeholder="请输入" maxLength={maxLength} value={value || ''} onChange={onChange} />
        )}
        <Button type="primary" block size="large" onClick={onOk}>
          确 定
        </Button>
      </Space>
    </View>
  );
};

export default TextEdit;
