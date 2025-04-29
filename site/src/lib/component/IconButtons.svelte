<script lang="ts">
	import Carbon from 'carbon-icons-svelte/lib/Carbon.svelte'
	import FunctionMath from 'carbon-icons-svelte/lib/FunctionMath.svelte'
	import IconPark from '$component/IconPark.svelte'
	import { HeavyMetal } from '@icon-park/svg'
</script>

<div>
	<button type="button" class="button-action">
		<IconPark icon={HeavyMetal} size={32} />
		Mineral
	</button>
	<button type="button" class="button-outline">
		<Carbon size={32} />
		Element
	</button>
	<button type="button" class="button-clear">
		<FunctionMath size={32} />
		Function
	</button>
</div>
