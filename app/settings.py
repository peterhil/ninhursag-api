#!/usr/bin/env python
#
# Flask application default config:
# http://flask.pocoo.org/docs/config/#configuring-from-files
# https://github.com/mbr/flask-appconfig


project_name = 'Ninhursag'


class Default:
    APP_NAME = project_name

    DEBUG = False
    TESTING = False

    # Authentication etc
    # To generate: import os; os.urandom(24)
    SECRET_KEY = 'some-secret-key'
    CSRF_ENABLED = True

    # API
    API_TOKEN = 'some-api-token'

    # Flat pages
    FLATPAGES_ROOT = 'pages/flat'
    FLATPAGES_EXTENSION = '.md'
    FLATPAGES_MARKDOWN_EXTENSIONS = []

    DATA_DIR = 'static/data'


class Dev(Default):
    APP_NAME = project_name + ' (dev)'
    SERVER_NAME = 'localhost:5000'
    DEBUG = True


class Testing(Default):
    TESTING = True
    CSRF_ENABLED = False


class Production(Default):
    pass
