#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from flask import current_app, Blueprint, render_template
from flask import jsonify, url_for, send_from_directory

from app.helpers import route
from ..deco import templated


bp = Blueprint('front', __name__)


@route(bp, '/config.json')
def config():
    """
    Expose some of the application config into the front end.

    Documentation about config values:
    http://flask.pocoo.org/docs/config/#configuring-from-files
    """
    exposed_config = [
        'API_SERVER',
        'API_URL',
        'APP_NAME',
        'ASSETS_DEBUG',
        'DEBUG',
        'DUST_LOG_LEVEL',
        'JS_LOG_LEVEL',
        'PREFERRED_URL_SCHEME',
        'SERVER_NAME',
        'TESTING',
    ]
    return jsonify(dict([
        (k.lower(), v) for k, v in current_app.config.iteritems() if k in exposed_config
    ]))


@route(bp, '/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(current_app.root_path, 'static'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon'
        )

@route(bp, '/')
def index():
    """Returns the index."""
    return render_template('index.html')

@route(bp, '/one')
@templated('/one.html')
def one():
    return dict(greeting='hello')

@route(bp, '/one/<greeting>')
def one_with_greeting(greeting='hello'):
    return render_template('/one.html', greeting=greeting)

@route(bp, '/two')
@templated('/two.html')
def two():
    return dict()
