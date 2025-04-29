<script lang="ts">
	import FunctionMath from 'carbon-icons-svelte/lib/FunctionMath.svelte'
	import debounce from 'debounce'

	import { controller } from '$store/estimate'

	const title = "Function"

	let { functions, selected = $bindable() } = $props();

	const onSelected = (event) => {
	    selected = event.target.value
	    console.info('Function:', selected)

	    if (controller) {
	        controller.abort() // Cancel previous request
	    }

	    return false
	}

	const onSelectedDebounced = debounce(onSelected, 500)
</script>

<label for="function">
	<div>
		{title}
		<FunctionMath size={32} />
	</div>
	<select
		id="function"
		class="button button-action"
		aria-label={title}
		onchange={onSelectedDebounced}>
		{#each functions.pdf as fn (fn)}
			<option value="{fn}" selected="{fn === selected}">{fn}</option>
		{/each}
	</select>
</label>
