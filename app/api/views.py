#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# See http://flask-restful.readthedocs.org/en/latest/
# on how to properly implement an REST API with Flask

from flask import current_app, request, Blueprint
from flask import jsonify, url_for, send_from_directory
from flask.ext import restful

from analysis import estimate
from app.helpers import route

import analysis
import json
import numpy as np
import scipy.stats as stats


API_VERSION = 1

bp = Blueprint('rest', __name__, url_prefix='/api/v1')
rest = restful.Api(bp)


def as_json(arr):
    return arr.tolist()


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

class Estimate(restful.Resource):
    def get(self):
        return {
            'cdf': sorted(analysis.scipy_functions('cdf').keys()),
            'pdf': sorted(analysis.scipy_functions('pdf').keys()),
            }

    def post(self):
        try:
            obj = json.loads(request.data)
            data = obj['data']
            years = obj['years']
        except ValueError, e:
            restful.abort(400, errors=["Request is not valid JSON."])
        except KeyError, e:
            restful.abort(400, errors=["Expected to find property '{}' on the request data.".format(e.message)])

        # result = estimate(analysis.logistic, data, years, np.amax(years), log=False)
        result = estimate(analysis.wrap_scipy(stats.dgamma.cdf), data, years, np.amax(years), log=False)

        e_years, e_data = result
        return {'years': as_json(e_years), 'data': as_json(e_data.astype(np.float32))}, 200


rest.add_resource(Estimate, '/estimate')
rest.add_resource(ApiIndex, '/')
rest.add_resource(HelloWorld, '/hello')
rest.add_resource(Items, '/items')
