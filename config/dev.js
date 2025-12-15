// eslint-disable-next-line import/no-commonjs
module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  // plugins: ['@tarojs/plugin-mock'],
  plugins: [],
  defineConstants: {
    BASE_URL: '"http://localhost:9090"', // 本地接口
    // BASE_URL: '"https://turtle-admin.kecoyo.top"', // 线上接口
  },
  mini: {},
  h5: {},
};
