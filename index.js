const LRU = require('lru-cache');
const { createHash } = require('crypto');

const MAX_AGE = 1000 * 60 * 60;
const MAX_AGE_RE = /@\d+$/;
const cache = new LRU({ max: 10000, maxAge: MAX_AGE });

const checkAuth = (auth, value, enableHash) => {
  if (!auth || typeof auth !== 'string') {
    return false;
  }
  auth = auth.substring(auth.indexOf(' ')).trim();
  auth = auth && Buffer.from(auth, 'base64').toString();
  if (!enableHash || !auth) {
    return auth === value;
  }
  const index = auth.indexOf(':');
  if (index === -1) {
    return auth === value;
  }
  let pwd = auth.substring(index + 1).trim();
  pwd = pwd && createHash('sha256').update(pwd).digest('hex');
  return `${auth.substring(0, index)}:${pwd}` === value;
};

exports.auth = (req) => {
  let { ruleValue, clientIp, fromComposer, globalPluginVars, pluginVars } = req.originalReq;
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
    const enableHash = pluginVars.includes('enableHash=true');
    if (!checkAuth(auth1, ruleValue, enableHash) && !checkAuth(auth2, ruleValue, enableHash)) {
      req.setLogin(true);
      req.setHtml('Access denied, please <a href="javascript:;" onclick="location.reload()">try again</a>.');
      return false;
    }
  }
  cache.set(authKey, 1, maxAge);
};
