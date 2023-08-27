import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { ReactNode } from 'react';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import Button from '../button';
import Space from '../space';
import './modal.scss';

export type ModalProps = {
  visible?: boolean;
  title?: string;
  content?: string;
  children?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  closeOnClickOverlay?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
} & NativeProps;

const defaultProps = {
  visible: false,
  cancelText: '取消',
  confirmText: '确定',
};

const classPrefix = 'lj-modal';

const Modal: React.FC<ModalProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <AtModal className={classPrefix} isOpened={props.visible} closeOnClickOverlay={props.closeOnClickOverlay} onClose={props.onCancel}>
      {props.title && <AtModalHeader>{props.title}</AtModalHeader>}
      <AtModalContent>{props.content || props.children}</AtModalContent>
      <AtModalAction>
        <Space className={`${classPrefix}--footer`} justifyContent="space-around" flex>
          {props.onCancel && (
            <Button circle onClick={props.onCancel}>
              {props.cancelText}
            </Button>
          )}
          {props.onOk && (
            <Button type="primary" circle onClick={props.onOk}>
              {props.confirmText}
            </Button>
          )}
        </Space>
      </AtModalAction>
    </AtModal>,
  );
};

export default Modal;
