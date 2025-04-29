<script lang="ts">
	import DataLoader from '$component/DataLoader.svelte'
	import References from '$component/References.svelte'
	import SvgChart from '$component/SvgChart.svelte'
	import Images from '$component/Images.svelte'
	import CheckboxShowAll from '$component/CheckboxShowAll.svelte'
	import LogScaleCheckbox from '$component/LogScaleCheckbox.svelte'
	import SelectFunction from '$component/SelectFunction.svelte'
	import SelectMineral from '$component/SelectMineral.svelte'
	import { chart } from '$store/chart'
	import { fn } from '$store/function'
	import { scale } from '$store/scale'
	import { showAll } from '$store/showAll'
	import { mineral } from '$store/mineral'

	const caption = 'U.S. Geological Survey statistics (Metric tons gross weight)'

	let { data } = $props();
</script>

<div class="selections">
	<SelectMineral minerals={data.minerals} bind:selected="{$mineral}" />
	<SelectFunction functions={data.functions} bind:selected="{$fn}" />
</div>
<div class="scale">
	<span class="hide-sm">Scale</span>
	<LogScaleCheckbox bind:scale="{$scale}" />
	{#if $scale === 'linear'}
		<CheckboxShowAll bind:showAll="{$showAll}" />
	{/if}
</div>

<div class="row">
	<div class="small-12 large-9 columns">
		<h2 class="hide-xs">{$mineral}</h2>

		<figure>
			<figcaption>{caption}</figcaption>
			<DataLoader  data={chart}>
				{#snippet children({ data })}
								<SvgChart {data}></SvgChart>
											{/snippet}
						</DataLoader>
		</figure>
	</div>

	<aside class="small-12 large-3 columns">
		<Images mineral={$mineral} />
		<References />
	</aside>
</div>
