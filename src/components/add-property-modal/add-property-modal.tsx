import { withNativeProps } from '@/common/native-props';
import { showToast } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import Modal, { ModalProps } from '@/components/modal';
import Space from '@/components/space';
import { View } from '@tarojs/components';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import Input from '../input';
import './add-property-modal.scss';

export type AddPropertyModalProps = {
  value?: AccountProperty;
  onOk: (value: AccountProperty) => any;
} & Omit<ModalProps, 'onOk'>;

const defaultProps = {};

const classPrefix = `lj-add-property-modal`;

const AddPropertyModal: React.FC<AddPropertyModalProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [name, setName] = useState<string>('');
  const [value, setValue] = useState<string>('');

  useAsyncEffect(async () => {
    if (!props.visible) {
      setName('');
      setValue('');
    }
  }, [props.visible]);

  const onOk = useMemoizedFn(() => {
    if (!name) {
      showToast('请输入名称');
      return;
    }

    if (!value) {
      showToast('请输入值');
      return;
    }

    if (props.onOk) {
      props.onOk({ name, value });
    }
  });

  return withNativeProps(
    props,
    <Modal className={classPrefix} title="添加属性" visible={props.visible} onCancel={props.onCancel} onOk={onOk}>
      <Space className={`${classPrefix}--content`} direction="column">
        <Space justifyContent="space-between">
          <View className="item-name">名称：</View>
          <View className="item-value">
            <Input placeholder="请输入" border circle value={name} onChange={setName} />
          </View>
        </Space>
        <Space justifyContent="space-between">
          <View className="item-name">值：</View>
          <View className="item-value">
            <Input placeholder="请输入" border circle value={value} onChange={setValue} />
          </View>
        </Space>
      </Space>
    </Modal>,
  );
};

export default AddPropertyModal;
