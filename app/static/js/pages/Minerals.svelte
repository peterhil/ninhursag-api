<script>
    import References from '../../../templates/_references.html'
    import RawData from '../components/RawData.svelte'
    import Chart from '../components/Chart.svelte'
    import Images from '../components/Images.svelte'
    import LogScaleCheckbox from '../components/LogScaleCheckbox.svelte'
    import SelectFunction from '../components/SelectFunction.svelte'
    import SelectMineral from '../components/SelectMineral.svelte'
    import { fn } from '../stores/function'
    import { scale } from '../stores/scale'
    import { mineral } from '../stores/mineral'

    const caption = 'U.S. Geological Survey statistics (Metric tons gross weight)'
</script>

<div class="row">
    <div class="small-12 large-9 columns">
        <h1>{$mineral}</h1>

        <div class="row">
            <div class="large-4 columns">
                <SelectMineral bind:selected="{$mineral}" />
            </div>
            <div class="large-4 columns">
                <SelectFunction bind:selected="{$fn}" />
            </div>
        </div>

        <figure>
            {#if caption}
            <figcaption>{caption}</figcaption>
            {/if}
            <LogScaleCheckbox bind:scale="{$scale}"></LogScaleCheckbox>
            <Chart></Chart>
        </figure>

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
                >
        </figure>

        <RawData></RawData>
    </div>

    <aside class="small-12 large-3 columns">
        <Images mineral={$mineral} />
        <References />
    </aside>
</div>
