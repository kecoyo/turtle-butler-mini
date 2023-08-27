import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import Icon from '../icon';
import Image from '../image';
import Upload from '../upload';
import './picture-upload.scss';

type PictureUploadProps = {
  icon?: string | ReactNode; // 元素的Icon
  title: string; // 元素的标题
  value?: string; // 值
  onChange?: (value: string) => void; // 值发生变化
} & NativeProps;

const defaultProps = {
  icon: 'camera',
  title: '上传图片',
};

const classPrefix = `lj-picture-upload`;

const PictureUpload: React.FC<PictureUploadProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <Upload className={classNames(classPrefix, {})} onChange={props.onChange}>
      {props.value ? (
        <View className={`${classPrefix}--container`}>
          <Image src={props.value} mode="aspectFit" />
        </View>
      ) : (
        <View className={`${classPrefix}--container`}>
          <View className={`${classPrefix}--icon`}>{typeof props.icon === 'string' ? <Icon value={props.icon} /> : props.icon}</View>
          <View className={`${classPrefix}--title`}>{props.title}</View>
        </View>
      )}
    </Upload>,
  );
};

export default PictureUpload;
