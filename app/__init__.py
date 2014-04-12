#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import render_template
from flask_flatpages import FlatPages
from werkzeug.contrib.fixers import ProxyFix

from . import factory
from . import assets
from .extensions import flatpages


def create_app(settings_override=None):
    """Returns the application instance"""
    app = factory.create_app(__name__, __path__, settings_override)

    # Init assets
    assets.init_app(app)

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


if __name__ == '__main__':
    app = create_app()
    # http://www.onurguzel.com/how-to-run-flask-applications-with-nginx-using-gunicorn/
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.run()
