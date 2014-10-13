d3.csv "/data/ds140-bauxi-clean.csv", (data1) ->

  # Read CSV file: first row =>  labels
  maxval = 0
  sampsize = 0

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
      res: parseFloat(data1[i]["Reserves"]) / 100 or 0

    maxval = Math.max(
      maxval,
      parseFloat(data1[i]["World production"]) or 0,
      parseFloat(data1[i]["Estimated"]) or 0,
      parseFloat(data1[i]["Log. Estimated"]) or 0,
      parseFloat(data1[i]["Reserves"]) / 100 or 0
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
    .append("svg:g")
      .attr("transform", "translate(" + p + "," + p + ")")

  rules = vis.selectAll("g.rule")
    .data(x.ticks(15))
    .enter()
    .append("svg:g")
      .attr("class", "rule")

  # Draw grid lines
  rules.append("svg:line").attr("x1", x).attr("x2", x).attr("y1", 0).attr "y2", h - 1
  rules.append("svg:line").attr("class", (d) ->
    (if d then null else "axis")
  ).data(y.ticks(10)).attr("y1", y).attr("y2", y).attr("x1", 0).attr "x2", w - 10

  # Place axis tick labels
  rules.append("svg:text").attr("x", x).attr("y", h + 15).attr("dy", ".71em").attr("text-anchor", "middle").text(x.tickFormat(10)).text String
  rules.append("svg:text").data(y.ticks(12)).attr("y", y).attr("x", "8em").attr("dx", "-.35em").attr("dy", ".35em").attr("text-anchor", "end").text y.tickFormat(5)

  # Series III
  vis.append("svg:path").attr("class", "line").attr("fill", "none").attr("stroke", color4).attr("stroke-width", 2).attr "d", d3.svg.line().x((d) ->
    x d.x
  ).y((d) ->
    y d.res
  )
  vis.select("circle.line").data(val_array1).enter().append("svg:circle").attr("class", "line").attr("fill", color4).attr("cx", (d) ->
    x d.x
  ).attr("cy", (d) ->
    y d.res
  ).attr "r", 1

  # Series III
  vis.append("svg:path").attr("class", "line").attr("fill", "none").attr("stroke", color3).attr("stroke-width", 2).attr "d", d3.svg.line().x((d) ->
    x d.x
  ).y((d) ->
    y d.zlog
  )
  vis.select("circle.line").data(val_array1).enter().append("svg:circle").attr("class", "line").attr("fill", color3).attr("cx", (d) ->
    x d.x
  ).attr("cy", (d) ->
    y d.zlog
  ).attr "r", 1

  # Series II
  vis.append("svg:path").attr("class", "line").attr("fill", "none").attr("stroke", color1).attr("stroke-width", 2).attr "d", d3.svg.line().x((d) ->
    x d.x
  ).y((d) ->
    y d.z
  )
  vis.select("circle.line").data(val_array1).enter().append("svg:circle").attr("class", "line").attr("fill", color1).attr("cx", (d) ->
    x d.x
  ).attr("cy", (d) ->
    y d.z
  ).attr "r", 1

  # Series I
  vis.append("svg:path").attr("class", "line").attr("fill", "none").attr("stroke", color2).attr("stroke-width", 2).attr "d", d3.svg.line().x((d) ->
    x d.x
  ).y((d) ->
    y d.y
  )
  vis.selectAll("circle.line").data(val_array1).enter().append("svg:circle").attr("class", "line").attr("fill", color2).attr("cx", (d) ->
    x d.x
  ).attr("cy", (d) ->
    y d.y
  ).attr "r", 1

  # -----------------------------
  # Add Title then Legend
  # -----------------------------
  lxb = 186
  vis.append("svg:text").attr("x", lxb - 20).attr("y", 28).attr("font-weight", "bold").text "Global bauxite production 1900-2010 (Metric tons gross weight)"
  vis.append("svg:rect").attr("x", lxb - 20).attr("y", 150).attr("fill", color4).attr("stroke", color4).attr("height", 2).attr "width", 40
  vis.append("svg:text").attr("x", lxb + 30).attr("y", 155).text "Reserves (USGS 2011 estimate: 28,000,000,000 tons), 100 x tons"
  vis.append("svg:text").attr("x", lxb + 30).attr("y", 185).text "Reserve base (2010): 38,000,000,000 tons – estimate"
  vis.append("svg:text").attr("x", lxb + 30).attr("y", 215).text "World resources (2010): 55,000,000,000 – 75,000,000,000 tons – estimate"
  vis.append("svg:rect").attr("x", lxb - 20).attr("y", 90).attr("fill", color1).attr("stroke", color1).attr("height", 2).attr "width", 40
  vis.append("svg:text").attr("x", lxb + 30).attr("y", 95).text "Estimated (logistic function fit)"
  vis.append("svg:rect").attr("x", lxb - 20).attr("y", 120).attr("fill", color3).attr("stroke", color3).attr("height", 2).attr "width", 40
  vis.append("svg:text").attr("x", lxb + 30).attr("y", 125).text "Estimated on log scale (logistic function fit)"
  vis.append("svg:rect").attr("x", lxb - 20).attr("y", 60).attr("fill", color2).attr("stroke", color2).attr("height", 2).attr "width", 40
  vis.append("svg:text").attr("x", lxb + 30).attr("y", 65).text "World production"

  return
