#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from app import create_app
from app.helpers import project_name, slugify


application = create_app()


if __name__ == '__main__':
    from app.factory import environment

    app_name = application.config['APP_NAME']
    server = application.config['SERVER_NAME'].split(':')
    assert 1 <= len(server) <= 2, "SERVER_NAME in settings should be like 'example.com' or 'localhost:5000', not: {}".format(server)

    host = server[0]
    port = int(server[1]) if len(server) == 2 else 80
    env = environment()

    print(("INFO Starting '{app}' ({env_var_prefix}) on {host}:{port} using environment '{env}'".format(**dict(
        app=app_name,
        env_var_prefix=slugify(project_name, '_').upper(),
        host=host,
        port=port,
        env=env,
    ))))
    application.run(host=host, port=port)
