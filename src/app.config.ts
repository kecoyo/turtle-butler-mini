export default defineAppConfig({
  pages: [
    // tabs
    'pages/index/index', // 首页
    'pages/mine/index', // 我的
    'pages/update-profile/index', // 修改个人资料
    'pages/banpai-bind/index', // 班牌绑定
    'pages/my-task/index', // 我的任务
    'pages/school-detail/index', // 学校详情
    'pages/text-edit/index', // 编辑框
  ],
  tabBar: {
    list: [
      {
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home_fill.png',
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        iconPath: 'assets/my.png',
        selectedIconPath: 'assets/my_fill.png',
        pagePath: 'pages/mine/index',
        text: '我的',
      },
    ],
    color: '#666666',
    selectedColor: '#1db79f',
    backgroundColor: '#fff',
    borderStyle: 'white',
  },
  window: {
    backgroundColor: '#f3f4f8',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
});
