#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask_assets import Environment, Bundle


css_app = Bundle(
    'style/app.scss',
    debug=False,
    filters=[
        'scss',
        'cssmin'
    ],
    output='gen/app.css'
)

css_vendor = Bundle(
    'vendor/milligram/src/milligram.sass',
    filters=[
        'sass',
        'cssmin'
    ],
    output='gen/vendor.css'
)

def init_app(app):
    webassets = Environment(app)
    webassets.register('css_app', css_app)
    webassets.register('css_vendor', css_vendor)
    webassets.manifest = 'cache' if not app.debug else False
    webassets.cache = not app.debug
    webassets.debug = app.debug
