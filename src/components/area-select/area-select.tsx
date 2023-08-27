import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Picker } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import BaseSelect, { BaseSelectProps } from '../base-select';
import './area-select.scss';

export type AreaSelectProps = {
  value?: Area[];
  onChange?: (value: Area[]) => void;
} & Omit<BaseSelectProps, 'value' | 'onSelect'>;

const defaultProps = {};

const classPrefix = 'lj-area-select';

const AreaSelect: React.FC<AreaSelectProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const baseSelectProps = _.omit(props, ['value', 'onSelect']) as BaseSelectProps;

  const onChange = useMemoizedFn((e) => {
    const { code, value } = e.detail;
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
    <Picker className={classNames(`${classPrefix}--picker`, {})} mode="region" onChange={onChange}>
      <BaseSelect className={classPrefix} value={props.value ? props.value.map((a) => a.name).join(' / ') : ''} {...baseSelectProps} />
    </Picker>,
  );
};

export default AreaSelect;
