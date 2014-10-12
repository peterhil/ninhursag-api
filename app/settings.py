#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Flask application default config:
# http://flask.pocoo.org/docs/config/#configuring-from-files
# https://github.com/mbr/flask-appconfig


project_name = u'Skeleton'


class Default(object):
    APP_NAME = project_name

    DEBUG = False
    TESTING = False
    JS_LOG_LEVEL = 3  # log (1) < debug (2) < info (3) < warn (4) < error (5)
    DUST_LOG_LEVEL = 'INFO'

    # Servers and URLs
    SERVER_NAME = 'localhost:5000'

    # Authentication etc
    SECRET_KEY = 'some-secret-key'
    CSRF_ENABLED = True

    # API
    API_SERVER = 'localhost:5000'
    API_TOKEN = 'some-api-token'


class Dev(Default):
    APP_NAME = project_name + ' dev'

    DEBUG = True
    JS_LOG_LEVEL = 1
    DUST_LOG_LEVEL = 'DEBUG'


class Testing(Default):
    TESTING = True
    CSRF_ENABLED = False


class Production(Default):
    pass
