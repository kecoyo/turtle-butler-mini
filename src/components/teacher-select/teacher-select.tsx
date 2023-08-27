import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import _ from 'lodash';
import { useState } from 'react';
import BaseSelect, { BaseSelectProps } from '../base-select';
import TeacherSelectPicker from '../teacher-select-picker';
import './teacher-select.scss';

export type TeacherSelectProps = {
  value?: TeacherInfo;
  onChange?: (value: TeacherInfo) => void;
} & Omit<BaseSelectProps, 'value' | 'onSelect'>;

const defaultProps = {};

const classPrefix = 'lj-teacher-select';

const TeacherSelect: React.FC<TeacherSelectProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [visible, setVisible] = useState(false);
  const baseSelectProps = _.omit(props, ['value', 'onSelect']) as BaseSelectProps;

  const onTeacherSelectOk = useMemoizedFn((values: TeacherInfo[]) => {
    setVisible(false);
    let teacherInfo = values[0];
    if (props.onChange && teacherInfo) {
      props.onChange(teacherInfo);
    }
  });

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <BaseSelect value={props.value?.name} onSelect={() => setVisible(true)} {...baseSelectProps} />
      <TeacherSelectPicker visible={visible} onCancel={() => setVisible(false)} onOk={onTeacherSelectOk} />
    </View>,
  );
};

export default TeacherSelect;
