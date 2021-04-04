<script>
    import { minerals } from '../stores/minerals'

    export let selectedMineral = 'Gold'
</script>

<label for="mineral">Select resource
    {#await $minerals }
    <p>Loading...</p>
    {:then $minerals}
    <select id="mineral" bind:value={selectedMineral}>
        {#each [...Object.keys($minerals)] as mineral}
        <option value="{mineral}" selected="{mineral === selectedMineral}">{mineral}</option>
        {/each}
    </select>
    {:catch error}
    <p class="text-error">Problem loading mineral data: { error }</p>
    {/await}
</label>
