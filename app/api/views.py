#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# See http://flask-restful.readthedocs.org/en/latest/
# on how to properly implement an REST API with Flask

import json
import os

from flask import current_app, request, Blueprint
from flask import jsonify, url_for, send_from_directory
from flask.ext import restful

from analysis import estimate
from app.helpers import route

import analysis
import json
import numpy as np
import scipy.stats as stats
import yaml


API_VERSION = 1

bp = Blueprint('rest', __name__, url_prefix='/api/v1')
rest = restful.Api(bp)


def replace_nan(x):
    if np.ndim(x) > 0:
        return quote_nans(x)
    if np.isnan(x): return 'NaN'
    elif np.isinf(x):
        return '-Infinity' if np.sign(x) == -1.0 else 'Infinity'
    else:
        return x

def quote_nans(lst):
    return map(replace_nan, lst)


def as_json(arr):
    return quote_nans(arr.tolist())


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
            function = obj['function'] if obj['function'] in analysis.scipy_functions('pdf').keys() else ''
        except ValueError, e:
            restful.abort(400, errors=["Request is not valid JSON."])
        except KeyError, e:
            restful.abort(400, errors=["Expected to find property '{}' on the request data.".format(e.message)])

        try:
            # result = estimate(analysis.logistic, data, years, np.amax(years), log=False)
            # result = estimate(analysis.wrap_scipy(stats.gamma.pdf), data, years, np.amax(years) + 100, log=False)
            result = estimate(analysis.scipy_functions('pdf').get(function), data, years, np.amax(years) + 70, log=False)
        except Exception, e:
            restful.abort(400, errors=[e.message])

        e_years, e_data, e_cov = result
        return {
            'years': as_json(e_years),
            'data': as_json(e_data.astype(np.float64)),
            'covariance': as_json(e_cov),
            }, 200

class Minerals(restful.Resource):
    def get(self):
        index = os.path.join(current_app.root_path, current_app.config['DATA_DIR'], 'tsv', 'index.json')
        with open(index, 'rb') as f:
            response = json.load(f)
        return response

class Reserves(restful.Resource):
    def get(self):
        path = os.path.join(current_app.root_path, current_app.config['DATA_DIR'], 'reserves.yml')
        with open(path, 'rb') as f:
            response = yaml.load(f)
        return response


rest.add_resource(Estimate, '/estimate')
rest.add_resource(Minerals, '/minerals')
rest.add_resource(Reserves, '/reserves')
rest.add_resource(ApiIndex, '/')
rest.add_resource(HelloWorld, '/hello')
rest.add_resource(Items, '/items')
