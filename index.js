const LRU = require('lru-cache');

const AUTH_RE = /^\s*basic\s+(\S+)/i;
const MAX_AGE = 1000 * 60 * 60;
const MAX_AGE_RE = /@\d+$/;
const cache = new LRU({
  max: 10000,
  maxAge: MAX_AGE,
});
const ERR_RULES = JSON.stringify({
  rules: '/./ statusCode://401 file://{__authFaildTips}',
  values: {
    __authFaildTips: 'Access denied, please <a href="javascript:;" onclick="location.reload()">try again</a>.',
  },
});

const decodeBase64 = (str) => {
  try {
    return Buffer.from(str, 'base64').toString();
  } catch (e) {}
  return '';
};
// 相当于 rulesServer + tunnelRulesServer
exports.pluginRulesServer = (server) => {
  server.on('request', (req, res) => {
    let {
      ruleValue,
      clientIp,
    } = req.originalReq;
    if (!ruleValue) {
      return res.end();
    }
    let maxAge = MAX_AGE;
    if (MAX_AGE_RE.test(ruleValue)) {
      const time = RegExp['$&'];
      maxAge = Math.max(+time.substring(1), 60000);
      ruleValue = ruleValue.slice(0, -time.length);
      if (!ruleValue) {
        return res.end();
      }
    }
    const authKey = `${ruleValue}\n${clientIp}`;
    if (!cache.get(authKey)) {
      if (!AUTH_RE.test(req.headers.authorization) ||
          (decodeBase64(RegExp.$1) !== ruleValue)) {
        return res.end(ERR_RULES);
      }
    }
    cache.set(authKey, 1, maxAge);
    return res.end();
  });
};
