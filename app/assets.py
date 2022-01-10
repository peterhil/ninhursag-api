#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask_assets import Environment, Bundle


css_application = Bundle(
    'style/main.scss',
    debug=False,
    filters='scss',
    output='gen/app.css'
)

css_foundation = Bundle(
    'vendor/foundation-sites/scss/normalize.scss',
    'vendor/foundation-sites/scss/foundation.scss',
    filters='scss',
    output='gen/foundation.css'
)

css_all = Bundle(
    css_foundation,
    css_application,
    filters='cssmin',
    output='gen/app.min.css'
)

js_foundation = Bundle(
    'vendor/jquery/dist/jquery.js',
    'vendor/js-cookie/src/js.cookie.js',
    'vendor/lodash/lodash.js',
    'vendor/foundation-sites/js/foundation/foundation.js',
    'vendor/foundation-sites/js/foundation/foundation.topbar.js',
    filters='rjsmin',
    output='gen/foundation.min.js'
)

js_vendor = Bundle(
    'vendor/spin.js/spin.js',
    'vendor/papaparse/papaparse.js',
    'vendor/humanize-plus/public/src/humanize.js',
    'vendor/ramda/dist/ramda.js',
    'vendor/soundex-code/index.js',
    'vendor/tinycolor2/tinycolor.js',
    filters='rjsmin',
    output='gen/vendor.min.js'
)

def init_app(app):
    webassets = Environment(app)
    webassets.register('css_all', css_all)
    webassets.register('js_foundation', js_foundation)
    webassets.register('js_vendor', js_vendor)
    webassets.manifest = 'cache' if not app.debug else False
    webassets.cache = not app.debug
    webassets.debug = app.debug
