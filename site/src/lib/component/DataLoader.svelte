<script lang="ts">
	import LoadingSpinner from '$component/LoadingSpinner.svelte'

	// Use slot props to pass the loaded data into components inside the slot
	
	interface Props {
		// https://svelte.dev/docs#slot_let
		data: any;
		children?: import('svelte').Snippet<[any]>;
	}

	let { data, children }: Props = $props();
</script>

{#await $data}
<LoadingSpinner title="Loading data..." />
{:then $data}
{#if children}{@render children({ data: $data, })}{:else}
	<pre>
		{JSON.stringify($data, null, 4)}
	</pre>
{/if}
{:catch error}
<p class="text-error">
	Failed loading data: {error}
</p>
{/await}
