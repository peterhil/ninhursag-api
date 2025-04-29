<script lang="ts">
	import type { PageData } from './$types'
	import type { MineralsOutput } from '$lib/types'

	// import AlertTest from '$component/AlertTest.svelte'
	// import IconButtons from '$component/IconButtons.svelte'
	import Minerals from '$component/Minerals.svelte'

	type OutputProps = PageData & MineralsOutput

	interface Props {
		data: OutputProps;
	}

	let { data }: Props = $props();
</script>

<main>
	<!-- <IconButtons /> -->
	<!-- <AlertTest /> -->
	<Minerals {data}/>
</main>
