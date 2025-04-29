<script lang="ts">
	import { extent } from 'd3-array'
	import { line as svgLine } from 'd3-shape'
	import { scaleLinear, scaleLog } from 'd3-scale'
	import {
	    chain,
	    keys,
	    max,
	    omit,
	    reduce,
	    values
	} from 'ramda'

	import GridLabels from '$component/GridLabels.svelte'
	import GridLines from '$component/GridLines.svelte'
	// import HoverTool from '$component/HoverTool.svelte'
	import Legend from '$component/Legend.svelte'
	import LineSeries from '$component/LineSeries.svelte'
	import { scale } from '$store/scale'
	import { showAll } from '$store/showAll'
	import { fixNaNs } from '$lib/charting'


	
	interface Props {
		data: any;
		// SVG attributes
		width?: number;
		height?: number;
		preserveAspectRatio?: string;
		viewBox?: any;
	}

	let {
		data,
		width = 960,
		height = 660,
		preserveAspectRatio = 'xMidYMin meet',
		viewBox = `0 -20 ${width} ${height + 40}`
	}: Props = $props();

	let yMin = ($derived($scale === 'log' ? 1 : 0))
	let yMaxExclude = (
	    $derived($scale === 'log' || $showAll === 'yes'
	        ? ['Year', 'Reserves fit']
	        : [
	            'Year',
	            'Reserves',
	            'Cumulative',
	            'Cumulative fit',
	            'Reserves fit',
	        ]))
	let selectedSeries = $derived(omit(yMaxExclude, data.columns))
	let yMax = $derived(reduce(max, yMin, chain(values, values(selectedSeries))))
	let x = $derived(scaleLinear()
	    .range([0, width])
	    .domain(extent(chain(keys, values(selectedSeries)))))

	let y = $derived(($scale === 'log' ? scaleLog() : scaleLinear())
	    .range([height, 0])
	    .domain([yMin, yMax]))

	let line = $derived((data) => {
	    const path = svgLine()
	        .x(d => x(parseInt(d[0])))
	        .y(d => y(parseFloat(d[1])))
	    return fixNaNs(path(data))
	})
</script>

<svg {width} {height} {preserveAspectRatio} {viewBox}>
	<GridLines {width} {height} {x} {y} />
	<LineSeries {data} {line} />
	<GridLabels {height} {x} {y} />
	<Legend series={keys(data.columns)} />
	<!-- <HoverTool {width} {height} {x} {y} /> -->
</svg>
