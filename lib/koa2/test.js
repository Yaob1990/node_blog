const Koa = require('./like-koa2');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx['X-Response-Time'];
  console.log(`${ctx.req.method} ${ctx.req.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx['X-Response-Time'] = `${ms}ms`;
});

app.use(async ctx => {
  console.log('hello');
  // 这里也需要改，使用原生方法
  ctx.res.end('like koa2');
});

app.listen(8001);
