#!/usr/bin/env python

import os

from flask import current_app, Blueprint, render_template
from flask import jsonify, redirect, send_from_directory
from pathlib import Path

from app.log import logger
from app.settings import Config


bp = Blueprint('front', __name__)


@bp.route('/config.json')
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


@bp.route('/data/<filename>')
def data(filename):
    data_dir = Path(current_app.root_path).joinpath(Config.DATA_DIR).resolve(strict=True)
    logger.debug("Data asked for {} from directory {}".format(filename, data_dir))

    return send_from_directory(
        data_dir,
        filename,
        mimetype='text/yaml'
        )


@bp.route('/data/tsv/<filename>')
def data_tsv(filename):
    data_dir = Path(current_app.root_path).joinpath(Config.DATA_DIR).joinpath('tsv').resolve(strict=True)
    logger.debug("Data asked for {} from directory {}".format(filename, data_dir))

    return send_from_directory(
        data_dir,
        filename,
        mimetype='text/tsv'
        )


@bp.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(current_app.root_path, 'static/img/icon'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon'
        )


@bp.route('/')
def index():
    """Returns the index."""
    return redirect('/mineral/statistics')


@bp.route('/mineral/<mineral>')
def mineral(mineral='Aluminium'):
    asset_dir = '/static/dev' if current_app.config['DEBUG'] else '/static/dist'
    return render_template('/mineral.html', mineral=mineral, asset_dir=asset_dir)
