import {
	head,
	last,
	max,
	mapObjIndexed,
	sortBy,
	toPairs,
} from 'ramda'

export function calculateReserves (cumulative, reserveData, mineral, column) {
	const reserves = getReserves(reserveData, mineral)

	if (!reserves) {
		// console.debug('No reserves!')
		return {}
	}
	const [reserveYear, reserveAmount] = last(sortBy(head, toPairs(reserves)))
	const cumulativeSeries = cumulative.columns[column]
	const cumulativeOnReserveYear = cumulativeSeries[reserveYear]

	return mapObjIndexed(
		(value) => {
			return max(1, reserveAmount - (value - cumulativeOnReserveYear))
		},
		cumulativeSeries
	)
}

export function getReserves (reserves, mineral) {
	return reserves.data && reserves.data[mineral]
}
