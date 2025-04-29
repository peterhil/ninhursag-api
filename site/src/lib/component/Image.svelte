<script lang="ts">
	import { API_SERVER } from '$lib/api'

	let { image } = $props();
</script>

<figure>
	<a href="{image.url}" target="ninhursag-ext">
		<img class="mineral" src="{API_SERVER}/static/img/rsrc/{image.src}" alt="{image.caption}" />
	</a>
	<figcaption>
		<span class="description">{image.caption}</span>
		{#if image.by}
		<div class="attribution"><small>Image by {image.by}</small></div>
		{/if}
	</figcaption>
</figure>
