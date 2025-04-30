<script lang="ts">
	import CheckboxShowAll from '$component/CheckboxShowAll.svelte'
	import DataLoader from '$component/DataLoader.svelte'
	import Images from '$component/Images.svelte'
	import LogScaleCheckbox from '$component/LogScaleCheckbox.svelte'
	import Navbar from '$component/Navbar.svelte'
	import SelectFunction from '$component/SelectFunction.svelte'
	import SelectMineral from '$component/SelectMineral.svelte'
	import SvgChart from '$component/SvgChart.svelte'

	import { chart } from '$store/chart'
	import { fn } from '$store/function'
	import { scale } from '$store/scale'
	import { showAll } from '$store/showAll'
	import { mineral } from '$store/mineral'

	const caption = 'U.S. Geological Survey Data Series 140'
	const sourceUrl = 'https://www.usgs.gov/centers/national-minerals-information-center/historical-statistics-mineral-and-material-commodities#abrasives'

	let { data } = $props();
</script>

{#snippet controls()}
<div class="selections">
	<SelectMineral minerals={data.minerals} bind:selected={$mineral} />
	<SelectFunction functions={data.functions} bind:selected={$fn} />
</div>
<div class="scale">
	<span class="hide-sm">Scale</span>
	<LogScaleCheckbox bind:scale={$scale} />
	{#if $scale === 'linear'}
		<CheckboxShowAll bind:showAll={$showAll} />
	{/if}
</div>
{/snippet}

<Navbar {controls} />

<div class="content">
	<h2 class="hide-xs">{$mineral}</h2>

	<div class="flex">
		<div>
			<figure>
				<DataLoader data={chart}>
					{#snippet children({ data })}
					<SvgChart {data}></SvgChart>
					{/snippet}
				</DataLoader>
			</figure>
			<figcaption>
				Metric tons gross weight.
				<small>Source:</small>
				<a href={sourceUrl} target="_blank" rel="noreferrer">
					{caption}
				</a>
				<small>Historical Statistics for Mineral and Material Commodities</small>
			</figcaption>
		</div>

		<aside>
			<Images mineral={$mineral} />
		</aside>
	</div>
</div>
