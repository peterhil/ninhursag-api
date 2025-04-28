<script>
    import { debounce } from 'debounce'
    import { minerals } from '../stores/minerals'

    export let selected

    const onSelected = (event) => {
        selected = event.target.value
        console.info('Mineral:', selected)
        return false
    }

    const onSelectedDebounced = debounce(onSelected, 500)
</script>

<label for="mineral">Select resource
    {#await $minerals }
    <p>Loading...</p>
    {:then $minerals}
    <select id="mineral" on:change={onSelectedDebounced}>
        {#each [...Object.keys($minerals)] as mineral (mineral)}
        <option value={mineral} selected={mineral === selected}>{mineral}</option>
        {/each}
    </select>
    {:catch error}
    <p class="text-error">Problem loading mineral data: {error}</p>
    {/await}
</label>
