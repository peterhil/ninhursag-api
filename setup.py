#!/usr/bin/env python
# encoding: utf-8
#
# Copyright (c) 2014, Peter Hillerström <peter.hillerstrom@gmail.com>
# All rights reserved. This software is licensed under the MIT license.
#
# For the full copyright and license information, please view the LICENSE
# file that was distributed with this source code.


from pip.req import parse_requirements
from setuptools import setup, Command

PACKAGE_NAME = 'skeleton'
PACKAGE_VERSION = '0.1.0'
PACKAGES = ['app']
INSTALL_REQS = [str(ir.req) for ir in parse_requirements('requirements/stable.pip')]
TEST_REQS = [str(ir.req) for ir in parse_requirements('requirements/dev.pip')]

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
    description="""Skeleton is a Python Flask template.""",
    long_description=README_TEXT,
    author='Peter Hillerström',
    author_email='peter.hillerstrom@gmail.com',
    license='MIT License',
    url='https://github.com/peterhil/skeleton',
    requires=[
    ],
    install_requires=INSTALL_REQS,
    tests_require=TEST_REQS,
    extras_require={'test': TEST_REQS},
    entry_points={'app': '.test = test'},
    scripts=[],
    classifiers = [
            'Intended Audience :: Developers',
            'Intended Audience :: Information Technology',
            'License :: OSI Approved :: MIT License',
            'Operating System :: OS Independent',
            'Programming Language :: Python',
            'Programming Language :: Python :: 2',
            'Topic :: Software Development',
    ],
    cmdclass = {
        'test': PyTest
    },
)
