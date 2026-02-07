# whistle.proxyauth

[中文](./README.md) · English

`whistle.proxyauth` is a plugin used to set up HTTP Basic Authentication (username and password) for requests proxied through whistle. You can specify that all or a subset of requests must be authenticated with a username and password to be accessed.

## Installation Steps

### 1. Install or Update whistle
Ensure you have the latest version of whistle installed:
```bash
npm install -g whistle
```

> See documentation at: https://wproxy.org/docs/

### 2. Install the proxyauth plugin
```bash
w2 i whistle.proxyauth
```

## Configuration Syntax

### Basic Format
```
pattern whistle.proxyauth://username:password
```

### Configuration with Validity Period
```
pattern whistle.proxyauth://username:password@maxAgeMS
```
- `maxAgeMS`: Authentication validity period in milliseconds.
  - Default: 3600000 (1 hour)
  - Minimum: 600000 (10 minutes)

### Parameter Description
- `pattern`: The rule for matching requests. Supports domain names, paths, wildcards, regular expressions, etc. See [whistle Matching Patterns](http://wproxy.org/whistle/pattern.html) for details.
- `username`: Authentication username.
- `password`: Authentication password.

## Usage Examples

### Basic Usage
```txt
# Enable proxy authentication for all requests
* whistle.proxyauth://test:123456

# Enable only for specific domains
www.example.com whistle.proxyauth://admin:secret
api.test.com whistle.proxyauth://user:pass
```

### Setting Authentication Validity Period
```txt
# Set validity period to 30 minutes (1800000 ms)
*.example.com whistle.proxyauth://test:123456@1800000

# Set validity period to 2 hours
www.test.com whistle.proxyauth://user:pass@7200000
```

### Password Hash Support
```txt
# Use SHA-256 hashed password (plaintext is "123")
www.example.com whistle.proxyauth://test:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3 %proxyauth.enableHash=true
```

## Handling Special Cases

### Passwords Containing the @ Symbol
If the password contains the `@` symbol (e.g., `xxxxx@123`), to avoid confusion with the validity period parameter, an extra `@` delimiter is needed:

```txt
# Incorrect: @123 will be interpreted as the validity period parameter
pattern whistle.proxyauth://test:xxxxx@123

# Correct: Use double @ symbols
pattern whistle.proxyauth://test:xxxxx@123@3600000
```

### Multiple Rule Combinations
```txt
# Different authentication for different paths
www.example.com/api/ whistle.proxyauth://api_user:api_pass
www.example.com/admin/ whistle.proxyauth://admin:admin123@3600000
```

## How It Works

1. When a request matches a configured rule, whistle checks if the request headers contain the `Proxy-Authorization` field.
2. If the field is missing or the authentication information is incorrect, whistle returns a `407 Proxy Authentication Required` response.
3. The client must provide the correct username and password to proceed with accessing the target resource.

## Troubleshooting

### Common Issues
1. **Authentication Not Taking Effect**: Check if whistle is running normally and if the rules are saved and enabled.
2. **Incorrect Password**: Confirm if the password contains the `@` symbol. If so, configure it using the special format.
3. **Abnormal Validity Period**: Ensure the `maxAgeMS` value is not less than 600000 (10 minutes).

### Debugging Suggestions
1. Use whistle's Network panel to see if requests are being correctly intercepted.
2. Check if the response headers contain the `Proxy-Authenticate` field.
3. Confirm that the client is correctly handling the 407 response.

> For more help, refer to:
> - [Official whistle documentation](http://wproxy.org/whistle/)
> - [Detailed whistle matching patterns](http://wproxy.org/whistle/pattern.html)
> - [GitHub issue reporting](https://github.com/avwo/whistle/issues)
