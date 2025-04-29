import soundexPhonetics from 'soundex-code'
import tinycolor from 'tinycolor2'
import {
	filter,
	head,
	identity,
	map,
	reduce,
	tail,
	test,
	toPairs,
} from 'ramda'

export function fuzzyColor (str) {
	const words = str.split(' ')

	if (words.length > 1) {
		const colors = map(fuzzyColor, filter(identity, words))
		return reduce(tinycolor.mix, head(colors), tail(colors))
	}

	const sndx = soundexPhonetics(str || ' ')
	const hue = (((sndx[0].charCodeAt())) % 26) * (360 / 26) // modulo is for unicode chars
	const sat = parseInt(sndx.slice(1, 3), 7) * (50 / 48) + 25 // 0...48 => 50...100

	let lig = parseInt(sndx.slice(3, 4), 7) * (50 / 6) + 50 // 0..6 => 50...100 (minus word length)

	lig -= Math.min(50, str.length)

	return tinycolor({ h: hue, s: sat, l: lig })
}

function svgInlineStyle (styleRules) {
	const toText = (decl) => decl.join(': ') + ';'
	const style = map(toText, toPairs(styleRules)).join(' ')

	return style
}

export function seriesStyle (serie) {
	let style = {}

	if (test(/interpolated/i, serie)) {
		style = {
			stroke: fuzzyColor(serie.replace(/ \(\w+\)$/, '')).toHexString(),
			'stroke-dasharray': '2px, 6px',
		}
	}
	else {
		style = {
			stroke: fuzzyColor(serie).toHexString(),
		}
		if (test(/estimated/, serie)) {
			style['stroke-dasharray'] = '6px, 2px'
		}
	}

	return svgInlineStyle(style)
}

export function fixNaNs (path) {
	const nanValues = path.split(/[A-Z](?:\d+|\d+\.\d+),NaN/)

	return map(
		i => i.replace(/^[A-Z]/, 'M'),
		filter(identity, nanValues)
	).join('')
}
