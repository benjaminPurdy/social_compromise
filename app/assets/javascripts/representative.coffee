# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

#include particles_config.coffee

$ ->
  getCustomData = (callback) ->
    map_data = $.get '/states/map_data', json: true, (err, r, body) ->
      parent.data = body.responseJSON
      callback(body.responseJSON)

  processResponse = (data) ->
    i = 0
    while i < data.length
      data[i]['value'] = data[i]['party_influence']
      data[i]['short'] = data[i]['id']
      data[i]['id'] = data[i]['id']
      i++
    parent.dataSet = anychart.data.set(data)
    # Setting layout table
    parent.layoutTable = anychart.standalones.table()
    parent.layoutTable.cellBorder null
    parent.layoutTable.container 'representative-map'
    parent.tableChart = getTableChart()
    parent.mapChart = drawMap()
    parent.tableCharts = getTableCharts()

    parent.layoutTable.draw()
    if window.innerWidth > 768
      fillInMainTable 'wide'
    else
      fillInMainTable 'slim'
    parent.mapSeries.select 12
    parent.mapSeries.select 13
    parent.mapSeries.select 14
    parent.mapSeries.select 16
    changeContent [
      'US.IN'
      'US.KY'
      'US.IL'
      'US.IA'
    ]




  getDataId = (id) ->
    i = 0
    while i < parent.data.length
      if parent.data[i].id == id
        return parent.data[i]
      i++
    return

  getDataSum = (field) ->
    result = 0
    i = 0
    while i < parent.data.length
      result += parseInt(parent.data[i][field])
      i++
    result

  getTableChart = ->
    table = anychart.standalones.table()
    table.cellBorder null
    table.fontSize(11).vAlign('middle').fontColor '#212121'
    table.getCell(0, 0).colSpan(8).fontSize(14).vAlign('bottom').border().bottom('1px #dedede').fontColor '#7c868e'
    table.useHtml(true).contents [
      [ 'Selected States Data' ]
      [
        null
        'Name'
        'Population'
        'Senate Seats'
        'House Seats'
      ]
      [ null ]
    ]
    table.getRow(1).cellBorder().bottom('2px #dedede').fontColor '#7c868e'
    table.getRow(0).height(45).hAlign 'center'
    table.getRow(1).height 35
    table.getCol(0).width 25
    table.getCol(1).hAlign 'left'
    table.getCol(2).hAlign 'left'
    table.getCol(3).hAlign 'left'
    table.getCol(2).width 75
    table

  solidChart = (value) ->
    gauge = anychart.gauges.circular()
    gauge.data [
      value
      100
    ]
    gauge.padding 5
    gauge.margin 0
    axis = gauge.axis().radius(100).width(1).fill(null)
    axis.scale().minimum(0).maximum(100).ticks(interval: 1).minorTicks interval: 1
    axis.labels().enabled false
    axis.ticks().enabled false
    axis.minorTicks().enabled false
    stroke = '1 #64b5f6'
    gauge.bar(0).dataIndex(0).radius(80).width(40).fill('#64b5f6').stroke(null).zIndex 5
    gauge.bar(1).dataIndex(1).radius(80).width(40).fill('#F5F4F4').stroke(stroke).zIndex 4
    gauge.label().width('50%').height('25%').adjustFontSize(true).hAlign('center').anchor 'center'
    gauge.label().hAlign('center').anchor('center').padding(5, 10).zIndex 1
    gauge.background().enabled false
    gauge.fill null
    gauge.stroke null
    gauge

  getTableCharts = ->
    table = anychart.standalones.table(2, 3)
    table.cellBorder null
    table.getRow(0).height 45
    table.getRow(1).height 25
    table.fontSize(11).useHtml(true).hAlign 'center'
    table.getCell(0, 0).colSpan(3).fontSize(14).vAlign('bottom').border().bottom '1px #dedede'
    table.getRow(1).cellBorder().bottom '2px #dedede'
    parent.senateRepresentativesChart = solidChart(0)
    parent.publicChart = solidChart(0)
    parent.houseRepresentativesChart = solidChart(0)
    table.contents [
      [ 'Percentage of Total' ]
      [
        'Sentate Representatives'
        'House Representatives'
        'Public Opinion'
      ]
      [
        parent.senateRepresentativesChart
        parent.houseRepresentativesChart
        parent.publicChart
      ]
    ]
    table

  changeContent = (ids) ->
    `var data`
    contents = [
      [ 'List of Selected States' ]
      [
        null
        'Name'
        'Population'
        'Senate<br/>Seats'
        'House<br/>Seats'
      ]
    ]
    senate_representatives = { total: 0, republican: 0, democrat: 0, other: 0 }
    house_representatives = { total: 0, republican: 0, democrat: 0, other: 0 }
    public_opinion = { total: 0, republican: 0, democrat: 0, other: 0 }
    i = 0
    while i < ids.length
      data = getDataId(ids[i])
      senate_representatives.total += data['senate_representatives'].total
      senate_representatives.republican += data['senate_representatives'].republican
      senate_representatives.democrat += data['senate_representatives'].democrat
      senate_representatives.other += data['senate_representatives'].other

      public_opinion.total += data['public_opinion'].total
      public_opinion.republican += data['public_opinion'].republican
      public_opinion.democrat += data['public_opinion'].democrat
      public_opinion.other += data['public_opinion'].other

      house_representatives.total += data['house_representatives'].total
      house_representatives.republican += data['house_representatives'].republican
      house_representatives.democate += data['house_representatives'].democrat
      house_representatives.other += data['house_representatives'].other

      label = anychart.standalones.label()
      label.width('100%').height('100%').text(null).background().enabled(true).fill
        src: image_path(data['flag'] + '.png')
        mode: acgraph.vector.ImageFillMode.FIT
      contents.push [
        label
        data['name']
        data['population'].toLocaleString()
        data['senate_representatives'].total
        data['house_representatives'].total
      ]
      i++
    parent.senateRepresentativesChart.data [
      (senate_representatives.republican * 100 / senate_representatives.total).toFixed(2)
      100
    ]
    parent.senateRepresentativesChart.label().text (senate_representatives.republican * 100 / senate_representatives.total).toFixed(2) + '%'
    parent.publicChart.data [
      (public_opinion.republican * 100 / public_opinion.total).toFixed(2)
      100
    ]
    parent.publicChart.label().text (public_opinion.republican * 100 / public_opinion.total).toFixed(2) + '%'
    parent.houseRepresentativesChart.data [
      (house_representatives.republican * 100 / house_representatives.total).toFixed(2)
      100
    ]
    parent.houseRepresentativesChart.label().text (house_representatives.republican * 100 / house_representatives.total).toFixed(2) + '%'
    parent.tableChart.contents contents
    i = 0
    while i < ids.length
      parent.tableChart.getRow(i + 2).maxHeight 35
      i++
    return

  drawMap = ->
    map = anychart.map()
    #set map title settings using html
    map.title().padding(10, 0, 10, 0).margin(0).useHtml true
    map.title 'US States<br/>by Party Representation' + '<br/><span style="color:#212121; font-size: 11px;">Pick your state or a party to see chosen states representatitves and statistics</span>'
    map.padding [
      0
      0
      10
      0
    ]
    #set map Geo data
    map.geoData 'anychart.maps.united_states_of_america'
    map.listen 'pointsSelect', (e) ->
      selected = []
      selectedPoints = e.seriesStatus[0].points
      i = 0
      while i < selectedPoints.length
        selected.push selectedPoints[i].id
        i++
      changeContent selected
      return
    parent.mapSeries = map.choropleth(parent.dataSet)
    parent.mapSeries.labels null
    parent.mapSeries.tooltip().useHtml true
    parent.mapSeries.tooltip().title().useHtml true
    parent.mapSeries.tooltip().titleFormat ->
      `var data`
      data = getDataId(@id)
      @name
    parent.mapSeries.tooltip().format ->
      `var data`
      data = getDataId(@id)
      '<span style="font-size: 12px; color: #b7b7b7"><span style="font-size: 12px; color: #b7b7b7">House Seats: </span>' + data['house_representatives'].total + '<br/>' +
      '<span style="font-size: 12px; color: #b7b7b7"><span style="font-size: 12px; color: #b7b7b7">Senate Seats: </span>' + data['senate_representatives'].total + '<br/>' +
      '<span style="font-size: 12px; color: #b7b7b7"><span style="font-size: 12px; color: #b7b7b7">Population: </span>' + data['population']
    scale = anychart.scales.ordinalColor([
      {
        from: 0
        to: 400
      }
      {
        from: 400
        to: 800
      }
      {
        from: 800
        to: 1200
      }
      {
        from: 1200
        to: 1600
      }
      {
        from: 1600
        to: 2000
      }
    ])
    scale.colors [
      '#0288d1'
      '#4fc3f7'
      '#f06292'
      '#c2185b'
      '#c2185b'
    ]
    parent.mapSeries.hoverFill '#9898FB'
    parent.mapSeries.selectFill '#6A6AAF'
    parent.mapSeries.selectStroke anychart.color.darken('#6A6AAF')
    parent.mapSeries.colorScale scale
    parent.mapSeries.stroke ->
      @iterator.select @index
      pointValue = @iterator.get(@referenceValueNames[1])
      color = @colorScale.valueToColor(pointValue)
      anychart.color.darken color
    colorRange = map.colorRange()
    colorRange.enabled true
    colorRange.ticks().stroke('3 #ffffff').position('center').length(20).enabled true
    colorRange.colorLineSize 5
    colorRange.labels().fontSize(11).padding(0, 0, 0, 0).format ->
      range = @colorRange
      name = undefined
      if (range.start == 0)
        name = 'Heavy Dem.'
      if (range.start == 400)
        name = 'Mild Dem.'
      if (range.start == 800)
        name = 'Split'
      if (range.start == 1200)
        name = 'Mild Rep.'
      if (range.start == 1600)
        name = 'Heavy Rep.'
      name
    map

  # Creates general layout table with two inside layout tables


  fillInMainTable = (flag) ->
    if flag == 'wide'
      parent.layoutTable.contents [
        [
          parent.mapChart
          parent.tableCharts
        ]
        [
          null
          parent.tableChart
        ]
      ], true
      parent.layoutTable.getCell(0, 0).rowSpan 2
      parent.layoutTable.getRow(0).height null
      parent.layoutTable.getRow(1).height null
    else
      parent.layoutTable.contents [
        [ parent.mapChart ]
        [ parent.tableCharts ]
        [ parent.tableChart ]
      ], true
      parent.layoutTable.getRow(0).height 350
      parent.layoutTable.getRow(1).height 200
      parent.layoutTable.getRow(2).height 250
    parent.layoutTable.draw()
    return

  # On resize changing layout to mobile version or conversely

  window.onresize = ->
    if parent.layoutTable.colsCount() == 1 and window.innerWidth > 767
      fillInMainTable 'wide'
    else if parent.layoutTable.colsCount() == 2 and window.innerWidth <= 767
      fillInMainTable 'slim'
    return

  this.mapSeries = undefined
  this.mapChart = undefined
  this.tableCharts = undefined
  this.dataSet = undefined
  this.tableChart = undefined
  this.senateRepresentativesChart = undefined
  this.publicChart = undefined
  this.houseRepresentativesChart = undefined
  this.layoutTable = undefined
  this.data = undefined
  parent = this
  getCustomData(processResponse)

