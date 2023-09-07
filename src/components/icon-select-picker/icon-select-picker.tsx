import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { ReactNode } from 'react';
import './icon-select-picker.scss';

export type IconSelectPickerProps = {
  onChange?: (value: string) => void;
  children: ReactNode;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-icon-select-picker';

const IconSelectPicker: React.FC<IconSelectPickerProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onClick = useMemoizedFn(() => {
    Taro.navigateTo({
      url: '/pages/icon-select/index',
      events: {
        onOk: onChange,
      },
    });
  });

  const onChange = useMemoizedFn((val) => {
    if (props.onChange) {
      props.onChange(val);
    }
  });

  return withNativeProps(
    props,
    <View className={classPrefix} onClick={onClick}>
      {props.children}
    </View>,
  );
};

export default IconSelectPicker;
