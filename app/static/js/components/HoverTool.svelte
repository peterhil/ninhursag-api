<script>
    export let width, height, x, y

    let point = {x: 0, y: 0}

    // Get point in global SVG space
    function cursorPoint(event){
        const svg = document.querySelector('svg')
        const pt = svg.createSVGPoint()

        pt.x = event.clientX
        pt.y = event.clientY

        const res = pt.matrixTransform(svg.getScreenCTM().inverse())

        point.x = res.x
        point.y = res.y

        return res
    }

    function onClick (event) {
        const pt = cursorPoint(event)
        console.log(
            event,
            x.invert(pt.x),
            y.invert(pt.y),
        )
    }
</script>

<g on:click={onClick}>
    <rect class="hover-area" {width} {height}/>
    <line x1="{point.x}"
          x2="{point.x}"
          y1="0"
          y2="{height}"
          stroke="#2226"
          stroke-width="1px"
          >
    </line>
</g>

<style>
    .hover-area {
        opacity: 0;
    }
</style>
