#!/usr/bin/env python

import os
import sys
import xlrd
import json


if __name__ == '__main__':
    path = sys.argv[1]
    ext = sys.argv[2] if len(sys.argv) == 3 else None

    f = []
    for (dirpath, dirnames, filenames) in os.walk(path):
        f.extend([n for n in filenames if n[:5] == 'ds140' and os.path.splitext(n)[1][1:] in ['xls', 'xlsx']])
        break

    minerals = {}
    for excel_file in f:
        # print "{}:".format(excel_file)
        xls = xlrd.open_workbook(os.path.join(path, excel_file))
        multisheet = len(xls.sheets()) > 1
        for sheet in xls.sheets():
            suffix = f'-{sheet.name}' if multisheet else ''
            if ext is not None:
                filename = os.path.splitext(excel_file)[0] + suffix + '.' + ext
            else:
                filename = excel_file
            minerals[sheet.name] = filename
            # print "{excel}: {sheet}".format(excel=excel_file, sheet=sheet.name)

    print(json.dumps(minerals, indent=4, sort_keys=True))
