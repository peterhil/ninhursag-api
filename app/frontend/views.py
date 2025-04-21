#!/usr/bin/env python

import os

from flask import current_app, Blueprint, render_template
from flask import jsonify, redirect, send_from_directory

from app.helpers import route
from app.log import logger


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
        'DATA_DIR',
        'DEBUG',
        'MESSAGES',
        'PREFERRED_URL_SCHEME',
        'SERVER_NAME',
        'TESTING',
    ]
    return jsonify({
        k.lower(): v for k, v in list(current_app.config.items()) if k in exposed_config
    })


@route(bp, '/data/<filename>')
def data(filename):
    data_dir = os.path.join(current_app.root_path, 'static/data')
    logger.debug("Data asked for {} from directory {}".format(filename, data_dir))
    if os.path.splitext(filename)[1][1:].strip().lower() != 'csv':
        return False  # TODO return 404 error
    return send_from_directory(
        data_dir,
        filename, mimetype='text/csv'
        )


@route(bp, '/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(current_app.root_path, 'static/img/icon'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon'
        )


@route(bp, '/')
def index():
    """Returns the index."""
    return redirect('/mineral/statistics')


@route(bp, '/mineral/<mineral>')
def mineral(mineral='Aluminium'):
    asset_dir = '/static/dev' if current_app.config['DEBUG'] else '/static/dist'
    return render_template('/mineral.html', mineral=mineral, asset_dir=asset_dir)
