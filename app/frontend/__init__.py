#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import render_template
# from flask_security import login_required

from functools import wraps

from .. import factory
from . import assets


def create_app(settings_override=None):
    """Returns the application instance"""
    app = factory.create_app(__name__, __path__, settings_override)

    # Init assets
    assets.init_app(app)

    # Register custom error handlers
    for code in [404, 500]:
        app.errorhandler(code)(get_error_handler(code))

    return app


def get_error_handler(code):
    def handle_error(e):
        return render_template('errors/%s.html' % code), code
    return handle_error


def route(bp, *args, **kwargs):
    def decorator(f):
        @bp.route(*args, **kwargs)
        # @login_required
        @wraps(f)
        def wrapper(*args, **kwargs):
            return f(*args, **kwargs)
        return f

    return decorator
