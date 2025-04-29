<script lang="ts">
	import '../app.scss';
	import '../app.postcss';

	import Navbar from '$component/Navbar.svelte'
	import Alerts from '$component/Alerts.svelte'
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Ninhursag</title>
</svelte:head>

<Alerts />
<Navbar />
{@render children?.()}
