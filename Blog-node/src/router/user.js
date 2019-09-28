const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 1000);
  return d.toGMTString();
};

const handleUserRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = req.path;

  // 登录
  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body;
    const result = login(username, password);
    return result.then(data => {
      console.log(data);

      if (data.username) {
        // 设置 session
        req.session.username = data.username;
        req.session.realname = data.realname;
        return new SuccessModel();
      }
      return new ErrorModel('登陆失败');
    });
  }

  // 登陆验证
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({ session: req.session }));
    }
    return Promise.resolve(new ErrorModel('尚未登陆'));
  }
};

module.exports = handleUserRouter;
