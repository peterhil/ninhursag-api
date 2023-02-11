#!/usr/bin/env python
# -*- coding: utf-8 -*-
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

from .helpers import project_name, register_blueprints, slugify


def environment():
    default_env = 'dev'
    env_variable = '_'.join([slugify(project_name, '_').upper(), 'ENV'])
    return environ.get(env_variable, default_env).lower()


def create_app(package_name, package_path, settings_override=None):
    """Returns a :class:`Flask` application instance configured with common
    functionality for the application platform.

    :param package_name: application package name
    :param package_path: application package path
    :param settings_override: a dictionary of settings to override
    """
    app = Flask(package_name, instance_relative_config=True)

    # TODO Stricter origins
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    def env_settings(module):
        return '.'.join([module, environment().capitalize()])

    app.config.from_object(env_settings('app.settings'))
    try: app.config.from_object(env_settings('instance.settings'))
    except ImportError: pass
    app.config.from_object(settings_override)

    register_blueprints(app, package_name, package_path)

    return app
