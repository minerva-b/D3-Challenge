// -------------------------------------------------------------------------
// * REQUIRED SECTION OF ASSIGNMENT *
// Creating a scatter plot between two of the data variables
// (Healthcare vs. Poverty OR Smokers vs. Age)
// Using D3 to pull in data from 'data.csv'
// Including state abbreviations in my circles
// Creating my axes and labels to the left and bottom of the chart
// -------------------------------------------------------------------------

// Starting off by defining the AVG area dimensions:
var svgWidth = 750;
var svgHeight = 550;

// Defining the chart's margins as an object:
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Defining the dimensions of the chart area:
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Selecting the '#scatter' id, appending SVG area to it, and setting the dimensions:
var svg = d3
.select('#scatter')
.append('svg')
.attr('height', svgHeight)
.attr('width', svgWidth);

// Appending a group to the SVG area and shift ('translate') it to the right and down 
// to adhere to the margins set in the "chartMargin" object:
var chartGroup = svg.append('g')
.attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);
var textGroup = svg.append('g')
.attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

// Loading/pulling the data from 'data.csv' using D3:
d3.csv('assets/data/data.csv').then(function(chartData) {

    // Parsing the data, to format the values to string:
    chartData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

// Scaling 'y' to chart height:
var yScale = d3.scaleLinear()
.domain([d3.min(chartData, d => d.healthcare) -3, d3.max(chartData, d => d.healthcare) +3])
.range([chartHeight, 0]);

// Scaling 'x' to chart width:
var xScale = d3.scaleLinear()
.domain([d3.min(chartData, d => d.poverty) -1, d3.max(chartData, d => d.poverty) +1])
.range([0, chartWidth]);

// Creating axes:
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

// Setting 'x' to the bottom of the chart:
chartGroup.append('g')
.attr('transform', `translate(0, ${chartHeight})`)
.call(xAxis);

// Setting 'y' to the left of the chart:
chartGroup.append('g')
.call(yAxis);

// Appending circles:
var circlesGroup = chartGroup.selectAll('circle')
    .data(chartData)
    .enter()
    .append('circle')
    .attr('class', 'stateCircle')
    .attr('cx', d => xScale(d.poverty))
    .attr('cy', d => yScale(d.healthcare))
    .attr('r', 15)

// Appending the state abbreviations to the center of the circles:
var circlesText = textGroup.selectAll('text')
    .data(chartData)
    .enter()
    .append('text')
    .attr('class', 'stateText')
    .attr('dx', d => xScale(d.poverty))
    .attr('dy', d => yScale(d.healthcare))
    .text(function(d) {
        return (d.abbr);
    })

// Step 1: Initialize Tooltip
var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([80, -60])
    .html(function(d) {
        return (`${(d.poverty)} ${(d.healthcare)}`);
});

// Step 2: Create the tooltip in chartGroup.
circlesGroup.call(toolTip);
circlesText.call(toolTip);

// Step 3: Create "mouseover" event listener to display tooltip
circlesGroup.on('mouseover', function(d) {
    toolTip.show(d, this);
})
circlesText.on('mouseover', function(d) {
    toolTip.show(d, this);
})

// Step 4: Create "mouseout" event listener to hide tooltip
    .on('mouseout', function(d) {
    toolTip.hide(d);
    });

// Creating axes labels:
chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - chartMargin.left + 40)
      .attr('x', 0 - (chartHeight / 2))
      .attr('class', 'aText')
      .text('Lacks Healthcare (%)');

    chartGroup.append('text')
      .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
      .attr('class', 'aText')
      .text('In Poverty (%)');

}).catch(function(error) {
console.log(error);
});