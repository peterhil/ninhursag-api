<script>
    import { onDestroy, onMount } from 'svelte'

    import References from '../../../templates/_references.html'
    import Image from '../components/Image.svelte'
    import SelectFunction from '../components/SelectFunction.svelte'
    import SelectMineral from '../components/SelectMineral.svelte'
    import { images } from '../stores/images.js'
    import { messages } from '../lib/messaging'

    export let mineral = 'Gold'

    function onSelectMineral (value) {
        mineral = value
        return false
    }

    onMount(() => {
        messages.on('select:mineral', onSelectMineral)
    })
</script>

<div class="row">
    <div class="small-12 large-9 columns">
        <h1>{mineral}</h1>

        <div class="row">
            <div class="large-4 columns">
                <SelectMineral selected="{mineral}" />
            </div>
            <div class="large-4 columns">
                <SelectFunction />
            </div>
        </div>

        <figure data-chart="true"
                data-ng-model="chart"
                data-function="currentFunction"
                data-estimate="estimate"
                data-mineral="mineral"
                data-minerals="minerals"
                data-reserves="reserves"
                data-src=""
                data-width="960"
                data-height="660"
                data-caption="U.S. Geological Survey statistics (Metric tons gross weight)"
                data-legend="true"
                >
        </figure>
    </div>

    <aside class="small-12 large-3 columns">
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
        <References />
    </aside>
</div>
