import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Switch as TaroSwitch } from '@tarojs/components';
import { AtSwitch } from 'taro-ui';
import './switch.scss';

type Props = {
  title?: string; // 标签名
  checked?: boolean; // 是否显示开启
  onChange?: (value: boolean) => void; // 输入框值改变时触发的事件
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-switch';

const Switch: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <>
      <TaroSwitch style={{ display: 'none' }} />
      <AtSwitch
        className={classPrefix} //
        border={false}
        title={props.title}
        checked={props.checked}
        onChange={props.onChange}
      />
    </>,
  );
};

export default Switch;
