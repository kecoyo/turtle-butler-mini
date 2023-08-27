import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import classNames from 'classnames';
import _ from 'lodash';
import { AtDivider } from 'taro-ui';
import './divider.scss';

type DividerProps = {
  content?: string; // 分隔符文字
  height?: number | string; // 分隔符高度，会自动转 rem,rpx
  fontColor?: string; // 文字颜色
  fontSize?: number | string; // 文字大小，会自动转 rem,rpx
  lineColor?: string; // 分割线颜色

  size?: 'larger' | 'large' | 'normal' | 'small' | 'smaller'; // 控制高度和字体大小
  hideLine?: boolean; // 隐藏线条
  lineSizeFull?: boolean; // 线条高度填充
} & NativeProps;

const defaultProps = {
  size: 'normal',
};

const classPrefix = `lj-divider`;

const Divider: React.FC<DividerProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const baseProps = _.pick(props, ['content', 'height', 'fontColor', 'fontSize', 'lineColor']);

  return withNativeProps(
    props,
    <AtDivider
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.size}`]: props.size,
        [`${classPrefix}--hide-line`]: props.hideLine,
        [`${classPrefix}--line-size-full`]: props.lineSizeFull,
      })}
      {...baseProps}
    />,
  );
};

export default Divider;
