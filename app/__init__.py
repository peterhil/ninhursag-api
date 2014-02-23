#!/usr/bin/env python
# -*- coding: utf-8 -*-

from app.frontend import create_app
from werkzeug.contrib.fixers import ProxyFix


app = create_app()

# http://www.onurguzel.com/how-to-run-flask-applications-with-nginx-using-gunicorn/
app.wsgi_app = ProxyFix(app.wsgi_app)


if __name__ == '__main__':
    app.run()
