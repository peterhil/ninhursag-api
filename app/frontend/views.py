
# -*- coding: utf-8 -*-

import os

from flask import current_app, Blueprint, render_template
from flask import jsonify, url_for, send_from_directory

from . import route
from ..deco import templated


app = Blueprint('app', __name__)


@route(app, '/config.json')
def config():
    """
    Expose some of the application config into the front end.

    Documentation about config values:
    http://flask.pocoo.org/docs/config/#configuring-from-files
    """
    exposed_config = [
        'APP_NAME',
        'ASSETS_DEBUG',
        'DEBUG',
        'PREFERRED_URL_SCHEME',
        'SERVER_NAME',
        'TESTING',
        'API_URL',
        'API_SERVER',
    ]
    return jsonify(dict([
        (k.lower(), v) for k, v in current_app.config.iteritems() if k in exposed_config
    ]))

# See http://flask-restful.readthedocs.org/en/latest/ or https://github.com/ametaireau/flask-rest/
# on how to properly implement an REST API with Flask
@route(app, '/api/<entity>')
def api(entity):
    return jsonify({entity: [
        {'url': '/one'},
        {'url': '/two'},
    ]})

@route(app, '/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon'
    )

@route(app, '/')
def index():
    """Returns the index."""
    return render_template('index.html')

@route(app, '/one')
@templated('/one.html')
def one():
    return dict(greeting='hello')

@route(app, '/one/<greeting>')
def one_with_greeting(greeting='hello'):
    return render_template('/one.html', greeting=greeting)

@route(app, '/two')
@templated('/two.html')
def two():
    return dict()
