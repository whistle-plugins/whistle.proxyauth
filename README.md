# whistle.proxyauth

中文 · [English](./README-en_US.md)

`whistle.proxyauth` 是一个用于为经过 whistle 代理的请求设置 HTTP 基本认证（用户名和密码）的插件。你可以指定全部或部分请求需要通过用户名和密码验证才能访问。

## 安装步骤

### 1. 安装或更新 whistle

确保已安装最新版 whistle：
```bash
npm install -g whistle
```

> 详见文档：https://wproxy.org/docs/

### 2. 安装 proxyauth 插件
```bash
w2 i whistle.proxyauth
```

## 配置语法

### 基础格式
```
pattern whistle.proxyauth://username:password
```

### 带有效期配置
```
pattern whistle.proxyauth://username:password@maxAgeMS
```
- `maxAgeMS`：认证有效时长（毫秒）
  - 默认值：3600000（1小时）
  - 最小值：600000（10分钟）

### 参数说明
- `pattern`：匹配请求的规则，支持域名、路径、通配符、正则表达式等，详见 [whistle 匹配模式](http://wproxy.org/whistle/pattern.html)
- `username`：认证用户名
- `password`：认证密码

## 使用示例

### 基础用法
```txt
# 为所有请求启用代理认证
* whistle.proxyauth://test:123456

# 仅对特定域名启用
www.example.com whistle.proxyauth://admin:secret
api.test.com whistle.proxyauth://user:pass
```

### 设置认证有效期
```txt
# 设置认证有效期为 30 分钟（1800000 毫秒）
*.example.com whistle.proxyauth://test:123456@1800000

# 设置有效期为 2 小时
www.test.com whistle.proxyauth://user:pass@7200000
```

### 密码哈希支持
```txt
# 使用 SHA-256 哈希密码（明文为 "123"）
www.example.com whistle.proxyauth://test:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3 %proxyauth.enableHash=true
```

## 特殊场景处理

### 密码中包含 @ 符号
如果密码包含 `@` 符号（如 `xxxxx@123`），为避免与有效期参数混淆，需额外添加一个 `@` 分隔符：

```txt
# 错误：@123 会被识别为有效期参数
pattern whistle.proxyauth://test:xxxxx@123

# 正确：使用双 @ 符号
pattern whistle.proxyauth://test:xxxxx@123@3600000
```

### 多规则组合
```txt
# 不同路径使用不同认证
www.example.com/api/ whistle.proxyauth://api_user:api_pass
www.example.com/admin/ whistle.proxyauth://admin:admin123@3600000
```

## 工作原理

1. 当请求匹配到配置的规则时，whistle 会检查请求头中是否包含 `Proxy-Authorization` 字段
2. 如果未包含或认证信息不正确，whistle 会返回 `407 Proxy Authentication Required` 响应
3. 客户端需提供正确的用户名和密码才能继续访问目标资源

## 故障排除

### 常见问题
1. **认证不生效**：检查 whistle 是否正常运行，规则是否已保存并启用
2. **密码错误**：确认密码中是否包含 `@` 符号，如有请按特殊格式配置
3. **有效期异常**：确保 `maxAgeMS` 值不小于 600000（10分钟）

### 调试建议
1. 使用 whistle 的 Network 面板查看请求是否被正确拦截
2. 检查响应头是否包含 `Proxy-Authenticate` 字段
3. 确认客户端是否正确处理了 407 响应

> 更多帮助请参考：
> - [whistle 官方文档](http://wproxy.org/whistle/)
> - [whistle 匹配模式详解](http://wproxy.org/whistle/pattern.html)
> - [GitHub 问题反馈](https://github.com/avwo/whistle/issues)
