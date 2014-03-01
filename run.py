#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from app.frontend import create_app


application = create_app()


if __name__ == '__main__':
    from app.factory import environment
    from app.settings import project_name

    server = application.config['SERVER_NAME'].split(':')
    assert 1 <= len(server) <= 2, "SERVER_NAME in settings should be like 'example.com' or 'localhost:5000', not: {}".format(server)

    host = server[0]
    port = int(server[1]) if len(server) == 2 else 5000
    env = environment()

    print("INFO {0} starting using environment '{3}'".format(project_name, host, port, env))
    application.run(host=host, port=port)
