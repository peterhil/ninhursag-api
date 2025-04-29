#!/usr/local/bin/python
# pylint: disable=invalid-name

import inspect
import numpy as np
import scipy
import scipy.stats as stats

from scipy.optimize import curve_fit
from app.log import logger


def exponential_est(x, a, b, c):
    return a * np.exp(b * x) + c


def gaussian(x, a, b, c):
    # FIXME
    return a * np.exp(-((b + x) ** c))


def lognormal_pdf(x, shape, scale, a, b):
    # FIXME
    loc = 0
    return a * scipy.stats.lognorm.pdf(x * -b, shape, loc, scale)


def lognormal(x, loc, scale):
    coeff = 1.0 / (np.abs(x) * scale * np.sqrt(2 * np.pi))
    return coeff * np.exp(-(np.power(2, (np.log(x) - loc)) / (2.0 * (scale ** 2.0))))


def hubbert_curve(x, a, b, c):
    ex = a * np.exp(1.0 * b * x) + c
    return ex / ((1.0 + ex) ** 2.0)


def linear(x, a, b):
    return a * x + b


def logarithmic(x, a, b, c, d):
    return np.log(a * np.exp(b * x) + c) + d


def logistic(x, a, b, c):
    return a * c / (a * np.exp(-b * x) + c)


def log_logistic(x, a, b, c):
    return a * c / (a * np.exp(-b * np.log(x)) + c)


def getsignature(func, name, verbose=False):
    try:
        signature = inspect.signature(func.__self__._parse_args)
    except AttributeError:
        signature = inspect.signature(func)

    if verbose:
        msg = """
Function: {name} ({arity})
Signature: {signature}
Args: {args}
"""
        logger.debug(msg.format(
            name=name,
            arity=len(signature.parameters),
            signature=signature,
            args=inspect.signature(func),
        ))

    return signature


def wrap_scipy(func, name):
    signature = getsignature(func, name)
    arity = len(signature.parameters)

    def adjust(result, ys):
        return result * ys

    if arity == 1:

        def wrapped(data, xs, ys):
            return adjust(func(data * xs), ys)

    elif arity == 2:

        def wrapped(data, a, xs, ys):
            return adjust(func(data * xs, a), ys)

    elif arity == 3:

        def wrapped(data, loc, scale, xs, ys):
            return adjust(func(data * xs, loc, scale), ys)

    elif arity == 4:

        def wrapped(data, loc, scale, a, xs, ys):
            return adjust(func(data * xs, a, loc, scale), ys)

    elif arity == 5:

        def wrapped(data, loc, scale, a, b, xs, ys):
            return adjust(func(data * xs, a, b, loc, scale), ys)

    elif arity == 6:

        def wrapped(data, loc, scale, a, b, c, xs, ys):
            return adjust(func(data * xs, a, b, c, loc, scale), ys)

    else:

        def wrapped(data, loc, scale, a, b, c, d, xs, ys):
            return adjust(func(data * xs, a, b, c, d, loc, scale), ys)

    wrapped.func = func
    wrapped.__doc__ = func.__doc__
    wrapped.__name__ = name

    return wrapped


def scipy_functions(self, kind="pdf"):
    if kind not in ["cdf", "pdf"]:
        return dict()

    statistical_functions = [
        (f, getattr(getattr(stats, f, None), kind, None)) for f in dir(stats)
    ]

    return {
            f[0]: wrap_scipy(f[1], f[0])
            for f in [x for x in statistical_functions if x[1] is not None]
    }


def sanitize(data, years):
    data = np.array(data, dtype=np.float64)
    data = np.ma.masked_invalid(data)  # Remove NaNs and Infs
    data = np.trim_zeros(data, "fb")  # Trim zeros from both ends
    years = np.array(years, dtype="int")[np.logical_not(data.mask)]
    data = data.compressed()

    return data, years


def estimate(func, data, years, until=0, log=False, norm=False):
    data, years = sanitize(data, years)

    if len(data) == 0 or len(years) == 0:
        raise ValueError("Empty data or years")

    (start, end) = (np.min(years), np.max(years) + until)
    x = years - start
    e_x = np.arange(end - start + 1)
    e_years = e_x + start

    orig_data = data
    scale = 1
    if log:
        data = np.log(data)
        logger.debug("Describe logarithic data: {stats}".format(
            stats=(stats.describe(data, nan_policy='omit')),
        ))
    if norm:
        scale = np.amax(data)
        data = data / scale
        logger.debug("Describe normalised data: {stats} (min: {min}, max: {max})".format(
            min=np.amin(data),
            max=np.amax(data),
            stats=(stats.describe(data / np.amax(data), nan_policy='omit')),
        ))
    else:
        logger.debug("Describe original data:   {stats}".format(
            stats=(stats.describe(data, nan_policy='omit')),
        ))

    popt, pcov, infodict, errmsg, ier = curve_fit(
        func, x, data, maxfev=10000, full_output=True, absolute_sigma=False
    )
    std_err = np.sqrt(np.diag(pcov))
    error = dict(
        std=list(std_err),
        min=np.amin(std_err),
        max=np.amax(std_err),
        mean=np.mean(std_err),
        median=np.median(std_err),
    )
    estd = func(e_x, *popt)

    if norm:
        estd = estd * scale
    if log:
        estd = np.exp(estd)

    msg = """
=============================================================================
function: {function}
nfev: {nfev}
error: {error}
error mean: {mean_error}
error median: {median_error}
error max: {max_error}
error min: {min_error}
errmsg: {errmsg}
ier: {ier}
popt: {popt}
pcov: {pcov}
data: {data}
estd: {estd}
=============================================================================
"""
    params = dict(
        function=func.__name__,
        error=error["std"],
        mean_error=error["mean"],
        median_error=error["median"],
        max_error=error["max"],
        min_error=error["min"],
        nfev=infodict["nfev"],
        errmsg=errmsg,
        ier=ier,
        popt=popt,
        pcov=pcov,
        data=orig_data[:50],
        estd=np.round(estd[:50], 0),
    )
    logger.debug(msg.format(**params))

    if ier not in [1, 2, 3, 4]:
        raise RuntimeError(errmsg)

    if not np.isfinite(error["mean"]):
        msg = "Function is not suitable for this series"
        raise RuntimeWarning(msg)

    # if error['mean'] > 100:
    #     msg = 'Mean error is over tolerance: {mean_error}'
    #     raise RuntimeWarning(msg.format(
    #         mean_error=np.round(error['mean'], 2),
    #     ))

    return (e_years, estd, pcov, error)
