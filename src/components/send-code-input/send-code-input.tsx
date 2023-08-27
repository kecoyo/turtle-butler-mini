import schoolApi from '@/apis/schoolApi';
import userApi from '@/apis/userApi';
import { SendCodeType } from '@/common/enums';
import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import Button from '@/components/button';
import Input from '@/components/input';
import { ModalProps } from '@/components/modal';
import Space from '@/components/space';
import { useInterval, useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { useState } from 'react';
import './send-code-input.scss';

export type SendCodeInputProps = {
  phone: string; // 传入要发送验证码的手机号
  type: SendCodeType; // 发送验证码类型
  circle?: boolean;
  placeholder?: string; // input placeholder
  value?: string;
  onChange?: (value: string) => void;
} & Omit<ModalProps, 'onOk'>;

const defaultProps = {
  placeholder: '验证码',
};

const classPrefix = `lj-send-code-input`;

/**
 * 发送验证码输入框
 * @param p
 * @returns
 */
const SendCodeInput: React.FC<SendCodeInputProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [count, setCount] = useState(0); // 倒计时
  const [interval, setInterval] = useState<number | undefined>(); // 计时间隔

  // 发送验证码
  const onSendCode = useMemoizedFn(async () => {
    setCount(60);
    setInterval(1000);

    if (props.type === SendCodeType.SendQuitCode) {
      await schoolApi.sendQuitCode({
        phoneNumber: props.phone,
      });
    } else if (props.type === SendCodeType.SendUpdateCode) {
      await userApi.sendUpdateCode({
        phoneNumber: props.phone,
      });
    } else {
    }
  });

  // 开始倒计时
  const clearTimer = useInterval(() => {
    if (count === 0) {
      clearTimer();
      setInterval(undefined);
      return;
    }
    setCount(count - 1);
  }, interval);

  // 停止倒计时
  const stopTimer = useMemoizedFn(() => {
    clearTimer();
    setInterval(undefined);
    setCount(0);
  });

  const onChange = useMemoizedFn((val) => {
    if (props.onChange && val !== props.value) {
      props.onChange(val);
    }
  });

  return withNativeProps(
    props,
    <Space className={classNames(classPrefix, {})}>
      <Input
        className={`${classPrefix}--code-input`}
        type="number"
        placeholder={props.placeholder}
        full
        circle={props.circle}
        maxLength={6}
        value={props.value}
        onChange={onChange}
      />
      {count > 0 ? (
        <Button className={`${classPrefix}--send-button`} type="primary" circle={props.circle} disabled>
          {count}s
        </Button>
      ) : (
        <Button className={`${classPrefix}--send-button`}circle={props.circle} onClick={onSendCode}>
          发送验证码
        </Button>
      )}
    </Space>,
  );
};

export default SendCodeInput;
