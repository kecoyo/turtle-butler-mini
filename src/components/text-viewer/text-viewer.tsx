import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { TextArea } from '@nutui/nutui-react-taro';
import './text-viewer.scss';

export type TextViewerProps = {
  /**
   * 文本内容
   */
  text: string;
  /**
   * 最大字符长度
   */
  maxLength?: number;
  /**
   * 是否可编辑
   */
  editable?: boolean;
  /**
   * 内容修改事件
   */
  onChange?: (text: string) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-text-viewer';

const TextViewer: React.FC<TextViewerProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onChange = useMemoizedFn((val) => {
    if (props.onChange) {
      props.onChange(val);
    }
  });

  const renderView = () => {
    const lines = props.text.split('\n');
    return lines.map((line, i) => <View key={i}>{line}</View>);
  };

  return withNativeProps(
    props,
    <View className={classPrefix}>
      {props.editable ? (
        <View className={`${classPrefix}--edit`}>
          <TextArea value={props.text} onChange={onChange} rows={8} maxLength={props.maxLength} />
        </View>
      ) : (
        <View className={`${classPrefix}--view`}>{renderView()}</View>
      )}
    </View>,
  );
};

export default TextViewer;
