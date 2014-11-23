d3.csv "/data/ds140-bauxi-clean.csv", (data) ->

  # Read CSV file: first row =>  labels
  reserve_scale = 0.01

  labels = new Array()
  values = new Array()

  i = 0
  while i <= data.length - 1
    labels[i] = parseInt(data[i]["Year"])
    values[i] =
      x: labels[i]
      y: parseFloat(data[i]["World production"]) or 0
      z: parseFloat(data[i]["Estimated"]) or 0
      zlog: parseFloat(data[i]["Log. Estimated"]) or 0
      res: parseFloat(data[i]["Reserves"]) * reserve_scale or 0
    i++

  maxval = _.max(_.map(values, _.compose(_.max, _.values)))

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
    labels[0]
    labels[data.length - 1]
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
    .data([values])
    .append("svg:svg")
      .attr("width", w + p * 2)
      .attr("height", h + p * 2)
      .attr("viewBox", "0 0 " + (w + p * 2) + " " + (h + p * 2))
      .attr("preserveAspectRatio", "xMidYMid meet")

  grid = vis.append("svg:g").attr('class', 'grid')
  xaxis = grid.append("svg:g").attr('class', 'x-axis')
  yaxis = grid.append("svg:g").attr('class', 'y-axis')

  xaxis.append("svg:g").attr('class', 'lines')
    .selectAll('line')
    .data(x.ticks(15))
    .enter()
      .append("svg:line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", h)

  yaxis.append("svg:g").attr('class', 'lines')
    .selectAll('line')
    .data(y.ticks(10))
    .enter()
      .append("svg:line")
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", y)
        .attr("y2", y)

  xaxis.append("svg:g").attr('class', 'labels')
    .selectAll('text')
    .data(x.ticks(15))
    .enter()
      .append("svg:text")
        .attr("x", x)
        .attr("y", h + 15)
        .attr("dy", ".71em")
        .attr("text-anchor", "middle")
        .text(x.tickFormat(10))
        .text(String)

  yaxis.append("svg:g").attr('class', 'labels')
    .selectAll('text')
    .data(y.ticks(10))
    .enter()
      .append("svg:text")
        .attr("x", "8em")
        .attr("y", y)
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
