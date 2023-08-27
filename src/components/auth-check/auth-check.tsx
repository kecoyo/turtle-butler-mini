import mergeProps from '@/common/with-default-props';
import { useAppSelector } from '@/redux/hooks';
import { globalSelector } from '@/redux/reducers/global';
import { ReactNode } from 'react';

export type AuthCheckProps = {
  allowRoles: number[]; // 允许的角色
  children: ReactNode;
};

const defaultProps = {};

/**
 * 检查权限是否允许进入
 * @param p
 * @returns
 */
const AuthCheck: React.FC<AuthCheckProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const { userRole } = useAppSelector(globalSelector);

  if (props.allowRoles.includes(userRole)) {
    return <>{props.children}</>;
  }
  return null;
};

export default AuthCheck;
