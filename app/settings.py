#!/usr/bin/env python
#
# Flask application default config:
# http://flask.pocoo.org/docs/config/#configuring-from-files
# https://github.com/mbr/flask-appconfig

from decouple import Csv, config

config.encoding = 'utf-8'

project_name = 'Ninhursag'


class Default:
    # Flask env variables
    DEBUG = config('FLASK_DEBUG', default=False, cast=bool)
    SECRET_KEY = config('FLASK_SECRET_KEY')  # To generate: import os; os.urandom(24).hex()
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
    APP_NAME = config('APP_NAME', default=project_name)
    DATA_DIR = config('DATA_DIR', default='static/data')


class Dev(Default):
    APP_NAME = config('APP_NAME', default=project_name + ' (dev)')
    DEBUG = config('FLASK_DEBUG', default=True, cast=bool)
    SERVER_NAME = config('SERVER_NAME', default='localhost:5000')


class Testing(Default):
    APP_NAME = config('APP_NAME', default=project_name + ' (test)')
    TESTING = config('FLASK_TESTING', default=True, cast=bool)


class Production(Default):
    pass
