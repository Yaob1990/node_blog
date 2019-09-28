const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

const con = mysql.createConnection(MYSQL_CONF);

// 开始连接
con.connect();
// console.log(con);

// 统一执行sql
function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
  return promise;
}

module.exports = {
  exec
};
