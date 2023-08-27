import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import { ReactNode } from 'react';
import { AtDrawer } from 'taro-ui';
import Button from '../button';
import Footer from '../footer';
import Space from '../space';
import './picker.scss';

export type PickerProps = {
  visible: boolean;
  children?: ReactNode;
  onCancel?: () => void;
  onOk?: () => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-picker`;

const Picker: React.FC<PickerProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <AtDrawer className={classPrefix} show={props.visible} mask onClose={props.onCancel}>
      <View className={`${classPrefix}--content`}>{props.children}</View>
      <Footer>
        <Space justifyContent="space-around">
          <Button circle onClick={props.onCancel}>
            取消
          </Button>
          <Button type="primary" circle onClick={props.onOk}>
            确定
          </Button>
        </Space>
      </Footer>
    </AtDrawer>,
  );
};

export default Picker;
