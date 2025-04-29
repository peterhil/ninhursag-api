<script lang="ts">
	import { images } from '$store/images.js'
	import Image from '$component/Image.svelte'
	import LoadingSpinner from '$component/LoadingSpinner.svelte'

	let { mineral } = $props();
</script>

{#await $images}
	<LoadingSpinner title="Loading images..." />
{:then $images}
	{#if $images[mineral]}
		{#each $images[mineral] as image (image.src)}
			<Image {image} />
		{/each}
	{/if}
{:catch error}
	<p class="text-error">Problem loading images: { error }</p>
{/await}
