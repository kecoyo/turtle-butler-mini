import schoolApi from '@/apis/schoolApi';
import { NativeProps, withNativeProps } from '@/common/native-props';
import { showToast } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import { BaseEventOrig, Checkbox, CheckboxGroup, Radio, RadioGroup, Text, View } from '@tarojs/components';
import { useMemoizedFn, useMount } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import { useState } from 'react';
import Avatar from '../avatar';
import ListView from '../list-view';
import Picker from '../picker';
import SearchInput from '../search-input';
import Space from '../space';
import './teacher-select-picker.scss';

interface TeacherSelectItem extends TeacherInfo {
  checked: boolean;
}

type TeacherSelectPickerProps = {
  visible: boolean;
  multiSelect?: boolean;
  onCancel?: () => void;
  onOk?: (value: TeacherInfo[]) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-teacher-select-picker`;

const TeacherSelectPicker: React.FC<TeacherSelectPickerProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [list, setList] = useState<TeacherSelectItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useMount(async () => {
    const teacherList = await schoolApi.getSchoolTeachers({
      pageIndex: 1,
      pageSize: 10,
    });
    setList(teacherList.map((t: any) => ({ id: t.userId, name: t.name, avatar: t.avatar })));
  });

  const onSelectChange = useMemoizedFn((e: BaseEventOrig<{ value: string }>) => {
    setSelected([Number(e.detail.value)]);
  });

  const onMultiSelectChange = useMemoizedFn((e: BaseEventOrig<{ value: string[] }>) => {
    setSelected(e.detail.value.map((val) => Number(val)));
  });

  const onOk = useMemoizedFn(() => {
    if (selected.length === 0) {
      showToast('至少要选择一个');
      return;
    }

    if (props.onOk) {
      let selectedList = _.filter(list, (t) => selected.includes(t.id));
      props.onOk(selectedList);
    }
  });

  const renderItem = useMemoizedFn((item: TeacherSelectItem) => {
    return (
      <View className="teacher-item">
        <Space justifyContent="space-between">
          <Avatar image={item.avatar} />
          <Space direction="column" alignItems="flex-start" size="small" flex>
            <Text className="item-name">{item.name}</Text>
            <Text className="item-phone">{item.phone}</Text>
          </Space>
          {props.multiSelect ? <Checkbox value={String(item.id)} checked={item.checked} /> : <Radio value={String(item.id)} checked={item.checked} />}
        </Space>
      </View>
    );
  });

  const renderFooter = useMemoizedFn(() => {
    return <View style={{ height: 1 }}></View>;
  });

  return withNativeProps(
    props,
    <Picker className={classNames(classPrefix)} visible={props.visible} onCancel={props.onCancel} onOk={onOk}>
      <Space className={`${classPrefix}--content`} direction="column">
        <SearchInput placeholder="搜索姓名\手机号" />
        {props.multiSelect ? (
          <CheckboxGroup onChange={onMultiSelectChange}>
            <ListView list={list} renderItem={renderItem} renderFooter={renderFooter} />
          </CheckboxGroup>
        ) : (
          <RadioGroup onChange={onSelectChange}>
            <ListView list={list} renderItem={renderItem} renderFooter={renderFooter} />
          </RadioGroup>
        )}
      </Space>
    </Picker>,
  );
};

export default TeacherSelectPicker;
