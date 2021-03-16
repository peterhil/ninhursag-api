#!/usr/bin/env python
# -*- coding: utf-8 mode: python -*-

import urllib.request

from bs4 import BeautifulSoup

url = 'https://www.usgs.gov/centers/nmic/historical-statistics-mineral-and-material-commodities-united-states'

with urllib.request.urlopen(url) as response:
    page = response.read()

soup = BeautifulSoup(page, 'html.parser')
trs = soup.select('tr')

for tr in trs:
    mineral = tr.select('td a[id]')
    link = tr.select('td a[href*=".xlsx"]')
    if mineral and link:
        # print("\t".join([mineral[0].contents[0], link[0]['href']]))
        print(link[0]['href'])
