#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask.ext.assets import Environment, Bundle


css_application = Bundle(
    'less/main.less',
    filters='less',
    debug=False,
    output='gen/app.css'
)

css_all = Bundle(
    # 'vendor/some/library.css',
    css_application,
    filters='cssmin',
    output='gen/app.min.css'
)

js_vendor = Bundle(
    'vendor/jquery/dist/jquery.js',
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-aria/angular-aria.js',
    'vendor/angular-cookies/angular-cookies.js',
    'vendor/angular-messages/angular-messages.js',
    'vendor/angular-resource/angular-resource.js',
    'vendor/angular-route/angular-route.js',
    'vendor/angular-sanitize/angular-sanitize.js',
    'vendor/angular-touch/angular-touch.js',
    'vendor/bootstrap/dist/js/bootstrap.js',
    'vendor/dustjs-linkedin/dist/dust-full.js',
    'vendor/lodash/dist/lodash.js',
    # 'vendor/modernizr/dist/modernizr-build.js', # TODO Customize this
    filters='uglifyjs',
    output='gen/vendor.min.js'
)

js_ie = Bundle(
    'vendor/bootstrap/assets/js/html5shiv.js',
    'vendor/bootstrap/assets/js/respond.min.js',
    filters='uglifyjs',
    output='gen/ie.min.js'
)

js_dust = Bundle(
    'dust/',
    filters='dustjs',
    output='gen/templates.js',
)

js_main = Bundle(
    'libs/ba-debug.js',
    Bundle(
        'coffee/app.coffee',
        'coffee/init.coffee',  # Must be loaded after app.coffee but before anything else.
        'coffee/notify.coffee',
        'coffee/ajax.coffee',
        'coffee/singleton.coffee',
        'coffee/service/api-service.coffee',
        'coffee/listing.coffee',
        'scripts/app.coffee',
        'scripts/controllers/listing.coffee',
        filters='coffeescript',
        output='gen/app.js'
    ),
    filters='uglifyjs',
    output='gen/app.min.js'
)


def init_app(app):
    webassets = Environment(app)
    webassets.register('css_all', css_all)
    webassets.register('js_vendor', js_vendor)
    webassets.register('js_ie', js_ie)
    webassets.register('js_dust', js_dust)
    webassets.register('js_main', js_main)
    webassets.manifest = 'cache' if not app.debug else False
    webassets.cache = not app.debug
    webassets.debug = app.debug
