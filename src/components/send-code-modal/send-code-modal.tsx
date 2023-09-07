import { withNativeProps } from '@/common/native-props';
import { showToast } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import Button from '@/components/button';
import Input from '@/components/input';
import Modal, { ModalProps } from '@/components/modal';
import Space from '@/components/space';
import { View } from '@tarojs/components';
import { useInterval, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useState } from 'react';
import './send-code-modal.scss';

export type SendCodeModalProps = {
  phone?: string;
  type?: number;
  onOk?: (value: string) => void;
} & Omit<ModalProps, 'onOk'>;

const defaultProps = {
  phone: '',
  type: 1, // 1:退出学校
};

const classPrefix = `lj-send-code-modal`;

/**
 * 发送验证码弹框
 * @param p
 * @returns
 */
const SendCodeModal: React.FC<SendCodeModalProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const phoneNum = props.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  const [code, setCode] = useState<string>('');
  const [count, setCount] = useState(0); // 倒计时
  const [interval, setInterval] = useState<number | undefined>(); // 计时间隔

  useUpdateEffect(() => {
    setCode('');
  }, [props.visible]);

  // 发送验证码
  const onSendSmsCode = useMemoizedFn(async () => {
    setCount(60);
    setInterval(1000);

    if (props.type === 1) {
      await schoolApi.sendQuitCode({
        phoneNumber: props.phone,
      });
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

  const onOk = useMemoizedFn(() => {
    if (!code) {
      showToast('请输入验证码');
      return;
    }
    if (props.onOk) {
      props.onOk(code);
    }
  });

  return withNativeProps(
    props,
    <Modal className={classPrefix} title="请选择要转移的班级" visible={props.visible} onCancel={props.onCancel} onOk={onOk}>
      <Space direction="column" alignItems="center">
        <View className="phone-number">{phoneNum}</View>
        <Space justifyContent="space-between">
          <Input className="input-number" placeholder="验证码" full circle value={code} onChange={(val) => setCode(val)} />
          {count > 0 ? (
            <Button className="send-button" type="primary" circle disabled>
              {count}s
            </Button>
          ) : (
            <Button className="send-button" type="primary" circle onClick={onSendSmsCode}>
              发送验证码
            </Button>
          )}
        </Space>
      </Space>
    </Modal>,
  );
};

export default SendCodeModal;
