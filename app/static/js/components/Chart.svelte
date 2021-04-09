<script>
    import LoadingSpinner from './LoadingSpinner.svelte'

    export let scale

    let caption = 'U.S. Geological Survey statistics (Metric tons gross weight)'

    function onScaleToggle (event) {
        scale = event.target.checked ? 'log' : 'linear'
        return false
    }
</script>

<figure>
    {#if caption}
    <figcaption>
        {caption}
    </figcaption>
    {/if}
    <form name="logScaleForm">
        <label for="logScale">
            <input id="logScale"
                   type="checkbox"
                   checked="{scale === 'log'}"
                   on:change="{onScaleToggle}">
            Logarithmic y-axis scale
        </label>
    </form>
    <LoadingSpinner title="Loading chart..." />
</figure>
