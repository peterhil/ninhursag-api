#!/usr/bin/env python

from functools import wraps

from app.settings import project_name
try:
    from instance.settings import project_name
except ImportError:
    pass


def route(bp, *args, **kwargs):
    def decorator(f):
        @bp.route(*args, **kwargs)
        @wraps(f)
        def wrapper(*args, **kwargs):
            return f(*args, **kwargs)
        return f

    return decorator
