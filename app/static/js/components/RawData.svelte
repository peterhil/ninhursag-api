<script>
    import { data } from '../stores/data'
</script>

{#await $data}
<div class="loading">
    Loading data...
</div>
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
