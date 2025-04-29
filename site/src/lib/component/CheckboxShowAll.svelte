<script lang="ts">
	let { showAll = $bindable() } = $props();

	function onToggle (event) {
	    showAll = event.target.checked ? 'yes' : 'no'
	    return false
	}
</script>

<label>
	<input type="checkbox"
		   checked="{showAll === 'yes'}"
		   onchange={onToggle}>
	Show all
</label>
