#!/usr/bin/env python
import os
import readline
from pprint import pprint

from flask import *

import app
from app.frontend import create_app
application = create_app()

os.environ['PYTHONINSPECT'] = 'True'
