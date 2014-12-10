#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from flask import current_app, Blueprint, render_template

from app.helpers import route


bp = Blueprint('pages', __name__, url_prefix='/pages')


@bp.route('/')
def index():
    # Articles are pages with a publication date
    articles = (p for p in current_app.pages if 'published' in p.meta)
    # Show the 10 most recent arexticles, most recent first.
    latest = sorted(articles, reverse=True,
                    key=lambda p: p.meta['published'])
    return render_template('pages/articles.html', articles=latest[:10])


@bp.route('/<path:path>/')
def page(path):
    page = current_app.pages.get_or_404(path)
    template = page.meta.get('template', 'pages/flatpage.html')
    return render_template(template, page=page)
