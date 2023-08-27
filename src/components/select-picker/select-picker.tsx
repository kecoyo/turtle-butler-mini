import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Picker } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './select-picker.scss';

export interface SelectPickerOption {
  value: number;
  label: string;
}

export type SelectPickerProps = {
  options?: SelectPickerOption[];
  value?: number;
  onChange?: (value: number, label: string) => void;
  children: ReactNode;
} & NativeProps;

const defaultProps = {
  options: [],
};

const classPrefix = 'lj-select-picker';

const SelectPicker: React.FC<SelectPickerProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const range = props.options.map((opt) => opt.label);
  const selectedIndex = props.options.findIndex((opt) => opt.value === props.value);
  console.log('🚀 ~ file: select-picker.tsx:31 ~ selectedIndex:', selectedIndex);

  const onChange = useMemoizedFn((e) => {
    let index = e.detail.value;
    let opt: SelectPickerOption = props.options[index];
    if (props.onChange && opt) {
      props.onChange(opt.value, opt.label);
    }
  });

  return withNativeProps(
    props,
    <Picker className={classNames(classPrefix, {})} mode="selector" range={range} value={selectedIndex} onChange={onChange}>
      {props.children}
    </Picker>,
  );
};

export default SelectPicker;
