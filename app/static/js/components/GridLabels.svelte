<script>
    import { compactInteger } from 'humanize-plus'

    export let x, y, height

    function yLabel (d) {
        return compactInteger(d, 1)
    }
</script>

<g class="grid">
    <g class="x-axis">
        <g class="labels">
            {#each x.ticks(13) as v (x(v))}
                <text x={x(v)}
                      y={height}
                      dy="1.25em"
                      text-anchor="middle"
                      >
                    {v}
                </text>
            {/each}
        </g>
    </g>
    <g class="y-axis">
        <g class="labels">
            {#each y.ticks(20) as v (y(v))}
                <text y={y(v)}
                      x="0"
                      dx="6.75em"
                      dy="0.25em"
                      text-anchor="end"
                      >
                    {yLabel(v)}
                </text>
            {/each}
        </g>
    </g>
</g>
