const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [], //app.use 中间件
      get: [], //app.get 中间件
      post: [] //app.post 中间件
    };
  }
  register(path) {
    const info = {};
    if (typeof path === 'string') {
      info.path = path;
      // 获取函数参数（可能多个）
      info.stack = slice.call(arguments, 1);
    } else {
      // 第一个参数不是string，设置默认为根目录
      info.path = '/';
      info.stack = slice.call(arguments, 0);
    }
    return info;
  }

  use() {
    const info = this.register.apply(this, arguments);
    this.routes.all.push(info);
  }
  get() {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }
  post() {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }
  match(method, url) {
    let stack = [];
    if (url === '/favicon.ico') {
      return stack;
    }
    // 获取routes,找到所有可用的中间件（use,method）
    let curRoutes = [];
    curRoutes = curRoutes.concat(this.routes.all);
    curRoutes = curRoutes.concat(this.routes[method]);

    curRoutes.forEach(routeInfo => {
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack);
        console.log(stack);
      }
    });
    return stack;
  }
  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个获取的中间件(函数)
      const middleware = stack.shift();
      if (middleware) {
        // 递归执行中间件函数
        middleware(req, res, next);
      }
    };
    next();
  }
  callback() {
    return (req, res) => {
      res.json = data => {
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(data));
      };
      const url = req.url;
      const method = req.method.toLowerCase();

      const resultList = this.match(method, url);
      this.handle(req, res, resultList);
    };
  }
  listen(...args) {
    console.log(this.callback());

    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = () => {
  return new LikeExpress();
};
