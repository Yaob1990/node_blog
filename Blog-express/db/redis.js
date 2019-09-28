const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', err => {
  console.error(err);
});

function set(key, val) {
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  redisClient.set(key, val, redis.print);
}

function get(key, val) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        console.err(err);
        return;
      }
      if (val == null) {
        resolve(null);
        return;
      }
      // 如果是json，解码，不是，就会走到catch，原样返回，有点巧妙
      try {
        resolve(JSON.parse(val));
      } catch (error) {
        resolve(val);
      }
      // redisClient.quit();
    });
  });
  return promise;
}

module.exports = {
  set,
  get
};
