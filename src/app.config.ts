export default defineAppConfig({
  pages: [
    // tabs
    'pages/category-list/index', // 分类列表
    'pages/mine/index', // 我的
    'pages/update-profile/index', // 修改个人资料

    'pages/category-edit/index', // 分类编辑

    'pages/account-list/index', // 账号列表
    'pages/account-detail/index', // 账号详情
    'pages/account-edit/index', // 账号编辑

    'pages/text-edit/index', // 文本编辑框
    'pages/icon-select/index', // 图标选择
  ],
  tabBar: {
    list: [
      {
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home_fill.png',
        pagePath: 'pages/category-list/index',
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
    selectedColor: '#48bf6b',
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
