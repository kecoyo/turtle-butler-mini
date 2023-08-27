import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Picker } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { ReactNode } from 'react';
import './area-picker.scss';

export type AreaPickerProps = {
  value?: Area[];
  onChange?: (value: Area[]) => void;
  children: ReactNode;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-area-picker';

const AreaPicker: React.FC<AreaPickerProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onChange = useMemoizedFn((e) => {
    console.log('🚀 ~ file: area-picker.tsx:33 ~ onChange ~ e:', e);
    const { code, value, postcode } = e.detail;
    let areas = [];
    for (let i = 0; i < value.length; i++) {
      const id = code[i];
      const name = value[i];
      areas.push({ id: Number(id), name });
    }
    if (props.onChange) {
      props.onChange(areas);
    }
  });

  return withNativeProps(
    props,
    <Picker className={classPrefix} mode="region" onChange={onChange}>
      {props.children}
    </Picker>,
  );
};

export default AreaPicker;
