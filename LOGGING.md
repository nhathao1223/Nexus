# Logging Documentation

## Overview

The Nexus e-commerce application includes a comprehensive logging system using Winston and Morgan to track HTTP requests and errors.

## Logging System

### Components

1. **Winston Logger** (`config/logger.js`)
   - Centralized logging configuration
   - Multiple log levels: error, warn, info, http, debug
   - File and console output

2. **Morgan Middleware** (`middleware/logger.js`)
   - HTTP request logging
   - Response time tracking
   - User identification

3. **Custom Middleware** (`middleware/logger.js`)
   - Request/response logging
   - Error logging
   - Performance monitoring

## Log Files

Logs are stored in the `logs/` directory:

```
logs/
├── error.log      # Error level logs only
├── combined.log   # All logs combined
└── http.log       # HTTP request logs
```

### Log File Rotation

For production, consider implementing log rotation using `winston-daily-rotate-file`:

```bash
npm install winston-daily-rotate-file
```

Then update `config/logger.js` to use daily rotation.

## Log Levels

| Level | Priority | Usage |
|-------|----------|-------|
| error | 0 | Application errors, exceptions |
| warn | 1 | Warnings, potential issues |
| info | 2 | General information, important events |
| http | 3 | HTTP requests and responses |
| debug | 4 | Detailed debugging information |

## Log Format

### HTTP Request Log
```
2024-02-23 10:30:45:123 http: POST /login 200 user@example.com [23/Feb/2024:10:30:45 +0000] - 45ms
```

### Error Log
```
{
  "timestamp": "2024-02-23T10:30:45.123Z",
  "method": "POST",
  "url": "/checkout",
  "status": 500,
  "user": "user@example.com",
  "message": "Database connection failed",
  "stack": "Error: Connection timeout...",
  "body": {...},
  "query": {...}
}
```

### Request/Response Log
```
{
  "timestamp": "2024-02-23T10:30:45.123Z",
  "method": "GET",
  "url": "/products",
  "user": "user@example.com",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Configuration

### Environment Variables

Add to `.env`:

```env
# Log level: error, warn, info, http, debug
LOG_LEVEL=debug

# Node environment
NODE_ENV=development
```

### Log Level by Environment

- **Development**: `debug` (all logs)
- **Production**: `info` (info, warn, error only)

## Usage Examples

### In Controllers

```javascript
const logger = require('../config/logger');

// Log information
logger.info('User registered successfully');

// Log warning
logger.warn('Unusual activity detected');

// Log error
logger.error('Database query failed');

// Log debug info
logger.debug('Processing product filter');
```

### In Middleware

```javascript
const logger = require('../config/logger');

const customMiddleware = (req, res, next) => {
  logger.info(`Processing request: ${req.method} ${req.url}`);
  next();
};
```

## Monitoring Logs

### View Real-time Logs

```bash
# Watch combined logs
tail -f logs/combined.log

# Watch error logs
tail -f logs/error.log

# Watch HTTP logs
tail -f logs/http.log
```

### Search Logs

```bash
# Find all errors
grep "error" logs/combined.log

# Find specific user activity
grep "user@example.com" logs/http.log

# Find failed requests
grep "500\|404" logs/http.log
```

### Log Analysis

```bash
# Count errors by type
grep "error" logs/error.log | wc -l

# Find slowest requests
grep "ms" logs/http.log | sort -t'-' -k2 -rn | head -10

# Find most accessed endpoints
grep "GET\|POST\|PUT\|DELETE" logs/http.log | awk '{print $2}' | sort | uniq -c | sort -rn
```

## Best Practices

1. **Use Appropriate Log Levels**
   - Use `error` for exceptions and failures
   - Use `warn` for potential issues
   - Use `info` for important events
   - Use `debug` for detailed information

2. **Include Context**
   - Log user information when available
   - Include request/response details for debugging
   - Add timestamps for correlation

3. **Avoid Logging Sensitive Data**
   - Don't log passwords or tokens
   - Don't log full request bodies with sensitive data
   - Sanitize user input before logging

4. **Performance Considerations**
   - Use appropriate log levels in production
   - Implement log rotation to manage file size
   - Archive old logs regularly

5. **Error Handling**
   - Always log errors with full context
   - Include stack traces in development
   - Log error recovery attempts

## Production Setup

For production deployment:

1. **Install log rotation**
   ```bash
   npm install winston-daily-rotate-file
   ```

2. **Update logger configuration**
   ```javascript
   const DailyRotateFile = require('winston-daily-rotate-file');
   
   new DailyRotateFile({
     filename: 'logs/application-%DATE%.log',
     datePattern: 'YYYY-MM-DD',
     maxSize: '20m',
     maxDays: '14d'
   })
   ```

3. **Set environment variables**
   ```env
   LOG_LEVEL=info
   NODE_ENV=production
   ```

4. **Monitor logs with external service**
   - Use services like Datadog, New Relic, or ELK Stack
   - Set up alerts for critical errors
   - Create dashboards for monitoring

## Troubleshooting

### Logs not appearing

1. Check `LOG_LEVEL` environment variable
2. Verify `logs/` directory exists and is writable
3. Check file permissions: `chmod 755 logs/`
4. Restart the application

### Log files growing too large

1. Implement log rotation
2. Archive old logs
3. Reduce log level in production
4. Clean up old log files: `rm logs/*.log`

### Performance issues

1. Reduce log level (remove `debug` in production)
2. Implement log rotation
3. Use async logging
4. Consider external logging service

## Integration with Monitoring Tools

### Datadog
```javascript
const logger = require('./config/logger');

// Logs are automatically sent to Datadog
logger.info('Event tracked', { 
  userId: user._id,
  action: 'purchase'
});
```

### ELK Stack
Configure Filebeat to ship logs to Elasticsearch:
```yaml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /app/logs/*.log
```

### Sentry (Error Tracking)
```javascript
const Sentry = require("@sentry/node");

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.errorHandler());
```

## References

- [Winston Documentation](https://github.com/winstonjs/winston)
- [Morgan Documentation](https://github.com/expressjs/morgan)
- [Node.js Logging Best Practices](https://nodejs.org/en/docs/guides/nodejs-logging/)
