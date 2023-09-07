import { getOpenerEventChannel, showToast } from '@/common/utils';
import Button from '@/components/button';
import Input from '@/components/input';
import Space from '@/components/space';
import Textarea from '@/components/textarea';
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
      <Space className={`${classPrefix}--container`} direction="column">
        {type === 'textarea' ? ( //
          <Textarea placeholder="请输入" maxLength={maxLength} value={value || ''} onChange={onChange} />
        ) : (
          <Input placeholder="请输入" maxLength={maxLength} value={value || ''} onChange={onChange} />
        )}
        <Button type="primary" onClick={onOk}>
          确 定
        </Button>
      </Space>
    </View>
  );
};

export default TextEdit;
