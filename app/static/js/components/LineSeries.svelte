<script>
    import { seriesStyle } from '../lib/charting'

    export let data
    export let line  // TODO Fix the mess with D3.js API
</script>

<g class="chart">
    {#each data.series as serie, index}
    <path class="line series-{index}"
          d="{line(data.data, serie)}"
          style="{seriesStyle(serie)}">
        {serie}
    </path>
    {/each}
</g>
