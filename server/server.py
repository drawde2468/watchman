from server_logging.logger_configuration import setup_logger

logger = setup_logger()

if __name__ == '__main__':
    logger.debug('This is a debug message')
    logger.info('This is an info message')
    logger.error('This is an error message')
    logger.warning('This is a warning message') 
    logger.critical('This is a critical message')