<script>
    import References from '../../../templates/_references.html'
    import Images from '../components/Images.svelte'
    import SelectFunction from '../components/SelectFunction.svelte'
    import SelectMineral from '../components/SelectMineral.svelte'
    import { data } from '../stores/data'
    import { mineral } from '../stores/mineral'
</script>

<div class="row">
    <div class="small-12 large-9 columns">
        <h1>{$mineral}</h1>

        <div class="row">
            <div class="large-4 columns">
                <SelectMineral bind:selected="{$mineral}" />
            </div>
            <div class="large-4 columns">
                <SelectFunction />
            </div>
        </div>

        {#await $data}
        <div class="loading">
            Loading data...
        </div>
        {:then $data}
        <pre>
            {$data}
        </pre>
        {:catch error}
        <p class="text-error">
            Failed loading data: {error}
        </p>
        {/await}
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
        <Images mineral={$mineral} />
        <References />
    </aside>
</div>
