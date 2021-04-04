<script>
    import SelectMineral from '../components/SelectMineral.svelte'
</script>

<div class="row" data-ng-controller="MineralCtrl">
    <div class="small-12 large-9 columns">
        <h1 data-ng-bind="mineral">Statistics</h1>

        <div class="row">
            <div class="large-4 columns">
                <SelectMineral />
            </div>
            <div class="large-4 columns">
                <label>Select function
                    <select data-ng-options="fn as fn for fn in functions.pdf track by fn"
                            data-ng-model="currentFunction">
                        <option value=""></option>
                    </select>
                </label>
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

        <p>References...</p>
    </aside>
</div>
