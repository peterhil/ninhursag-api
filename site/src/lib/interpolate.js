import {
	compose,
	concat,
	fromPairs,
	groupWith,
	last,
	map,
	prop,
	range,
	toPairs,
	unnest,
} from 'ramda'
import { finite } from '$lib/data'

function eitherNaN (a, b) {
	return isNaN(parseFloat(a)) || isNaN(parseFloat(b))
}

function interpolate (dataPoints) {
	if (dataPoints.length < 2) {
		return dataPoints
	}
	const stops = dataPoints
	const y = prop(1)
	const x = (p) => parseInt(prop(0, p)) // TODO Use Maps?

	// Takes an array of two pairs and interpolate data linearly between them
	const linear = (piece) => {
		const from = piece[0]
		const to = piece[1]

		const dx = x(to) - x(from)
		const dy = y(to) - y(from)
		const step = dy / dx
		const indices = range(0, dx)

		// TODO use R.times with n argument?
		return map((index) => {
			return [
				(x(from) + index).toString(),
				y(from) + index * step,
			]
		}, indices)
	}
	const result = concat(linear(stops), [last(dataPoints)])

	return result
}

export function interpolateData (dataSeries) {
	const value = prop(1)
	const groups = groupWith(
		(a, b) => {
			return eitherNaN(value(a), value(b))
		},
		toPairs(dataSeries)
	)
	const dataPoints = map(compose(toPairs, finite, fromPairs), groups)
	const result = fromPairs(unnest(map(interpolate, dataPoints)))
	// console.debug('[Interpolate] interpolateData: result, groups, dataPoints', result, groups, dataPoints)

	return result
}
