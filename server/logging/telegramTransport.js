const Transport = require("winston-transport");
const { sendMessage } = require("../utils/telegram");

class TelegramTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    try {
      sendMessage(info[Symbol.for("message")]);
    } catch (error) {
      console.error("Error sending message to telegram", error);
    }
    callback(null, true);
  }
}

module.exports = TelegramTransport;
