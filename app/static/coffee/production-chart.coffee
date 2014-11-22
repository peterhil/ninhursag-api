d3.csv "/data/ds140-bauxi-clean.csv", (data1) ->

  # Read CSV file: first row =>  labels
  maxval = 0
  sampsize = 0
  reserve_scale = 0.01

  label_array = new Array()
  val_array1 = new Array()

  sampsize = data1.length

  i = 0
  while i < sampsize - 100
    label_array[i] = parseInt(data1[i]["Year"])
    val_array1[i] =
      x: label_array[i]
      y: parseFloat(data1[i]["World production"]) or 0
      z: parseFloat(data1[i]["Estimated"]) or 0
      zlog: parseFloat(data1[i]["Log. Estimated"]) or 0
      res: parseFloat(data1[i]["Reserves"]) * reserve_scale or 0

    maxval = Math.max(
      maxval,
      parseFloat(data1[i]["World production"]) or 0,
      parseFloat(data1[i]["Estimated"]) or 0,
      parseFloat(data1[i]["Log. Estimated"]) or 0,
      parseFloat(data1[i]["Reserves"]) * reserve_scale or 0
    )
    i++

  maxval = (1 + Math.floor(maxval / 10)) * 10
  maxval = Math.pow(2, Math.ceil(Math.log(maxval) / Math.log(2)))

  color1 = "#ffaa00"
  color2 = "#770033"
  color3 = "#ff0055"
  color4 = "#0088ff"

  w = 900
  h = 600
  p = 30
  x = d3.scale.linear().domain([
    label_array[0]
    label_array[sampsize - 120]
  ]).range([
    0
    w
  ])
  y = d3.scale.linear().domain([
    0
    maxval
  ]).range([
    h
    0
  ])

  vis = d3.select("#paired-line-chart")
    .data([val_array1])
    .append("svg:svg")
      .attr("width", w + p * 2)
      .attr("height", h + p * 2)
      .attr("viewBox", "0 0 " + (w + p * 2) + " " + (h + p * 2))
      .attr("preserveAspectRatio", "xMidYMid meet")
    .append("svg:g")

  rules = vis.selectAll("g.rule")
    .data(x.ticks(15))
    .enter()
    .append("svg:g")
      .attr("class", "rule")

  # Draw grid lines
  rules.append("svg:line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", h - 1)
  rules.append("svg:line")
    .data(y.ticks(10))
    .attr("y1", y)
    .attr("y2", y)
    .attr("x1", 0)
    .attr("x2", w - 10)

  # Place axis tick labels
  rules.append("svg:text")
    .attr("x", x)
    .attr("y", h + 15)
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .text(x.tickFormat(10))
    .text(String)
  rules.append("svg:text")
    .data(y.ticks(12))
    .attr("y", y)
    .attr("x", "8em")
    .attr("dx", "-.35em")
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text(y.tickFormat(5))

  seriesChart = (vis, column, color = '#000') ->
    vis.append("svg:path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", d3.svg.line()
        .x((d) -> x d.x)
        .y((d) -> y d[column]))

  seriesChart(vis, 'res', color4)  # Reserves
  seriesChart(vis, 'zlog', color3) # Log estimate
  seriesChart(vis, 'z', color1)    # Estimate
  seriesChart(vis, 'y', color2)    # World production

  # -----------------------------
  # Add Title then Legend
  # -----------------------------
  legendMarker = (legend, index, text, color, lineHeight = 28, markerWidth = 40) ->
    y = index * lineHeight
    if color
      legend.append("svg:rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("fill", color)
        .attr("stroke", color)
        .attr("height", 2)
        .attr("width", markerWidth)
    legend.append("svg:text")
      .attr("x", markerWidth + 10)
      .attr("y", y + 5)
      .text(text)

  legendData = [
    ["World production", color2],
    ["Estimated (logistic function fit)", color1],
    ["Estimated on log scale (logistic function fit)", color3],
    ["Reserves (USGS 2011 estimate: 28,000,000,000 tons), #{1 / reserve_scale} x tons", color4],
    ["Reserve base (2010): 38,000,000,000 tons – estimate"],
    ["World resources (2010): 55,000,000,000–75,000,000,000 tons – estimate"],
  ]

  legend = (vis, x, y, data) ->
    group = vis.append("svg:g")
      .attr('class', 'legend')
      .attr('transform', "translate(#{x}, #{y})")
    _.map data, (item, index) ->
      legendMarker group, index, item[0], item[1]
    group

  legend vis, 166, 40, legendData

  return
