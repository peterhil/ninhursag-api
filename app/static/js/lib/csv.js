import { parse } from 'papaparse'
import {
    compose, filter, find, flatten, identity,
    join, map, match, not, drop, takeWhile
} from 'ramda'

const clean = compose(filter(identity), flatten)

const dataRegexp = match(RegExp("^(\\d{4}|Year)$"))

function isData (row) {
    return !!find(dataRegexp, row)
}

function getRows (csv) {
    const parsed = parse(csv, {
        dynamicTyping: false,
        header: false,
    })

    return parsed.data
}

function splitHeaders (rows) {
    const header = takeWhile(not(isData), rows)
    const content = takeWhile(isData, drop(header.length, rows))
    const footer = drop(header.length + content.length, rows)

    return {
        content,
        header: clean(header),
        footer: clean(footer),
    }
}

export function cleanup (rawData) {
    let {header, content, footer} = splitHeaders(getRows(rawData))
    const text = join('\n', map(join('\t'), content))

    // Reparse data rows with dynamic typing
    const reparsed = parse(text, {
        header: true,
        dynamicTyping: true,
    })

    if (reparsed.errors.length > 0) {
        console.error("Errors while parsing raw data:", reparsed.errors)
    }

    return Object.assign(reparsed, {header, footer})
}
