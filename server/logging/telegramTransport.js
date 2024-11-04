const Transport = require("winston-transport");
const { sendMessage } = require("../utils/telegram");

class TelegramTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    sendMessage(info[Symbol.for("message")]);
    callback(null, true);
  }
}

module.exports = TelegramTransport;
