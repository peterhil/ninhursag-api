#!/usr/bin/env python
#

import re
from unidecode import unidecode


def slugify(text, delim='-'):
    """Slugifier that handles Asian UTF-8 characters and generates an ASCII-only slug.

    From: http://flask.pocoo.org/snippets/5/
    This snippet by Armin Ronacher can be used freely for anything you like. Consider it public domain.

    If you expect a lot of Asian characters or want to support them as well you can use the Unidecode package that handles them as well:
    https://pypi.python.org/pypi/Unidecode/
    """
    _punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')
    result = []
    for word in _punct_re.split(text.lower()):
        result.extend(unidecode(word).split())
    return delim.join(result)
