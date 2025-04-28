<script>
    export let scale

    function onScaleToggle (event) {
        scale = event.target.checked ? 'log' : 'linear'
    }
</script>

<label>
    <input
        type="checkbox"
        checked={scale === 'log'}
        on:change|preventDefault={onScaleToggle}
        >
    Logarithmic y-axis scale
</label>
