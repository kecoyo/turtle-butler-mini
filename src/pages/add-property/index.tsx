import { getOpenerEventChannel, showToast } from '@/common/utils';
import { Button } from '@nutui/nutui-react-taro';
import FormItem from '@/components/form-item';
import { Input } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import './index.scss';

const classPrefix = 'lj-add-property-page';

const AddProperty = () => {
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const onOk = useMemoizedFn(() => {
    if (!name) {
      showToast('请输入名称');
      return;
    }

    if (!value) {
      showToast('请输入值');
      return;
    }

    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk', { name, value });
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      <View className={`${classPrefix}--content`}>
        <FormItem title="名称">
          <Input placeholder="请输入" value={name} onChange={setName} />
        </FormItem>
        <FormItem title="值">
          <Input placeholder="请输入" value={value} onChange={setValue} />
        </FormItem>
      </View>
      <View className={`${classPrefix}--footer`}>
        <Button type="primary" block size="large" onClick={onOk}>
          确 定
        </Button>
      </View>
    </View>
  );
};

export default AddProperty;
