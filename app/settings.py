#!/usr/bin/env python
#
# Flask application default config:
# http://flask.pocoo.org/docs/config/#configuring-from-files
# https://github.com/mbr/flask-appconfig

from decouple import Csv, config

config.encoding = 'utf-8'


class Config:
    # Flask env variables
    ASSETS_DEBUG = config('FLASK_ASSETS_DEBUG', default=False, cast=bool)
    DEBUG = config('FLASK_DEBUG', default=False, cast=bool)
    ENV = config('FLASK_ENV', default='development')
    # To generate the secret key: python -c 'import secrets; print(secrets.token_hex())'
    SECRET_KEY = config('FLASK_SECRET_KEY')
    SERVER_NAME = config('FLASK_SERVER_NAME', default='localhost:5000')
    TESTING = config('FLASK_TESTING', default=False, cast=bool)

    # Flask extensions
    FLATPAGES_EXTENSION = config('FLATPAGES_EXTENSION', default='.md')
    FLATPAGES_MARKDOWN_EXTENSIONS = config(
        'FLATPAGES_MARKDOWN_EXTENSIONS',
        default='codehilite',
        cast=Csv(post_process=list)
    )
    FLATPAGES_ROOT = config('FLATPAGES_ROOT', default='pages/flat')

    # Other
    APP_NAME = config('APP_NAME', default='Ninhursag')
    DATA_DIR = config('DATA_DIR', default='static/data')
