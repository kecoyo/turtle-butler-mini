import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Picker } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import BaseSelect, { BaseSelectProps } from '../base-select';
import './date-select.scss';

export type DateSelectProps = {
  placeholder?: string;
  full?: boolean;
  value?: string;
  onChange?: (value: string) => void;
} & Omit<BaseSelectProps, 'value' | 'onSelect'>;

const defaultProps = {
  value: '',
};

const classPrefix = 'lj-date-select';

const DateSelect: React.FC<DateSelectProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const baseSelectProps = _.omit(props, ['value', 'onSelect']) as BaseSelectProps;

  const onChange = useMemoizedFn((e) => {
    if (props.onChange) {
      props.onChange(e.detail.value);
    }
  });

  return withNativeProps(
    props,
    <Picker
      className={classNames(`${classPrefix}--picker`, {
        [`${classPrefix}--picker-full`]: props.full,
      })}
      mode="date"
      value={props.value}
      onChange={onChange}
    >
      <BaseSelect className={classPrefix} value={props.value} {...baseSelectProps} />
    </Picker>,
  );
};

export default DateSelect;
