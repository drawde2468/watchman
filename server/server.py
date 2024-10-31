from server_logging.logger_configuration import setup_logger

logger = setup_logger()

if __name__ == '__main__':
    logger.info('This is an info message')
    logger.debug('This is a debug message')