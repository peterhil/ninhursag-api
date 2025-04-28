<script>
    import { images } from '../stores/images.js'
    import Image from './Image.svelte'
    import LoadingSpinner from './LoadingSpinner.svelte'

    export let mineral
</script>

{#await $images }
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
