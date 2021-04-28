<script>
    import { debounce } from 'lodash'
    import { functions } from '../stores/functions'

    export let selected

    const onSelected = (event) => {
        selected = event.target.value
        console.info('Function:', selected)
        return false
    }

    const onSelectedDebounced = debounce(onSelected, 500)
</script>

<label for="function">Select function
    {#await $functions }
    <p>Loading...</p>
    {:then $functions}
    <select id="function" on:change={onSelectedDebounced}>
        {#each $functions.pdf as fn}
        <option value="{fn}" selected="{fn === selected}">{fn}</option>
        {/each}
    </select>
    {:catch error}
    <p class="text-error">Problem loading functions: { error }</p>
    {/await}
</label>
