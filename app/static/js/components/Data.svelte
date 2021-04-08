<script>
    import { data } from '../stores/data'
</script>

{#await $data}
<div class="loading">
    Loading data...
</div>
{:then $data}
<pre>
    {$data}
</pre>
{:catch error}
<p class="text-error">
    Failed loading data: {error}
</p>
{/await}
