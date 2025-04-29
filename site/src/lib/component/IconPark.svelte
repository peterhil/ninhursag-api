<script lang="ts">
	import { setConfig } from '@icon-park/svg'

	let { ...props } = $props();

	setConfig({
	    theme: 'outline',
	    size: '32px',
	    strokeWidth: '2.2px',
	    strokeLinecap: 'round',
	    strokeLinejoin: 'round',
	    // outStrokeColor: '#000',
	    // outFillColor: '#2F88FF',
	    // innerStrokeColor: '#FFF',
	    // innerFillColor: '#43CCF8'
	})

	const svg = props.icon({...props})
</script>

{@html svg}
