<script lang="ts">
	import type { MineralsData } from '$lib/types'

	interface Props {
		data: MineralsData[];
	}

	let { data }: Props = $props();
</script>

<code>
	<ul>
		{#each data as mineral (mineral)}
			<li>{ mineral.name }</li>
		{/each}
	</ul>
</code>
