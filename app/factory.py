#!/usr/bin/env python
#
# ---
# Flask app factory from:
# https://github.com/mattupstate/overholt/blob/master/overholt/factory.py
# ---
#
# MIT License
#
# Copyright (C) 2013 by Matthew Wright
# Copyright (C) 2014 by Peter Hillerström
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation files
# (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge,
# publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
# BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

from flask import Flask
from flask_cors import CORS
from os import environ

from app.api.views import bp as api
from app.frontend.views import bp as frontend
from app.pages.views import bp as pages


def create_app(package_name, settings_override=None):
    """Returns a :class:`Flask` application instance configured with common
    functionality for the application platform.

    :param package_name: application package name
    :param package_path: application package path
    :param settings_override: a dictionary of settings to override
    """
    app = Flask(package_name, instance_relative_config=True)

    # TODO Stricter origins
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.config.from_object('app.settings.Config')
    app.config.from_object(settings_override)

    app.register_blueprint(api)
    app.register_blueprint(frontend)
    app.register_blueprint(pages)

    return app
