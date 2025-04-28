#!/usr/bin/env python

import pytest

from app.helpers.slugify import slugify


class TestSlugify:
    def test_slugify(self):
        assert slugify('My slug') == 'my-slug'

    def test_slugify_with_different_separator(self):
        assert slugify('My slug','_') == 'my_slug'
