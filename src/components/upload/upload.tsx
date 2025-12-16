import { NativeProps, withNativeProps } from '@/common/native-props';
import { chooseImageAndUpload } from '@/common/upload-image';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { ReactNode } from 'react';
import './upload.scss';

type Props = {
  tags: string;
  children: ReactNode;
  onChange?: (url: string) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-upload`;

const Upload: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onUpload = useMemoizedFn(async () => {
    const url = await chooseImageAndUpload(props.tags, 1);
    onChange(url);
  });

  const onChange = useMemoizedFn(async (url: string) => {
    if (url && props.onChange) {
      props.onChange(url);
    }
  });

  return withNativeProps(
    props,
    <View className={classPrefix} onClick={onUpload}>
      {props.children}
    </View>,
  );
};

export default Upload;
