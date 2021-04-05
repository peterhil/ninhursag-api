<script>
    import SelectFunction from '../components/SelectFunction.svelte'
    import SelectMineral from '../components/SelectMineral.svelte'
    import References from '../../../templates/_references.html'
</script>

<div class="row" data-ng-controller="MineralCtrl">
    <div class="small-12 large-9 columns">
        <h1 data-ng-bind="mineral">Statistics</h1>

        <div class="row">
            <div class="large-4 columns">
                <SelectMineral />
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
        <figure data-resource="true"
                data-image="image"
                data-ng-repeat="image in images[mineral]"></figure>

        <References />
    </aside>
</div>
