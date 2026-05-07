import {
  createLogger,
  format,
  transports,
} from 'winston';

/**
 * Shared application logger (Winston).
 *
 * - Console transport is helpful during development and container logs.
 * - File transport (`app.log`) provides a simple local audit trail.
 *
 * If you need structured correlation ids or per-request context, consider adding
 * a request-scoped middleware that enriches log entries.
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
});

export default logger;
