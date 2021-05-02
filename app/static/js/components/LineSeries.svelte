<script>
    import { toPairs } from 'ramda'
    import { seriesStyle } from '../lib/charting'

    export let data
    export let line  // TODO Fix the mess with D3.js API
</script>

<g class="chart">
    {#each toPairs(data.columns) as [serie, column], index (serie)}
    <path class="line series-{index}"
          d="{line(toPairs(column), serie)}"
          style="{seriesStyle(serie)}">
        {serie}
    </path>
    {/each}
</g>
