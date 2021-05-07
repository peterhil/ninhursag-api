<script>
    export let showAll

    function onToggle (event) {
        showAll = event.target.checked ? 'yes' : 'no'
        return false
    }
</script>

<label>
    <input type="checkbox"
           checked="{showAll === 'yes'}"
           on:change="{onToggle}">
    Show all
</label>
