<script>
    import { messages } from '../lib/messaging'
    import { minerals } from '../stores/minerals'

    export let selected

    function onSelection (event) {
        messages.emit('select:mineral', event.target.value)
        return false
    }
</script>

<label for="mineral">Select resource
    {#await $minerals }
    <p>Loading...</p>
    {:then $minerals}
    <select id="mineral" bind:value={selected} on:change={onSelection}>
        {#each [...Object.keys($minerals)] as mineral}
        <option value="{mineral}" selected="{mineral === selected}">{mineral}</option>
        {/each}
    </select>
    {:catch error}
    <p class="text-error">Problem loading mineral data: { error }</p>
    {/await}
</label>
