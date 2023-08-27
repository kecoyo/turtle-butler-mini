import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import classNames from 'classnames';
import _ from 'lodash';
import Image, { ImageProps } from '../image';
import './image-icon.scss';

type Props = {
  size?: 'large' | 'normal' | 'small';
} & ImageProps &
  NativeProps;

const defaultProps = {
  size: 'normal',
  mode: 'scaleToFill',
};

const classPrefix = `lj-image-icon`;

const ImageIcon: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);
  const imageProps = _.omit(props, ['className', 'style']);

  return withNativeProps(
    props,
    <Image
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.size}`]: props.size,
      })}
      {...imageProps}
    />,
  );
};

export default ImageIcon;
