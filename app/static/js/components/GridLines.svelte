<script>
    export let x, y, width, height
</script>

<g class="grid">
    <g class="x-axis">
        <g class="lines">
            {#each x.ticks(25) as v}
            <line x1="{x(v)}"
                  x2="{x(v)}"
                  y1="0"
                  y2="{height}"
                  >
            </line>
            {/each}
        </g>
    </g>
    <g class="y-axis">
        <g class="lines">
            {#each y.ticks(40) as v}
            <line y1="{y(v)}"
                  y2="{y(v)}"
                  x1="0"
                  x2="{width}"
                  >
            </line>
            {/each}
        </g>
    </g>
</g>
