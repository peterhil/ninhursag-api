<script>
    import { chart as dataStore } from '../stores/chart'
    import LoadingSpinner from './LoadingSpinner.svelte'

    // Use slot props to pass the loaded data into components inside the slot
    // https://svelte.dev/docs#slot_let
    export const data = {}
</script>

{#await $dataStore}
<LoadingSpinner title="Loading data..." />
{:then $dataStore}
<slot data={$dataStore}>
    <pre>
        {$dataStore.data}
    </pre>
</slot>
{:catch error}
<p class="text-error">
    Failed loading data: {error}
</p>
{/await}
