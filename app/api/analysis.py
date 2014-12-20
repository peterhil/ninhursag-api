#!/usr/local/bin/python
# -*- coding: utf-8 -*-

import logging
import numpy as np
import scipy
import scipy.stats as stats

from scipy.optimize import curve_fit


logger = logging.getLogger("Ninhursag")

def normalize(signal):
    max = np.max(np.abs(signal))
    if not np.all(np.isfinite(signal)): #np.isnan(max) or np.isinf(max):
        logger.debug("Normalize() substituting non-numeric max: %s" % max)
        signal = np.ma.masked_invalid(signal).filled(0)
        max = np.max(np.abs(signal))
        logger.debug("Normalize() substituted max: %s" % max)
    if max == 0:
        logger.debug("Normalize() got silence!" % max)
        return signal
    #logger.debug("Normalize() by a factor: %s" % max)
    return signal / max

def exponential_est(x, a, b, c):
    return a*np.exp(b*x) + c

def gaussian(x, a, b, c):
    # FIXME
    return a * np.exp(-((b + x)**c))

def lognormal_pdf(x, shape, scale, a, b):
    # FIXME
    loc = 0
    return a * scipy.stats.lognorm.pdf(x * -b, shape, loc, scale)

def lognormal(x, loc, scale):
    coeff = 1.0 / (np.abs(x) * scale * np.sqrt(2 * np.pi))
    return coeff * np.exp(-(np.power(2, (np.log(x) - loc)) / (2.0*(scale**2.0))))

def hubbert_curve(x, a, b, c):
    ex = a * np.exp(1.0 * b * x) + c
    return ex / ((1.0 + ex)**2.0)

def linear(x, a, b):
    return a * x + b

def logarithmic(x, a, b, c, d):
    return np.log(a * np.exp(b * x) + c) + d

def logistic(x, a, b, c):
    return a*c/(a*np.exp(-b*x) + c)

def log_logistic(x, a, b, c):
    return a*c/(a*np.exp(-b*np.log(x)) + c)

def wrap_scipy(func):
    def wrapped(data, a, b, c, d):
        return func(data, a, b) * c + d
    return wrapped

def scipy_functions(self, kind='pdf'):
    if kind not in ['cdf', 'pdf']:
        return dict()
    return dict(
        map(lambda f: (f[0], wrap_scipy(f[1])),
            filter(lambda x: x[1] is not None,
                   [(f, getattr(getattr(stats, f, None), kind, None)) for f in dir(stats)]
                   )))

def sanitize(data, years):
    data = np.array(data, dtype=np.float64)
    data = np.ma.masked_invalid(data)  # Remove NaNs and Infs
    data = np.trim_zeros(data, 'fb')  # Trim zeros from both ends
    years = np.array(years, dtype="int")[np.logical_not(data.mask)]
    data = data.compressed()
    return data, years

def estimate(func, data, years, until, name="Data", log=False):
    data, years = sanitize(data, years)

    (start, end) = (np.min(years), np.max(years))
    x = years - start
    e_x = np.arange(until - start + 1)
    e_years = e_x + start

    if log: data = np.log(data)
    popt, pcov = curve_fit(func, x, data)
    # print("popt: %r\npcov: %r" % (popt, pcov))

    estd = func(e_x, *popt)
    if log: estd = np.exp(estd)

    # deriv = normalize(np.ediff1d(estd))*np.max(estd)/2

    return (e_years, estd)
