#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Flask application default config:
# http://flask.pocoo.org/docs/config/#configuring-from-files
# https://github.com/mbr/flask-appconfig


project_name = u'Ninhursag'


class Default(object):
    APP_NAME = project_name

    DEBUG = False
    TESTING = False

    # Servers and URLs
    SERVER_NAME = 'localhost:5000'

    # Authentication etc
    SECRET_KEY = 'some-secret-key'
    CSRF_ENABLED = True

    # API
    API_SERVER = 'localhost:5000'
    API_TOKEN = 'some-api-token'

    # Flat pages
    FLATPAGES_ROOT = 'pages/flat'
    FLATPAGES_EXTENSION = '.md'
    FLATPAGES_MARKDOWN_EXTENSIONS = []


class Dev(Default):
    APP_NAME = project_name + ' dev'

    DEBUG = True


class Testing(Default):
    TESTING = True
    CSRF_ENABLED = False


class Production(Default):
    pass
