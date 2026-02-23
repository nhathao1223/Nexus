const morgan = require('morgan');
const logger = require('../config/logger');

// Custom morgan token for user info
morgan.token('user', (req) => {
  return req.session?.user?.email || 'anonymous';
});

// Custom morgan token for response time
morgan.token('response-time-ms', (req, res) => {
  if (!res._header) return '';
  const time = res.getHeader('X-Response-Time');
  return time ? `${time}ms` : '';
});

// Create custom morgan format
const morganFormat = ':method :url :status :user [:date[clf]] - :response-time-ms';

// Create stream for morgan to write to logger
const stream = {
  write: (message) => logger.http(message.trim())
};

// Create morgan middleware
const morganMiddleware = morgan(morganFormat, { stream });

// Custom error logging middleware
const errorLogger = (err, req, res, next) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    status: res.statusCode,
    user: req.session?.user?.email || 'anonymous',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    body: req.body,
    query: req.query
  };

  logger.error(JSON.stringify(errorInfo, null, 2));
  next(err);
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  const requestInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    user: req.session?.user?.email || 'anonymous',
    ip: req.ip,
    userAgent: req.get('user-agent')
  };

  logger.debug(`Request: ${JSON.stringify(requestInfo)}`);

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', duration);

    const responseInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      user: req.session?.user?.email || 'anonymous'
    };

    if (res.statusCode >= 400) {
      logger.warn(`Response: ${JSON.stringify(responseInfo)}`);
    } else {
      logger.debug(`Response: ${JSON.stringify(responseInfo)}`);
    }

    return originalSend.call(this, data);
  };

  next();
};

module.exports = {
  morganMiddleware,
  errorLogger,
  requestLogger
};
