import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, View } from '@tarojs/components';
import classNames from 'classnames';
import { AtProgress } from 'taro-ui';
import './progress.scss';

type ProgressProps = {
  label: string; // 标签名称
  total: number; // 总数
  finished: number; // 已完成数
  onClick?: CommonEventFunction; // 用户点击元素触发的事件
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-progress`;

const Progress: React.FC<ProgressProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const percent = Math.round((props.finished / props.total) * 100);

  return withNativeProps(
    props,
    <View className={classNames(classPrefix, {})} onClick={props.onClick}>
      <View className={`${classPrefix}--label`}>
        {props.label}：{props.finished}/{props.total}
      </View>
      <View className={`${classPrefix}--progress`}>
        <AtProgress percent={percent} />
      </View>
    </View>,
  );
};

export default Progress;
