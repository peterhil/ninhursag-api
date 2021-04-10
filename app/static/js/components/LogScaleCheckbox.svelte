<script>
    export let scale

    function onScaleToggle (event) {
        scale = event.target.checked ? 'log' : 'linear'
        return false
    }
</script>

<label>
    <input type="checkbox"
           checked="{scale === 'log'}"
           on:change="{onScaleToggle}">
    Logarithmic y-axis scale
</label>
