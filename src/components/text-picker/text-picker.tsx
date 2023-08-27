import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { setTextEditState } from '@/pages/text-edit/reducer';
import { useAppDispatch } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import { ReactNode } from 'react';
import './text-picker.scss';

export type TextPickerProps = {
  type?: 'input' | 'textarea';
  title?: string;
  require?: boolean;
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
} & NativeProps;

const defaultProps = {
  type: 'input',
};

const classPrefix = 'lj-text-picker';

const TextPicker: React.FC<TextPickerProps> = (p) => {
  const dispatch = useAppDispatch();
  const props = mergeProps(defaultProps, p);

  const onClick = useMemoizedFn(() => {
    dispatch(
      setTextEditState({
        type: props.type,
        title: props.title,
        value: props.value,
        require: props.require,
        maxLength: props.maxLength,
      }),
    );
    Taro.navigateTo({
      url: '/pages/text-edit/index',
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

export default TextPicker;
