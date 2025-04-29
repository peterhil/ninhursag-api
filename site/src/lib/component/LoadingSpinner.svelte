<script lang="ts">
	interface Props {
		title?: string;
	}

	let { title = 'Loading...' }: Props = $props();
</script>

<div class="loading" title="{title}">
	<div class="spinner"></div>
</div>
