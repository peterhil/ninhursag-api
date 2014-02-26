#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from app.frontend import create_app


application = create_app()


if __name__ == '__main__':
    # TODO: Move host and port to settings
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    application.run(host='127.0.0.1', port=port)
