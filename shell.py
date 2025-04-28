#!/usr/bin/env python

from os import environ

from app import create_app

if __name__ == '__main__':
    environ['PYTHONINSPECT'] = 'True'
    application = create_app()
