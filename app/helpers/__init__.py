#!/usr/bin/env python

# from flask_security import login_required
from functools import wraps

from .blueprints import register_blueprints
from .slugify import slugify

from app.settings import project_name
try: from instance.settings import project_name
except ImportError: pass


def route(bp, *args, **kwargs):
    def decorator(f):
        @bp.route(*args, **kwargs)
        # @login_required
        @wraps(f)
        def wrapper(*args, **kwargs):
            return f(*args, **kwargs)
        return f

    return decorator
