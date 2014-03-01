#!/usr/bin/env python
# -*- coding: utf-8 -*-

from blueprints import register_blueprints
from slugify import slugify

from app.settings import project_name
try: from instance.settings import project_name
except ImportError: pass
