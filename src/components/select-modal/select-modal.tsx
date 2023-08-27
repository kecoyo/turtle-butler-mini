import { withNativeProps } from '@/common/native-props';
import { showToast } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import { BaseEventOrig, CheckboxGroup, Radio, RadioGroup } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import Modal, { ModalProps } from '../modal';
import Space from '../space';
import './select-modal.scss';

export interface SelectOption {
  value: number;
  label: string;
}

type SelectModalProps = {
  options?: SelectOption[];
  multiSelect?: boolean;
  value?: number[];
  onOk?: (value: number[]) => void;
} & Omit<ModalProps, 'onOk'>;

const defaultProps = {
  options: [],
};

const classPrefix = `lj-select-modal`;

const SelectModal: React.FC<SelectModalProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [selected, setSelected] = useState<number[]>([]);

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
      props.onOk(selected);
    }
  });

  return withNativeProps(
    props,
    <Modal className={classPrefix} {...props} onOk={onOk}>
      {props.multiSelect ? (
        <CheckboxGroup onChange={onMultiSelectChange}>
          <Space>
            {props.options.map((opt, i) => (
              <Radio key={i} value={String(opt.value)} checked={props.value?.includes(opt.value)}>
                {opt.label}
              </Radio>
            ))}
          </Space>
        </CheckboxGroup>
      ) : (
        <RadioGroup onChange={onSelectChange}>
          <Space>
            {props.options.map((opt, i) => (
              <Radio key={i} value={String(opt.value)} checked={props.value?.includes(opt.value)}>
                {opt.label}
              </Radio>
            ))}
          </Space>
        </RadioGroup>
      )}
    </Modal>,
  );
};

export default SelectModal;
