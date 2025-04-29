<script lang="ts">
	import { seriesStyle } from '$lib/charting'

	let { series } = $props();
</script>

<g class="legend" transform="translate(160, 30)">
	{#each series as serie, index (index)}
		<g>
			<line class="line series-{index}"
				  x1="0" x2="30"
				  y1="{index * 1.5 - 0.35}em"
				  y2="{index * 1.5 - 0.35}em"
				  style="{seriesStyle(serie)}"
				  >
			</line>
			<text dx="40" dy="{index * 1.5}em">
				{serie}
			</text>
		</g>
	{/each}
</g>
