<script>
    import { functions } from '../stores/functions'

    export let selectedFunction = 'powerlognorm'
</script>

<label for="function">Select resource
    {#await $functions }
    <p>Loading...</p>
    {:then $functions}
    <select id="function" bind:value={selectedFunction}>
        {#each $functions as fn}
        <option value="{fn}" selected="{fn === selectedFunction}">{fn}</option>
        {/each}
    </select>
    {:catch error}
    <p class="text-error">Problem loading functions: { error }</p>
    {/await}
</label>
