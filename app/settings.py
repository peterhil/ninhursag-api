#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Flask application default config:
# http://flask.pocoo.org/docs/config/#configuring-from-files
# https://github.com/mbr/flask-appconfig


project_name = u'Skeleton \u2620'


class Default(object):
    DEBUG = False
    TESTING = False
    JS_LOG_LEVEL = 3  # log (1) < debug (2) < info (3) < warn (4) < error (5)

    APP_NAME = project_name

    # Servers and URLs
    SERVER_NAME = 'localhost:5000'

    # Authentication etc
    SECRET_KEY = 'some-secret-key'
    CSRF_ENABLED = True

    # API
    API_SERVER = 'localhost:5000'
    API_TOKEN = 'some-api-token'


class Dev(Default):
    DEBUG = True
    APP_NAME = project_name + ' dev'


class Testing(Default):
    TESTING = True
    CSRF_ENABLED = False


class Production(Default):
    pass
