<script>
    import { data } from '../stores/data'
    import LoadingSpinner from './LoadingSpinner.svelte'
</script>

{#await $data}
<LoadingSpinner title="Loading data..." />
{:then $data}
<pre>
    {$data.data}
</pre>
{$data.header}
{$data.footer}
{:catch error}
<p class="text-error">
    Failed loading data: {error}
</p>
{/await}
