<script>
	import { run } from 'svelte/legacy';

	import Alert from '$component/Alert.svelte'
	import { alerts, maxLevel } from '$store/alerts'

	var level = $state('info')
	var lastLevel = $state('info')

	// Make sure the last fading alert doesn’t change the alerts border colour
	run(() => {
		level = ($alerts.size > 0
		    ? lastLevel = maxLevel($alerts)
		    : lastLevel)
	});
</script>

<div id="alerts" class={level}>
	{#each [...$alerts.entries()] as [id, alert] (id) }
		<Alert type={alert.type} on:click={() => alerts.remove(id)}>
			{alert.message}
		</Alert>
	{/each}
</div>
