<script lang="ts">
	let { scale = $bindable() } = $props();

	function onScaleToggle (event) {
	    scale = event.target.checked ? 'log' : 'linear'
	    return false
	}
</script>

<label>
	<input type="checkbox"
		   checked="{scale === 'log'}"
		   onchange={onScaleToggle}>
	Logarithmic
</label>
