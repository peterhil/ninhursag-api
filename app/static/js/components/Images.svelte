<script>
    import { images } from '../stores/images.js'
    import Image from './Image.svelte'

    export let mineral
</script>

{#await $images }
<div class="loading">Loading images...</div>
{:then $images}
{#if $images[mineral]}
{#each $images[mineral] as image}
<Image {image} />
{/each}
{/if}
{:catch error}
<p class="text-error">Problem loading images: { error }</p>
{/await}
