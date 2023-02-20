#!/usr/bin/env python3
# encoding: utf-8
#
# Copyright (c) 2014, Peter Hillerström <peter.hillerstrom@gmail.com>
# All rights reserved. This software is licensed under the MIT license.
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.

import os
import re
import pprint

from pathlib import Path
from setuptools import setup, Command


# Solution to parse requirements by users Scrotch, Karsus and
# sh0rtcircuit: https://stackoverflow.com/a/57191701/470560
try:  # pip >=20
    from pip._internal.network.session import PipSession
    from pip._internal.req import parse_requirements
except ImportError:
    try:  # 10 <= pip <= 19.3.1
        from pip._internal.req import parse_requirements
        from pip._internal.download import PipSession
    except ImportError:  # pip <= 9.0.3
        from pip.req import parse_requirements
        from pip.download import PipSession


def clean(require):
    """
    Replace git requirements with just the requirement name
    """
    cleaned = re.sub(r'^git\+[^#]+#egg=', '', require)

    return str(cleaned)


def requires(filename):
    path = Path(os.path.join(os.path.dirname(__file__), filename))
    requires = [
        clean(req.requirement)
        for req
        in parse_requirements(str(path), session=PipSession())
    ]

    return requires


PACKAGE_NAME = 'ninhursag'
PACKAGE_VERSION = '0.10.0'
PACKAGES = ['app']
INSTALL_REQS = requires('requirements/stable.txt')
TEST_REQS = requires('requirements/dev.txt')


with open('README.md', 'r') as readme:
    README_TEXT = readme.read()


class PyTest(Command):
    user_options = []
    def initialize_options(self):
        pass
    def finalize_options(self):
        pass
    def run(self):
        import sys
        import subprocess
        opts = []
        if '-v' in sys.argv:
            opts.append('-v')
        errno = subprocess.call([sys.executable, '-m', 'py.test', 'test'] + opts)
        raise SystemExit(errno)


setup(
    name=PACKAGE_NAME,
    version=PACKAGE_VERSION,
    packages=PACKAGES,
    description="Ninhursag is visualisation of mineral reserves",
    long_description=README_TEXT,
    author='Peter Hillerström',
    author_email='peter.hillerstrom@gmail.com',
    license='MIT License',
    url='https://github.com/peterhil/ninhursag',
    requires=[],
    install_requires=INSTALL_REQS,
    tests_require=TEST_REQS,
    entry_points={'app': '.test = test'},
    scripts=[],
    classifiers = [
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Education',
        'Intended Audience :: End Users/Desktop',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Operating System :: MacOS :: MacOS X',
        'Operating System :: POSIX',
        'Operating System :: POSIX :: Linux',
        'Programming Language :: JavaScript',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Topic :: Education',
        'Topic :: Scientific/Engineering :: Atmospheric Science',
        'Topic :: Scientific/Engineering :: Information Analysis',
        'Topic :: Scientific/Engineering :: Mathematics',
        'Topic :: Scientific/Engineering :: Visualization',
    ],
    cmdclass = {
        'test': PyTest
    },
)
