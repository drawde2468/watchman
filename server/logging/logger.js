const winston = require("winston");
const { timestamp, printf } = winston.format;
const TelegramTransport = require("./telegramTransport");

const timestampedLogFormatter = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} - ${level} - ${message}${Object.keys(meta).length > 0 ? `: ${JSON.stringify(meta)}` : ""}`;
});

const chatFriendlyFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), timestamp(), timestampedLogFormatter),
    }),
    new winston.transports.File({
      filename: "server.log",
      format: winston.format.combine(timestamp(), timestampedLogFormatter),
      maxsize: 20 * 1024 * 1024, // 20MB in bytes,
      maxFiles: 5,
      zippedArchive: true,
    }),
    new TelegramTransport({
      format: winston.format.combine(winston.format.uncolorize(), chatFriendlyFormat),
      level: "info",
    }),
  ],
});

module.exports = logger;
