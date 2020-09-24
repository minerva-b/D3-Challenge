
// -------------------------------------------------------------------------
// * REQUIRED SECTION OF ASSIGNMENT *
// Creating a scatter plot between two of the data variables
// (Healthcare vs. Poverty OR Smokers vs. Age)
// Using D3 to pull in data from 'data.csv'
// Including state abbreviations in my circles
// Creating my axes and labels to the left and bottom of the chart
// -------------------------------------------------------------------------

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // Starting off by defining the AVG area dimensions:
    var svgWidth = 800;
    var svgHeight = 700;

    // Defining the chart's margins as an object:
    var chartMargin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
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

    // Loading/pulling the data from 'data.csv' using D3:
    d3.csv('assets/data/data.csv').then(function(chartData) {

        // Printing the data:
        console.log(chartData);

        // Parsing the data, to format the values to string:
        chartData.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
        });

        // Testing readability of the data --- removing later ---
        // var states = data.map(data => data.state);
        // console.log('states', states);
        // ---

    // Scaling 'y' to chart height:
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.healthcare)])
    .range([chartHeight, 0]);

    // Scaling 'x' to chart width:
    var xScale = d3.scaleBand()
    .domain(chartData, d => d.poverty)
    .range([0, chartWidth])
    .padding(0.05);

    // Creating axes:
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // Setting 'x' to the bottom of the chart:
    chartGroup.append('g')
    .attr('transform', `translate(0, ${chartHeight})`)
    .call(xAxis);

    // Setting 'y' to the left of the chart:
    chartGroup.append('g')
    .attr('transform', `translate(0, ${chartWidth})`)
    .call(yAxis);
  
    // Appending circles:
    var circlesGroup = chartGroup.selectAll()
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.poverty))
        .attr('cy', d => yScale(d.healthcare))
        .attr('r', 10)
        .attr('fill', '#89bdd3')
        .attr('stroke-width', 0.5)
        .attr('stroke', '#e3e3e3');

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80, -60])
        .html(function(d) {
            return (`${(d.poverty)} ${(d.healthcare)}`);
    });

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on('mouseover', function(d) {
        toolTip.show(d, this);
    })

    // Step 4: Create "mouseout" event listener to hide tooltip
        .on('mouseout', function(d) {
        toolTip.hide(d);
        });

    }).catch(function(error) {
    console.log(error);
    });
}

// When the browser loads, makeResponsive() is called:
makeResponsive();

// When the browser window is resized, makeResponsive() is called:
d3.select(window).on('resize', makeResponsive);
