export default defineAppConfig({
  pages: [
    'pages/category-list/index', // 分类列表（首页）
    'pages/category-edit/index', // 分类编辑
    'pages/category-sort/index', // 分类排序

    'pages/account-list/index', // 账号列表
    'pages/account-detail/index', // 账号详情
    'pages/account-edit/index', // 账号编辑
    'pages/account-sort/index', // 账号排序
    'pages/account-move/index', // 账号移动

    'pages/mine/index', // 我的
    'pages/update-profile/index', // 修改个人资料

    'pages/add-property/index', // 添加属性
    'pages/text-edit/index', // 编辑文本
    'pages/icon-select/index', // 选择图标
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
