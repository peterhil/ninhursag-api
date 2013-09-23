#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from flask import url_for, send_from_directory
from skeleton import app
from skeleton.deco import templated

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon'
    )

@app.route('/')
@templated()
def index():
    return dict(value=42)

@app.route('/bootstrap')
@templated()
def bootstrap():
    return dict()
