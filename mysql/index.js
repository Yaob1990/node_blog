const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'myblog'
});

con.connect();
const sql = 'update users set realname="李四2" where realname="李四"';
con.query(sql, (err, result) => {
  if (err) {
    console.error(error);
    return;
  }
  console.log(result);
});

con.end();
