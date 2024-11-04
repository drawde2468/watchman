const winston = require("winston");
const { timestamp, printf } = winston.format;
const TelegramTransport = require("./telegramTransport");

const levels = {
  critical: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

const colors = {
  critical: "red",
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
};

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} - ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: "debug",
  levels,
  format: winston.format.combine(winston.format.colorize({ colors })),
  transports: [
    new winston.transports.Console({ format: winston.format.combine(timestamp(), customFormat) }),
    new winston.transports.File({
      filename: "server.log",
      format: winston.format.combine(winston.format.uncolorize(), timestamp(), customFormat),
    }),
    new TelegramTransport({
      format: winston.format.combine(winston.format.uncolorize(), winston.format.simple()),
      level: "info",
    }),
  ],
});

module.exports = logger;
