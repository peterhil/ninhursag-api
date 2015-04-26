#!/usr/bin/env python
# encoding: utf-8

import sys
import logging


absformatter = logging.Formatter("%(name)s: [%(asctime)s] [%(levelname)s]  %(message)s")

logger = logging.getLogger('Ninhursag')

handler = logging.StreamHandler(sys.stderr)
handler.setFormatter(absformatter)
logger.addHandler(handler)


def init_app(app):
    if app.debug:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
