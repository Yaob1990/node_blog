const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog');

const { SuccessModel, ErrorModel } = require('../model/resModel');

// 统一的登陆验证函数
const loginCheck = req => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登陆'));
  }
};

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = req.path;
  const id = req.query.id;
  console.log('handleBlogRouter');

  // 博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    console.log('12');

    const author = req.query.author || '';
    const keyword = req.query.keyword || '';
    // const listData = getList(author, keyword);
    // return new SuccessModel(listData);
    const result = getList(author, keyword);
    return result.then(listData => {
      return new SuccessModel(listData);
    });
  }
  // 博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    const result = getDetail(id);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }
  // 新建一篇博客
  if (method === 'POST' && path === '/api/blog/new') {
    // 这里promise 不是异步的？
    const loginCheckResult = loginCheck(req);
    // 有值，那么就是有返回，返回promise
    if (loginCheckResult) {
      return loginCheckResult;
    }
    const blogData = req.body;
    const author = req.session.username;
    blogData.author = author;
    // const data = newBlog(blogData);
    // return new SuccessModel(data);
    const result = newBlog(blogData);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }
  // 更新一篇博客
  if (method === 'POST' && path === '/api/blog/update') {
    console.log('“update');
    const loginCheckResult = loginCheck(req);
    // 有值，那么就是有返回，返回promise
    if (loginCheckResult) {
      return loginCheckResult;
    }
    const result = updateBlog(id, req.body);
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel('更新博客失败');
      }
    });
  }

  // 删除一篇博客
  if (method === 'GET' && path === '/api/blog/delete') {
    const author = req.session.username;
    const loginCheckResult = loginCheck(req);
    // 有值，那么就是有返回，返回promise
    if (loginCheckResult) {
      return loginCheckResult;
    }
    const result = delBlog(id, author);
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel('删除失败');
      }
    });
  }
};

module.exports = handleBlogRouter;
