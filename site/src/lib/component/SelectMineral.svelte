<script lang="ts">
	import debounce from 'debounce'
	import { HeavyMetal } from '@icon-park/svg'

	import { pushState } from '$app/navigation'

	import IconPark from '$component/IconPark.svelte'

	const title = "Resource"

	let { minerals = [], selected = $bindable() } = $props();

	const onSelected = (event) => {
	    selected = event.target.value
	    console.info('Mineral:', selected)

		pushState('/mineral/' + selected, {
			mineral : selected,
		})
		document.title = `${selected} statistics | Ninhursag`

		return false
	}

	const onSelectedDebounced = debounce(onSelected, 500)
</script>

<label for="mineral">
	<div>
		<span class="hide-xxs">
			<IconPark icon={HeavyMetal} size={24} />
		</span>
		<span class="hide-sm">
			{title}
		</span>
	</div>
	<select
		id="mineral"
		class="button button-action"
		{title}
		onchange={onSelectedDebounced}
		>
		{#each [...Object.keys(minerals)] as mineral (mineral)}
			<option value="{mineral}" selected="{mineral === selected}">{mineral}</option>
		{/each}
	</select>
</label>
