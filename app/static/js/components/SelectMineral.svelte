<script>
    import { isEmpty } from 'ramda'
    import { minerals } from '../stores/minerals'

    export let selectedMineral = 'Gold'
</script>

<label for="mineral">Select resource
    {#await $minerals }
    <p>Loading...</p>
    {:then $minerals}
    <select id="mineral" bind:value={selectedMineral}>
        {#each [...Object.entries($minerals)] as [mineral, src] (mineral)}
        <option value="{mineral}" selected="{mineral === selectedMineral}">{mineral}</option>
        {/each}
    </select>
    {:catch error}
    <p class="text-error">Problem loading mineral data: { $minerals.error }</p>
    {/await}
</label>
