import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Picker } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { ReactNode } from 'react';
import './date-picker.scss';

export type DatePickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-date-picker';

const DatePicker: React.FC<DatePickerProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onChange = useMemoizedFn((e) => {
    if (props.onChange) {
      props.onChange(e.detail.value);
    }
  });

  return withNativeProps(
    props,
    <Picker className={classPrefix} mode="date" value={props.value || ''} onChange={onChange}>
      {props.children}
    </Picker>,
  );
};

export default DatePicker;
