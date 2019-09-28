const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { access } = require('./src/util/log');

// session 数据
const SESSION_DATA = {};

// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 1000);
  return d.toGMTString();
};

// 用于处理post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }
    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandle = (req, res) => {
  // 记录日志
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers['user-agent']
    } -- ${Date.now()}`
  );

  res.setHeader('Content-type', 'application/json');

  const url = req.url;
  req.path = url.split('?')[0];

  // 解析 query
  req.query = querystring.parse(url.split('?')[1]);

  // 解析 cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || '';
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split('=');
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  // 解析session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (userId) {
    if (!SESSION_DATA.userId) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = Date.now();
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];

  //   处理 postData
  getPostData(req).then(postData => {
    req.body = postData;

    // 处理blog路由
    const blogResult = handleBlogRouter(req, res);
    console.log(blogResult);

    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(userData));
      });
      return;
    }

    // 404 情況
    res.writeHead(404, {
      'Content-type': 'text/plain'
    });
    res.write('404 Not Found');
    res.end();
  });
};

module.exports = serverHandle;
