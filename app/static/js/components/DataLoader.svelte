<script>
    import LoadingSpinner from './LoadingSpinner.svelte'

    // Use slot props to pass the loaded data into components inside the slot
    // https://svelte.dev/docs#slot_let
    export let data
</script>

{#await $data}
<LoadingSpinner title="Loading data..." />
{:then $data}
<slot data={$data}>
    <pre>
        {JSON.stringify($data, null, 4)}
    </pre>
</slot>
{:catch error}
<p class="text-error">
    Failed loading data: {error}
</p>
{/await}
