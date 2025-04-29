<script lang="ts">
	import debounce from 'debounce'
	import { HeavyMetal } from '@icon-park/svg'

	import IconPark from '$component/IconPark.svelte'

	const title = "Resource"

	let { minerals = [], selected = $bindable() } = $props();

	const onSelected = (event) => {
	    selected = event.target.value
	    console.info('Mineral:', selected)
	    return false
	}

	const onSelectedDebounced = debounce(onSelected, 500)
</script>

<label for="mineral">
	<div>
		{title}
		<IconPark icon={HeavyMetal} size={32} />
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
