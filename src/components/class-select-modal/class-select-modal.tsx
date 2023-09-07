import { ClassType } from '@/common/enums';
import { withNativeProps } from '@/common/native-props';
import { getSelectOptions, showToast } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import Modal, { ModalProps } from '@/components/modal';
import Select from '@/components/select';
import Space from '@/components/space';
import { useAppSelector } from '@/redux/hooks';
import { globalSelector } from '@/redux/reducers/global';
import { useAsyncEffect, useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import './class-select-modal.scss';

export interface ClassSelectValue {
  gradeId: number;
  classId: number;
}

export type ClassSelectModalProps = {
  value?: ClassSelectValue;
  onOk: (value: ClassSelectValue) => any;
} & Omit<ModalProps, 'onOk'>;

const defaultProps = {};

const classPrefix = `lj-class-select-modal`;

const ClassSelectModal: React.FC<ClassSelectModalProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const { allGrades } = useAppSelector(globalSelector);
  const [gradeId, setGradeId] = useState<number>(0);
  const [classId, setClassId] = useState<number>(0);
  const [classList, setClassList] = useState([]);

  useAsyncEffect(async () => {
    if (props.value && props.value.gradeId) {
      await onGradeChange(props.value.gradeId);
      onClassChange(props.value.classId);
    }
  }, [props.value]);

  useAsyncEffect(async () => {
    if (!props.visible) {
      setGradeId(0);
      setClassId(0);
      setClassList([]);
    }
  }, [props.visible]);

  const onGradeChange = useMemoizedFn(async (val) => {
    setGradeId(val);
    // 加载年级下的班级列表
    const list = await classApi.getGradeClass({
      gradeId: val,
      mode: ClassType.行政班,
      pageIndex: 1,
      pageSize: 100,
    });
    setClassList(list);
  });

  const onClassChange = useMemoizedFn((val) => {
    setClassId(val);
  });

  const onOk = useMemoizedFn(() => {
    if (!classId) {
      showToast('请选择一个班级');
      return;
    }

    if (props.onOk) {
      props.onOk({ gradeId, classId });
    }
  });

  return withNativeProps(
    props,
    <Modal className={classPrefix} title="请选择班级" visible={props.visible} onCancel={props.onCancel} onOk={onOk}>
      <Space className={`${classPrefix}--content`} justifyContent="space-between">
        <Select placeholder="请选择" options={getSelectOptions(allGrades)} full value={gradeId} onChange={onGradeChange} />
        <Select placeholder="请选择" options={getSelectOptions(classList)} full value={classId} onChange={onClassChange} />
      </Space>
    </Modal>,
  );
};

export default ClassSelectModal;
