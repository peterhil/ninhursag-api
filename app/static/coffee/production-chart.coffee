productionChart = (data) ->
  reserve_scale = 0.1

  values = _.map data, (row) ->
    x: parseInt row["Year"]
    y: parseFloat(row["World production"]) or 0
    z: parseFloat(row["Estimated"]) or 0
    zlog: parseFloat(row["Log. Estimated"]) or 0
    res: parseFloat(row["Reserves"]) * reserve_scale or 0

  maxval = _.max(_.map(values, _.compose(_.max, _.values, (row) -> _.pick(row, ['y', 'z', 'zlog', 'res']))))

  maxval = (1 + Math.floor(maxval / 10)) * 10
  maxval = Math.pow(2, Math.ceil(Math.log(maxval) / Math.log(2)))

  color1 = "#ffaa00"
  color2 = "#222222"
  color3 = "#ff0055"
  color4 = "#0088ff"

  w = 900
  h = 600
  p = 30
  x = d3.scale.linear()
    .domain([
      values[0].x
      values[data.length - 1].x
    ])
    .range([0, w])
  y = d3.scale.linear()
    .domain([
      0
      maxval
    ])
    .range([h, 0])

  vis = d3.select("#paired-line-chart")
    .data([values])
    .append("svg:svg")
      .attr
        "width": w + p * 2
        "height": h + p * 2
        "viewBox": "0 0 " + (w + p * 2) + " " + (h + p * 2)
        "preserveAspectRatio": "xMidYMid meet"

  grid = vis.append("svg:g").attr 'class', 'grid'
  xaxis = grid.append("svg:g").attr 'class', 'x-axis'
  yaxis = grid.append("svg:g").attr 'class', 'y-axis'

  xaxis.append("svg:g").attr('class', 'lines')
    .selectAll('line')
    .data(x.ticks(15))
    .enter()
      .append("svg:line")
        .attr
          "x1": x
          "x2": x
          "y1": 0
          "y2": h

  yaxis.append("svg:g").attr('class', 'lines')
    .selectAll('line')
    .data(y.ticks(10))
    .enter()
      .append("svg:line")
        .attr
          "x1": 0
          "x2": w
          "y1": y
          "y2": y

  xaxis.append("svg:g").attr('class', 'labels')
    .selectAll('text')
    .data(x.ticks(15))
    .enter()
      .append("svg:text")
        .text(x.tickFormat(10))
        .text(String)
        .attr
          "x": x
          "y": h + 15
          "dy": ".71em"
          "text-anchor": "middle"

  yaxis.append("svg:g").attr('class', 'labels')
    .selectAll('text')
    .data(y.ticks(10))
    .enter()
      .append("svg:text")
        .text(y.tickFormat(5))
        .attr
          "x": "8em"
          "y": y
          "dx": "-.35em"
          "dy": ".35em"
          "text-anchor": "end"

  seriesChart = (vis, column, color = '#000') ->
    vis.append("svg:path")
      .attr
        "class": "line"
        "fill": "none"
        "stroke": color
        "stroke-width": 2
        "d": d3.svg.line()
          .x((d) -> x d.x)
          .y((d) -> y d[column])

  chart = vis.append("svg:g").attr 'class', 'chart'

  seriesChart(chart, 'res', color4)  # Reserves
  seriesChart(chart, 'zlog', color3) # Log estimate
  seriesChart(chart, 'z', color1)    # Estimate
  seriesChart(chart, 'y', color2)    # World production

  request_data = JSON.stringify
      'years': _.map(values, (row) -> row['x'])
      'data': _.map(values, (row) -> row['y'])

  $.ajax(
    type: 'POST'
    url: ['/', '0.0.0.0:5000', 'api/v1', 'estimate'].join '/'
    data: request_data
    headers: {"Accept": "application/json", "Content-Type": "application/json"}
    dataType: 'json'
    success: (response) ->
      vis.append("svg:path")
        .attr
          "class": "line"
          "fill": "none"
          "stroke": "#ff00ff"
          "stroke-width": 2
          "d": d3.svg.line()
            .x((d, i) -> x(parseInt(response['years'][i])))
            .y((d, i) -> y(parseFloat(response['data'][i])))
  )

  legendMarker = (legend, index, text, color, lineHeight = 28, markerWidth = 40) ->
    if color
      legend.append("svg:rect")
        .attr
          "x": 0
          "y": index * lineHeight
          "fill": color
          "stroke": color
          "height": 2
          "width": markerWidth
    legend.append("svg:text")
      .text(text)
      .attr
        "x": markerWidth + 10
        "y": index * lineHeight + 5

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

unless $('#paired-line-chart').length == 0
  d3.csv "/data/ds140-bauxi-clean.csv", productionChart
