const http = require('http');

// 组合中间件
function compose(middlewareList) {
  return function(ctx) {
    // 中间件调用
    // 这里是如何判断数组结束的？
    function dispatch(i) {
      const fn = middlewareList[i];
      try {
        // 防止传入的不是async函数
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  };
}

class LikeKoa2 {
  constructor() {
    this.middlewareList = [];
  }
  use(fn) {
    this.middlewareList.push(fn);
    return this;
  }
  createContext(req, res) {
    const ctx = { req, res };
    ctx.query = req.query;
    return ctx;
  }
  handleRequest(ctx, fn) {
    return fn(ctx);
  }
  callback() {
    const fn = compose(this.middlewareList);
    console.log(fn);

    return (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    // const server = http.createServer((req, res) => {
    //   console.log(req);

    //   res.write('hello');
    //   res.end();
    // });
    server.listen(...args);
  }
}

module.exports = LikeKoa2;
