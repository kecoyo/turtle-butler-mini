import { NativeProps, withNativeProps } from '@/common/native-props';
import { getConfigUrl } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import { useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { Image as TaroImage, ImageProps as TaroImageProps } from '@tarojs/components';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import { useState } from 'react';
import { RES_URL } from '../../common/constants';
import './image.scss';

export type ImageProps = {} & TaroImageProps & NativeProps;

const defaultProps = {};

const classPrefix = `lj-image`;

const Image: React.FC<ImageProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const config = useAppSelector(configSelector);
  const [src, setSrc] = useState('');
  const taroImageProps = _.omit(props, ['className', 'style', 'src', 'onError']);

  useMount(() => {
    updateImage(props.src);
  });

  useUpdateEffect(() => {
    updateImage(props.src);
  }, [props.src]);

  const updateImage = (imageSrc: string | undefined) => {
    if (imageSrc) {
      if (imageSrc.startsWith('upload/')) {
        setSrc(RES_URL + imageSrc);
      } else {
        setSrc(imageSrc);
      }
    } else {
      setSrc(getConfigUrl(config.others.avatar_png));
    }
  };

  const onError = useMemoizedFn(() => {
    setSrc(config.others.avatar_png);
  });

  return withNativeProps(props, <TaroImage className={classNames(classPrefix, {})} {...taroImageProps} src={src} onError={onError} />);
};

export default Image;
