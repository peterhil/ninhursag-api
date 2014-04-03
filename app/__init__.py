#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import render_template
from werkzeug.contrib.fixers import ProxyFix

from . import factory
from . import assets


def create_app(settings_override=None):
    """Returns the application instance"""
    app = factory.create_app(__name__, __path__, settings_override)

    # Init assets
    assets.init_app(app)

    # Register custom error handlers
    if not app.debug:
        for e in [500, 404]:
            app.errorhandler(e)(handle_error)

    return app


def handle_error(e):
    return render_template('errors/%s.html' % e.code), e.code


if __name__ == '__main__':
    app = create_app()
    # http://www.onurguzel.com/how-to-run-flask-applications-with-nginx-using-gunicorn/
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.run()
