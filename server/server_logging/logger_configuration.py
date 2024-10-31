import logging
import logging.config
from server_logging.telegram import TelegramHandler

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s - %(filename)s - %(levelname)s - %(message)s'
        },
        'chat': {
            'format': '%(levelname)s: %(message)s'
        }
    },
    'handlers': {
        'file_handler': {
            'class': 'logging.FileHandler',
            'filename': 'app.log',
            'formatter': 'standard',
            'level': logging.DEBUG,
        },
        'telegram_handler': {
            '()': TelegramHandler,
            'formatter': 'chat',
            'level': logging.INFO,
        },
    },
    'loggers': {
        'server_logger': {
            'handlers': ['file_handler', 'telegram_handler'],
            'level': logging.DEBUG,
            'propagate': False,
        },
    },
}

logging.config.dictConfig(LOGGING_CONFIG)

def setup_logger():
    return logging.getLogger("server_logger")