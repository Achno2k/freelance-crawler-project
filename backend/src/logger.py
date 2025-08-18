# logger.py
import logging
import sys
from typing import Optional

def setup_logger(name: str = __name__, log_level: str = "INFO", log_file: Optional[str] = None) -> logging.Logger:
    """
    Basic logger setup
    Args:
        name: Logger name (usually __name__)
        log_level: DEBUG, INFO, WARNING, ERROR, CRITICAL
        log_file: Optional path to log file
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)

    level = getattr(logging, log_level.upper(), logging.INFO)
    logger.setLevel(level)

    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger