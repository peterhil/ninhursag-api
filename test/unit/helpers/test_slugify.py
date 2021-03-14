#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pytest

from app.helpers import slugify


class TestSlugify(object):
    def test_slugify(self):
        assert slugify('My slug') == 'my-slug'

    def test_slugify_with_different_separator(self):
        assert slugify('My slug','_') == 'my_slug'
