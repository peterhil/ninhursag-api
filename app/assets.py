#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask_assets import Environment, Bundle


css_application = Bundle(
    'style/main.scss',
    filters='scss',
    debug=False,
    output='gen/app.css'
)

css_foundation = Bundle(
    'vendor/foundation-sites/scss/normalize.scss',
    'vendor/foundation-sites/scss/foundation.scss',
    filters='scss',
    output='gen/foundation.css'
)

css_all = Bundle(
    'vendor/angular-growl-v2/build/angular-growl-foundation.css',
    css_foundation,
    css_application,
    filters='cssmin',
    output='gen/app.min.css'
)

js_angular = Bundle(
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    # 'vendor/angular-aria/angular-aria.js',
    'vendor/angular-cookies/angular-cookies.js',
    'vendor/angular-messages/angular-messages.js',
    'vendor/angular-resource/angular-resource.js',
    'vendor/angular-route/angular-route.js',
    'vendor/angular-sanitize/angular-sanitize.js',
    # 'vendor/angular-touch/angular-touch.js',
    'vendor/angular-growl-v2/build/angular-growl.js',
    'vendor/angular-spinner/angular-spinner.js',
    filters='rjsmin',
    output='gen/angular.min.js',
)

js_foundation = Bundle(
    'vendor/jquery/dist/jquery.js',
    'vendor/foundation-sites/js/foundation/foundation.js',
    'vendor/foundation-sites/js/foundation/foundation.topbar.js',
    filters='rjsmin',
    output='gen/foundation.min.js'
)

js_vendor = Bundle(
    'vendor/spin.js/spin.js',
    'vendor/lodash/dist/lodash.js',
    'vendor/papaparse/papaparse.js',
    'vendor/humanize-plus/public/src/humanize.js',
    'vendor/ramda/ramda.js',
    'vendor/soundex-code/index.js',
    'vendor/tinycolor2/tinycolor.js',
    filters='rjsmin',
    output='gen/vendor.min.js'
)

js_d3 = Bundle(
    'vendor/d3/d3.js',
    filters='uglifyjs',
    output='gen/d3.min.js'
)

js_main = Bundle(
    'script/app.coffee',
    'script/service/config.coffee',
    'script/service/api.coffee',
    'script/service/functional.coffee',
    'script/controller/listing.coffee',
    'script/controller/mineral-ctrl.coffee',
    'script/directive/chart.coffee',
    'script/directive/resource.coffee',
    filters=['coffeescript', 'rjsmin'],
    output='gen/app.min.js'
)

def init_app(app):
    webassets = Environment(app)
    webassets.register('css_all', css_all)
    webassets.register('js_angular', js_angular)
    webassets.register('js_foundation', js_foundation)
    webassets.register('js_vendor', js_vendor)
    webassets.register('js_d3', js_d3)
    webassets.register('js_main', js_main)
    webassets.manifest = 'cache' if not app.debug else False
    webassets.cache = not app.debug
    webassets.debug = app.debug
