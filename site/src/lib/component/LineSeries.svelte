<script lang="ts">
	import { toPairs } from 'ramda'
	import { seriesStyle } from '$lib/charting'

	let { data, line } = $props();
</script>

<g class="chart">
	{#each toPairs(data.columns) as [serie, column], index (serie)}
		<path class="line series-{index}"
			  d="{line(toPairs(column), serie)}"
			  style="{seriesStyle(serie)}">
			{serie}
		</path>
	{/each}
</g>
