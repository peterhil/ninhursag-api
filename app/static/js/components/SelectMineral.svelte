<script>
    import { isEmpty } from 'ramda'
    import { minerals } from '../stores/minerals'

    export let selectedMineral = 'Gold'
</script>

<label for="mineral">Select resource
    {#if $minerals.loading }
    <p>Loading...</p>
    {:else if !isEmpty($minerals.data)}
    <select id="mineral" bind:value={selectedMineral}>
        {#each [...Object.entries($minerals.data)] as [mineral, src] (mineral)}
        <option value="{mineral}" selected="{mineral === selectedMineral}">{mineral}</option>
        {/each}
    </select>
    {:else}
    <p class="text-error">Problem loading mineral data: { $minerals.error }</p>
    {/if}
</label>
