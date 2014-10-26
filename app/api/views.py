#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# See http://flask-restful.readthedocs.org/en/latest/
# on how to properly implement an REST API with Flask

from flask import current_app, Blueprint
from flask import jsonify, url_for, send_from_directory
from flask.ext import restful

from app.helpers import route


API_VERSION = 1

bp = Blueprint('rest', __name__, url_prefix='/api/v1')
rest = restful.Api(bp)


class ApiIndex(restful.Resource):
    def get(self):
        return {
            'version': API_VERSION,
            }

class HelloWorld(restful.Resource):
    def get(self):
        return {
            'hello': 'world',
            'version': API_VERSION,
            }

class Items(restful.Resource):
    def get(self):
        return {'items':
                [
                    {'url': '/one'},
                    {'url': '/two'},
                ]
            }

rest.add_resource(ApiIndex, '/')
rest.add_resource(HelloWorld, '/hello')
rest.add_resource(Items, '/items')
