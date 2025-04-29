import {
	filter,
	fromPairs,
	is,
	map,
	toPairs,
	transpose,
	zipObj,
} from 'ramda'
import { toChartData } from '$lib/data'

// Transform chart data format into object with arrays for years and data
export function dataForEstimate (series) {
	const numbers = filter(is(Number), series) // TODO Maybe use isFinite?
	const [years, data] = transpose(toPairs(numbers))

	// TODO Change API to accept series data with years as indices
	return {
		years: map(parseInt, years),
		data: map(parseFloat, data),
	}
}

// Transform API estimate data to chart data format
export function chartDataFromEstimate (estimate, selected, fn) {
	const series = `${selected} (estimated with ${fn} function)`
	const zipped = zipObj(estimate.years, estimate.data)

	return {
		columns: fromPairs([[series, zipped]]),
		data: toChartData(series, zipped),
		covariance: estimate.covariance,
		stderr: estimate.stderr,
		estimate: series,
	}
}

export function reportFitQuality (estimate, fn) {
	const stdErr = estimate.stderr
	const medianOverMean = stdErr.median / stdErr.mean

	console.dir(
		`[Estimate] Std error ${fn}:`,
		{
			...stdErr,
			...{ medianOverMean },
		}
	)

	if (stdErr.min < 0.001 && medianOverMean < 0.32) {
		console.info(
			`%c[Std err] Excellent fit for ${fn}!`,
			'background-color: #3c5; color: #153'
		)
	}
	else if (stdErr.min < 0.05 && medianOverMean < 1) {
		console.warn(`[Std err] Ok fit for ${fn}!`)
	}
	else {
		console.warn(`[Std err] Bad fit for ${fn}!`)
	}

	return stdErr
}
