const fs = require('fs');
const path = require('path');

// const fileName = path.resolve(__dirname, 'data.txt');
const fileName = path.resolve(__dirname, 'data2.txt');

// 读取文件

fs.readFile(fileName, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // data 二进制，转为字符串
  console.log(data.toString());
});

// 写入文件

const content = '需要写入的内容';
const opt = {
  // 追加写入，覆盖用w
  flag: 'a'
};

fs.writeFile(fileName, content, opt, err => {
  if (err) {
    console.error(err);
  }
});

// 判断文件是否存在

fs.exists(fileName, exist => {
  console.log(exist);
});
