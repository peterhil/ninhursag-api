#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Flask application default config:
# http://flask.pocoo.org/docs/config/#configuring-from-files
# https://github.com/mbr/flask-appconfig

DEBUG = True
TESTING = False
JS_LOG_LEVEL = 3  # log (1) < debug (2) < info (3) < warn (4) < error (5)

APP_NAME = 'Skeleton'

# Servers and URLs
SERVER_NAME = 'skeleton.dev'

# Authentication etc
SECRET_KEY = 'some-secret-key'

# API
API_SERVER = 'skeleton.dev'
API_TOKEN = 'some-api-token'
