#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask
from flask.ext.assets import Environment, Bundle

app = Flask(__name__)

assets = Environment(app)
assets.debug = True

all_js = Bundle(
    Bundle(
        'coffee/*.coffee',
        filters='coffeescript',
        output='gen/coffee.js',
        debug=False
    ),
    Bundle(
        'lib/jquery/jquery-1.10.2.js',
        output='gen/jquery-all.js',
    ),
    'vendor/d3/d3.min.js',
    'vendor/crossfilter/crossfilter.min.js',
    'vendor/dc/dc.min.js',
    'lib/underscore/underscore.js',
    'lib/modernizr/modernizr.js',
    'lib/bootstrap/js/modal.js',
    filters='uglifyjs', #'rjsmin',
    output='gen/skeleton.js',
)
assets.register('js_all', all_js)

all_css = Bundle(
    # Bundle(
    #     'lib/bootstrap/less/bootstrap.less',
    #     output='gen/bootstrap.css',
    #     filters='less',
    #     debug=False,
    # ),
    Bundle(
        'less/skeleton.less',
        output='gen/skeleton.css',
        filters='less',
        debug=False,
    ),
    filters='cssmin',
    output='gen/all.css',
)
assets.register('css_all', all_css)

import skeleton.views
