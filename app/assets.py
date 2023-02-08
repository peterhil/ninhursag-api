#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask_assets import Environment, Bundle


css_main = Bundle(
    'style/main.scss',
    debug=False,
    filters='scss',
    output='gen/app.css'
)

css_all = Bundle(
    css_main,
    filters='cssmin',
    output='gen/app.min.css'
)

js_vendor = Bundle(
    'vendor/humanize-plus/public/src/humanize.js',
    'vendor/js-cookie/src/js.cookie.js',
    'vendor/papaparse/papaparse.js',
    'vendor/ramda/dist/ramda.js',
    'vendor/soundex-code/index.js',
    'vendor/spin.js/spin.js',
    'vendor/tinycolor2/tinycolor.js',
    filters='rjsmin',
    output='gen/vendor.min.js'
)

def init_app(app):
    webassets = Environment(app)
    webassets.register('css_all', css_all)
    webassets.register('js_vendor', js_vendor)
    webassets.manifest = 'cache' if not app.debug else False
    webassets.cache = not app.debug
    webassets.debug = app.debug
