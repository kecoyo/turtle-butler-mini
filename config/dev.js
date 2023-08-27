// eslint-disable-next-line import/no-commonjs
module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  // plugins: ['@tarojs/plugin-mock'],
  plugins: [],
  defineConstants: {
    // BASE_URL: '"http://127.0.0.1:9527"', // mock.js
    // BASE_URL: '"http://localhost:7001"', // 本地接口
    BASE_URL: '"https://turtle-butler.cpolar.cn"', // 线上接口

    // OPEN_BASE_URL: '"http://localhost:7001"',
    OPEN_BASE_URL: '"https://turtle-open.cpolar.cn"',
  },
  mini: {},
  h5: {},
};
