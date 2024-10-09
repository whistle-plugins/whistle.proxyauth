const LRU = require('lru-cache');

const MAX_AGE = 1000 * 60 * 60;
const MAX_AGE_RE = /@\d+$/;
const cache = new LRU({ max: 10000, maxAge: MAX_AGE });

const checkAuth = (auth, value) => {
  if (!auth || typeof auth !== 'string') {
    return false;
  }
  auth = auth.substring(auth.indexOf(' ')).trim();
  return auth && Buffer.from(auth, 'base64').toString() === value;
};

exports.auth = (req) => {
  let { ruleValue, clientIp, fromComposer, globalPluginVars } = req.originalReq;
  if (fromComposer && !globalPluginVars.includes('enableAuthComposer=true')) {
    return;
  }
  let maxAge = MAX_AGE;
  if (ruleValue && MAX_AGE_RE.test(ruleValue)) {
    const time = RegExp['$&'];
    maxAge = Math.max(+time.substring(1), 60000);
    ruleValue = ruleValue.slice(0, -time.length);
  }
  if (!ruleValue) {
    return;
  }
  const authKey = `${ruleValue}\n${clientIp}`;
  if (!cache.get(authKey)) {
    const { authorization: auth1, 'proxy-authorization': auth2 } = req.headers;
    if (!checkAuth(auth1, ruleValue) && !checkAuth(auth2, ruleValue)) {
      req.setLogin(true);
      req.setHtml('Access denied, please <a href="javascript:;" onclick="location.reload()">try again</a>.');
      return false;
    }
  }
  cache.set(authKey, 1, maxAge);
};
