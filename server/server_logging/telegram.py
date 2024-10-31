import os
import requests
import logging
from dotenv import load_dotenv
load_dotenv()

TOKEN = os.environ.get("TELEGRAM_KEY")
CHANNEL_ID = os.environ.get("CHANNEL_ID")

if not TOKEN:
    raise ValueError("TELEGRAM_KEY environment variable is not set")

if not CHANNEL_ID:
    raise ValueError("CHANNEL_ID environment variable is not set")

TELEGRAM_API_URL = f"https://api.telegram.org/bot{TOKEN}"

class TelegramHandler(logging.Handler):

    def __init__(self):
        super().__init__()

    def emit(self, record):
        """
        Emit a record.

        This method sends a log record to a Telegram channel.

        Parameters:
        record (logging.LogRecord): The log record to be sent.
        """
        record = self.format(record)
        try:
            res = requests.post(url=TELEGRAM_API_URL+"/sendMessage", data={"text": record, "chat_id": CHANNEL_ID})
            res.raise_for_status()
        except Exception as e:
            print(f"Failed to send message to Telegram: {e}")