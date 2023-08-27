// 该文件由 API文档 自动生成，请勿手动修改！
import Mock from 'mockjs';

/**
 * 用户
 */
export default {
  // 更改资料获取手机验证码
  'POST /api/user/sendUpdateCode': Mock.mock({
    result: 0,
    data: true,
  }),
  // 获取用户基本资料
  'POST /api/user/getBaseInfo': Mock.mock({
    result: 0,
    data: {
      'id|+1': 1,
      name: '@cname',
      avatar: 'dmres/1/01153f526c7da2532ec9445d60059332.jpg',
      school: {
        id: 1,
        name: '河北省邢台市第一中学',
      },
    },
  }),
};
