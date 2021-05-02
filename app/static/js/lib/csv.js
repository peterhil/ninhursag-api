import { parse } from 'papaparse'
import {
    allPass, compose, filter, find, findLast, flatten, forEach,
    fromPairs, identity, join, map, complement, drop,
    takeWhile, times, sortBy, test, without, zip,
} from 'ramda'

const clean = compose(filter(identity), flatten)

const dataRegexp = test(RegExp("^(\\d{4}|Year)$"))

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
    const header = takeWhile(complement(isData), rows)
    const content = takeWhile(isData, drop(header.length, rows))
    const footer = drop(header.length + content.length, rows)

    return {
        content,
        header: clean(header),
        footer: clean(footer),
    }
}

function transposeObj(rows, columns) {
    let data = fromPairs(zip(columns, times(() => {return {}}, columns.length)))

    forEach((row) => {
        forEach((series) => {
            data[series][parseInt(row['Year'])] = row[series]
        }, columns)
    }, rows)

    return data
}

export function cleanup (rawData) {
    let {header, content, footer} = splitHeaders(getRows(rawData))
    const text = join('\n', map(join('\t'), content))

    // Reparse data rows with dynamic typing
    const reparsed = parse(text, {
        header: true,
        dynamicTyping: true,
    })
    const excludedSeries = [
        'Year',
        'Imports',
        'Exports',
        'Stocks',
        'Unit value ($/t)',
        'Unit value (98$/t)',
    ]  // TODO Move filtering elsewhere
    const series = without(excludedSeries, reparsed.meta.fields)

    if (reparsed.errors.length > 0) {
        console.error("Errors while parsing raw data:", reparsed.errors)
    }

    const columns = transposeObj(reparsed.data, series)

    return Object.assign(reparsed, {header, footer, series, columns})
}

export function productionSeries (series) {
    const production = test(/^(World production|World mine production)$/)
    const estimated = test(/estimated/)
    return findLast(
        allPass([production, complement(estimated)]),
        sortBy(identity, series)
    )
}
