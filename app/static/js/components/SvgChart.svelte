<script>
    import Legend from './Legend.svelte'

    export let data
    // export let scale = 'linear'
    // SVG attributes
    export let width = 960
    export let height = 660
    export let preserveAspectRatio = "xMidYMin meet"
    export let viewBox = `0 -20 ${width} ${height + 40}`
</script>

<svg {width} {height} {preserveAspectRatio} {viewBox}>
    <Legend series={data.series} />
</svg>
