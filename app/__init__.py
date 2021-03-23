#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os.path

from flask import render_template
from werkzeug.middleware.proxy_fix import ProxyFix

from . import factory
from . import assets
from . import log
from .extensions import flatpages


def root_dir():
    return os.path.abspath(os.path.dirname(__file__))


def create_app(settings_override=None):
    """Returns the application instance"""
    app = factory.create_app(__name__, [root_dir()], settings_override)

    # Init assets
    assets.init_app(app)

    # Init logging
    log.init_app(app)

    # Flat pages
    flatpages.init_app(app)
    app.pages = flatpages

    # Register custom error handlers
    for code in [404, 500]:
        app.errorhandler(code)(get_error_handler(code))

    return app


def get_error_handler(code):
    def handle_error(e):
        return render_template('errors/%s.html' % code), code
    return handle_error


# http://www.onurguzel.com/how-to-run-flask-applications-with-nginx-using-gunicorn/
app = create_app()
app.wsgi_app = ProxyFix(app.wsgi_app)


if __name__ == '__main__':
    app.run()
