import { parse } from 'papaparse'
import {
    compose,
    filter,
    find,
    flatten,
    forEach,
    fromPairs,
    identity,
    join,
    map,
    complement,
    drop,
    takeWhile,
    times,
    test,
    without,
    zip,
} from 'ramda'

const clean = compose(filter(identity), flatten)

const dataRegexp = test(/^(\d{4}|Year)/)

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

function transposeObj (rows, columns) {
    const data = fromPairs(zip(columns, times(() => { return {} }, columns.length)))

    forEach((row) => {
        forEach((column) => {
            data[column][parseInt(row.Year)] = row[column]
        }, columns)
    }, rows)

    return data
}

export function cleanup (rawData) {
    const { header, content, footer } = splitHeaders(getRows(rawData))
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
    ] // TODO Move filtering elsewhere
    const series = without(excludedSeries, reparsed.meta.fields)

    if (reparsed.errors.length > 0) {
        console.error('Errors while parsing raw data:', reparsed.errors)
    }

    const columns = transposeObj(reparsed.data, series)

    return Object.assign(reparsed, { header, footer, series, columns })
}
