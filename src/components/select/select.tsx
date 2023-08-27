import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Picker } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import BaseSelect, { BaseSelectProps } from '../base-select';
import './select.scss';

export interface SelectOption {
  value: number;
  label: string;
}

export type SelectProps = {
  options?: SelectOption[];
  value?: number;
  onChange?: (value: number, label: string) => void;
} & Omit<BaseSelectProps, 'value' | 'onSelect'>;

const defaultProps = {
  options: [],
};

const classPrefix = 'lj-select';

const Select: React.FC<SelectProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const range = props.options.map((opt) => opt.label);
  const selected = props.options.find((opt) => opt.value === props.value);
  const baseSelectProps = _.omit(props, ['value', 'onSelect']) as BaseSelectProps;

  const onChange = useMemoizedFn((e) => {
    let index = e.detail.value;
    let opt: SelectOption = props.options[index];
    if (props.onChange && opt) {
      props.onChange(opt.value, opt.label);
    }
  });

  return withNativeProps(
    props,
    <Picker
      className={classNames(`${classPrefix}--picker`, {
        [`${classPrefix}--picker-full`]: props.full,
      })}
      mode="selector"
      range={range}
      onChange={onChange}
    >
      <BaseSelect className={classPrefix} value={selected?.label} {...baseSelectProps} />
    </Picker>,
  );
};

export default Select;
