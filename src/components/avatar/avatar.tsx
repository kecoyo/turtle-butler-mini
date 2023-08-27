import { DEFAULT_AVATAR_URL, UPLOAD_URL } from '@/common/constants';
import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, Image, View } from '@tarojs/components';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { useState } from 'react';
import './avatar.scss';

export type AvatarProps = {
  image?: string; // 头像图片地址
  size?: 'large' | 'normal' | 'small'; // 头像大小
  circle?: boolean; // 头像是否圆形
  onClick?: CommonEventFunction;
} & NativeProps;

export const defaultProps: AvatarProps = {
  size: 'normal',
};

const classPrefix = `lj-avatar`;

const Avatar: React.FC<AvatarProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [src, setSrc] = useState('');

  useMount(() => {
    updateImage(props.image);
  });

  useUpdateEffect(() => {
    updateImage(props.image);
  }, [props.image]);

  const updateImage = (image: string | undefined) => {
    if (image) {
      if (image.startsWith('upload/')) {
        setSrc(UPLOAD_URL + image);
      } else {
        setSrc(image);
      }
    } else {
      setSrc(DEFAULT_AVATAR_URL);
    }
  };

  const onError = useMemoizedFn(() => {
    setSrc(DEFAULT_AVATAR_URL);
  });

  return withNativeProps(
    props,
    <View
      className={classNames(classPrefix, {
        [`${classPrefix}--circle`]: props.circle,
        [`${classPrefix}--${props.size}`]: props.size,
      })}
      onClick={props.onClick}
    >
      <Image className={`${classPrefix}--img`} src={src} onError={onError} mode="aspectFill" />
    </View>,
  );
};

export default Avatar;
