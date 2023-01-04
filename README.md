# whistle.proxyauth
用来设置代理用户名和密码的插件，可以指定全部或某些经过whistle的请求需要通过用户名和密码登录。

匹配方式：
```
pattern whistle.proxyauth://username:password

# 可以设置多长时间没访问失效，单位毫秒，默认为1小时，最小只能设置10分钟
pattern whistle.proxyauth://username:password@maxAgeMS
```
> 其中，`pattern` 表示匹配请求url的表达式，可以为域名（如：`www.test.com whistle.proxyauth://e`）、路径，通配符、正则表达式等，具体参见：[whistle的匹配模式](http://wproxy.org/whistle/pattern.html)。

# 安装
1. 首先需要安装最新版[whistle](https://github.com/avwo/whistle)，如果你的机器已经安装了whistle，请确保whistle为最新版本：
    - 安装及如何使用whistle参见[Github](https://github.com/avwo/whistle)
    - 如何升级whistle参见[帮助文档](http://wproxy.org/whistle/update.html)。
2. 安装proxyauth插件，执行npm全局安装即可：
    ```
    w2 i whistle.proxyauth
    ```
    > 推荐使用[cnpm](https://github.com/cnpm/cnpm)或自己公司提供的npm镜像安装：`w2 ci whistle.proxyauth`

# 使用
安装插件后，只需配置简单的规则：
```
# 全部请求都要指定用户名和密码登录
/./ whistle.proxyauth://test:123

# 只对某个域名生效
ke.qq.com whistle.proxyauth://abc:123
www.qq.com whistle.proxyauth://hello:123
```
