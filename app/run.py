#!/usr/bin/env python

from app import create_app


application = create_app()


if __name__ == '__main__':
    app_name = application.config['APP_NAME']
    server = application.config['SERVER_NAME'].split(':')
    assert 1 <= len(server) <= 2, "SERVER_NAME in settings should be like 'example.com' or 'localhost:5000', not: {}".format(server)

    host = server[0]
    port = int(server[1]) if len(server) == 2 else 80

    print(("INFO Starting '{app}' on {host}:{port}".format(**dict(
        app=app_name,
        host=host,
        port=port,
    ))))
    application.run(host=host, port=port)
