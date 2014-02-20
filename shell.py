#!/usr/bin/env python
import os
import readline
from pprint import pprint

from flask import *

import skeleton
from skeleton.frontend import create_app
application = create_app()

os.environ['PYTHONINSPECT'] = 'True'
