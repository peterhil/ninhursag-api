<script>
    import DataTable from '../components/DataTable.svelte'
    import References from '../../../templates/_references.html'
    import DataLoader from '../components/DataLoader.svelte'
    import SvgChart from '../components/SvgChart.svelte'
    import Images from '../components/Images.svelte'
    import CheckboxShowAll from '../components/CheckboxShowAll.svelte'
    import LogScaleCheckbox from '../components/LogScaleCheckbox.svelte'
    import SelectFunction from '../components/SelectFunction.svelte'
    import SelectMineral from '../components/SelectMineral.svelte'
    import { chart } from '../stores/chart'
    import { fn } from '../stores/function'
    import { scale } from '../stores/scale'
    import { showAll } from '../stores/showAll'
    import { mineral } from '../stores/mineral'

    let caption = 'U.S. Geological Survey statistics (Metric tons gross weight)'
</script>

<div class="row">
    <div class="small-12 large-9 columns">
        <h1>{$mineral}</h1>

        <div class="row">
            <div class="large-4 medium-6 columns">
                <SelectMineral bind:selected="{$mineral}" />
            </div>
            <div class="large-4 medium-6 columns">
                <SelectFunction bind:selected="{$fn}" />
            </div>
        </div>

        <div class="row">
            <div class="large-4 medium-6 columns">
                <LogScaleCheckbox bind:scale="{$scale}" />
            </div>
            {#if $scale === 'linear' }
            <div class="large-4 medium-6 columns">
                <CheckboxShowAll bind:showAll="{$showAll}" />
            </div>
            {/if}
        </div>

        <figure>
            <figcaption>{caption}</figcaption>
            <DataLoader let:data data="{chart}">
                <SvgChart {data}></SvgChart>
            </DataLoader>
        </figure>
    </div>

    <aside class="small-12 large-3 columns">
        <Images mineral={$mineral} />
        <References />
    </aside>
</div>
