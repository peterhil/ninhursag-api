import {
    compose,
    concat,
    dropWhile,
    filter,
    flatten,
    fromPairs,
    groupWith,
    identity,
    indexBy,
    init,
    last,
    map,
    pick,
    prop,
    range,
    tail,
    takeWhile,
    values,
    zip,
} from 'ramda'

function eitherNaN (a, b) {
    return isNaN(parseFloat(a)) || isNaN(parseFloat(b))
}

function interpolate (dataPoints, column, row) {
    const stops = zip(init(dataPoints), tail(dataPoints))
    const y = prop(column)
    const x = prop(row)

    const linear = (piece) => {
        const from = piece[0]
        const to = piece[1]

        const dx = x(to) - x(from)
        const dy = y(to) - y(from)
        const step = dy / dx
        const indices = range(0, dx)

        return map((index) => {
            return fromPairs([
                [row, x(from) + index],
                [column, y(from) + index * step],
            ])
        }, indices)
    }
    const result = map(linear, stops)

    return flatten(concat(result, [last(dataPoints)]))
}

export function interpolateData (data, column) {
    const production = map(pick(['Year', column]), values(data.data))
    const col = prop(column)

    const groups = groupWith(
        (a, b) => eitherNaN(col(a), col(b)),
        filter(identity, production)
    )

    const noData = (row) => isNaN(parseFloat(col(row)))
    const result = map((group) => {
        if (group.length > 1) {
            const nans = takeWhile(noData, group)
            const rows = dropWhile(noData, group)
            const dataPoints = filter(compose(isFinite, col), rows)
            const linear = interpolate(dataPoints, column, 'Year')
            return flatten([nans, linear])
        } else {
            return group
        }
    }, groups)

    return indexBy(prop('Year'), flatten(result))
}
