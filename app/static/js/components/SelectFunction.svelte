<script>
    import { functions } from '../stores/functions'

    export let selected
</script>

<label for="function">Select resource
    {#await $functions }
    <p>Loading...</p>
    {:then $functions}
    <select id="function" bind:value={selected}>
        {#each $functions.pdf as fn}
        <option value="{fn}" selected="{fn === selected}">{fn}</option>
        {/each}
    </select>
    {:catch error}
    <p class="text-error">Problem loading functions: { error }</p>
    {/await}
</label>
