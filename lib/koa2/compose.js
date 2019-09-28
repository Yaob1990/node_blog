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

const middlewareList = [
  async function(ctx, next) {
    console.log(1.0);
    await next();
    console.log(1.1);
  },
  async function(ctx, next) {
    console.log(2.0);
    await next();
    console.log(2.1);
  },
  async function(ctx, next) {
    console.log(3.0);
    // 最终没有了next(),自然就终端了i+1的链条，promise返回
    // await next();
    // console.log(3.1);
  }
];
fn = compose(middlewareList);
fn();
