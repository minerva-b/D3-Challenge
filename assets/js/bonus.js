// -------------------------------------------------------------------------
// * BONUS SECTION OF ASSIGNMENT *
// Creating a scatter plot between multiple the data variables for comparison
// (Healthcare (%) vs. Poverty (%) / Smokers (%) vs. Age (Median))
// Using D3 to pull in data from 'data.csv'
// Including state abbreviations in my circles
// Creating my axes and labels to the left and bottom of the chart
// -------------------------------------------------------------------------

// Starting off by defining the AVG area dimensions:
var svgWidth = 960;
var svgHeight = 500;

// Defining the chart's margins as an object:
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 80,
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

// Appending a group to the SVG area and shift ('translate') it to the left and top 
// to adhere to the margins set in the "chartMargin" object:
var chartGroup = svg.append('g')
.attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);
var textGroup = svg.append('g')
.attr('transform', `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial params:
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

// This function is used for updating the x-scale var upon 'click' on axis label:
function xScale(chartData, chosenXAxis) {
    // Creating scales:
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(chartData, d => d[chosenXAxis]) * 0.8,
            d3.max(chartData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, chartWidth])

    return xLinearScale;
}

// This function is used for updating the y-scale var upon 'click' on axis label:
function yScale(chartData, chosenYAxis) {
    // Creating scales:
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(chartData, d => d[chosenYAxis]) * 0.8,
            d3.max(chartData, d => d[chosenYAxis]) * 1.2
        ])
        .range([0, chartWidth])

    return yLinearScale;
}

// This function is used for updating the x-axis var upon 'click' on axes label:
function renderXAxes(newXScale, xAxis) {
    var xAxes = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(xAxes);

    return xAxis;
}

// This function is used for updating the y-axis var upon 'click' on axes label:
function renderYAxes(newYScale, yAxis) {
    var yAxes = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(yAxes);

    return yAxis;
}

// This function is used for updating the circles group with a tranisition to new circles:
function renderXCircles(circlesXGroup, newXScale, chosenXAxis, circlesText) {
    circlesXGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]));

    circlesText.transition()
        .duration(1000)
        .attr('x', d => newXScale(d[chosenXAxis]));

    return circlesXGroup;
    
}

function renderYCircles(circlesYGroup, newYScale, chosenYAxis, circlesText) {
    circlesYGroup.transition()
        .duration(1000)
        .attr('cy', d => newYScale(d[chosenYAxis]));
    
    circlesText.transition()
        .duration(1000)
        .attr('y', d => newYScale(d[chosenYAxis]));

    return circlesYGroup;
}

// This function is used for updating the circles group with new tooltip:
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel;
    var yLabel;

    if (chosenXAxis === 'poverty') {
        if (chosenYAxis === 'healthcare') {
            xLabel = 'Poverty (%):';
            yLabel = 'Healthcare (%):';
        } else if (chosenYAxis === 'smokes') {
            xLabel = 'Poverty (%):';
            yLabel = 'Smokes (%):';
        }
    }

    if (chosenXAxis === 'age') {
        if (chosenYAxis === 'healthcare') {
            xLabel = 'Age (Median):';
            yLabel = 'Healthcare (%):';
        } else if (chosenYAxis === 'smokes') {
            xLabel = 'Age (Median):';
            yLabel = 'Smokes (%):';
        }
    }

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([100, -60])
        .html(function(d) {
            if (chosenXAxis === 'poverty') {
                return (`<b>${d.state}</b><hr>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`)
            }
        });

    // Step 2: Create the tooltip in chartGroup.
    circlesGroup.call(toolTip);
    // circlesText.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on('mouseover', function(d) {
        toolTip.show(d, this);
    })
    // circlesText.on('mouseover', function(d) {
    //     toolTip.show(d, this);
    // })

    // Step 4: Create "mouseout" event listener to hide tooltip
    .on('mouseout', function(data, index) {
        toolTip.hide(data);
    });
    
    return circlesGroup;
}

// Loading/pulling the data from 'data.csv' using D3 and execute everything below:
d3.csv('assets/data/data.csv').then(function(chartData, err) {
    if (err) throw err;

    // Parsing the data, to format the string to numeric values:
    chartData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    // Using the xLinearScale and yLinearScale functions from above the csv import:
    var xLinearScale = xScale(chartData, chosenXAxis);
    var yLinearScale = yScale(chartData, chosenYAxis);

    // Scaling 'y' to chart height:
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(chartData, d => d.healthcare) -3, d3.max(chartData, d => d.healthcare) +3])
        .range([chartHeight, 0]);

    // Scaling 'x' to chart width:
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(chartData, d => d.poverty) -1, d3.max(chartData, d => d.poverty) +1])
        .range([0, chartWidth]);

    // Creating initial axis functions:
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Setting 'x' to the bottom of the chart:
   var x = chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    // Setting 'y' to the left of the chart:
   var y = chartGroup.append('g')
        .call(yAxis);

    // Appending circles:
    var circlesGroup = chartGroup.selectAll('circle')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('class', 'stateCircle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('r', 15)

    // Appending the state abbreviations to the center of the circles:
    var circlesText = textGroup.selectAll('text')
        .data(chartData)
        .enter()
        .append('text')
        .attr('class', 'stateText')
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis]))
        .text(function(d) {
            return (d.abbr);
        })

    // Creating a group for the two x-axis labels:
    var labelsXGroup = chartGroup.append('g')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    
    var povertyLabel = labelsXGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty') // Grabbing the value for event listener
        .classed('active', true)
        .text('In Poverty (%)');

    var ageLabel = labelsXGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'age') // Grabbing the value for event listener
        .classed('inactive', true)
        .text('Age (Median)');

    // Creating a group for the two y-axis labels:
    var labelsYGroup = chartGroup.append('g')
        .attr('transform', 'rotate(-90)');

    var healthcareLabel = labelsYGroup.append('text')
        .attr('x', 0 - (chartHeight / 2))
        .attr('y', 0 - chartMargin.left + 60)
        .attr('value', 'healthcare') // Grabbing the value for event listener
        .classed('active', true)
        .text('Lacks Healthcare (%)')

    var smokesLabel = labelsYGroup.append('text')
        .attr('x', 0 - (chartHeight / 2))
        .attr('y', - chartMargin.left + 40)
        .attr('value', 'smokes') // Grabbing the value for event listener
        .classed('inactive', true)
        .text('Smokes (%)')

    // Updating Tooltip function from above the csv import:
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // Creating event listener for axes labels:
    labelsXGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(chartData, chosenXAxis);
                xAxis = renderXAxes(xLinearScale, x);
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis, circlesText);
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenXAxis === 'poverty') {
                    povertyLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }

                else {
                    povertyLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            }
        })

    labelsYGroup.selectAll('text')
    .on('click', function() {
        var value = d3.select(this).attr('value');
        if (value !== chosenYAxis) {
            chosenYAxis = value;
            yLinearScale = yScale(chartData, chosenYAxis);
            yAxis = renderYAxes(yLinearScale, y);
            circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis, circlesText);
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            if (chosenYAxis === 'poverty') {
                povertyLabel
                    .classed('active', true)
                    .classed('inactive', false);
                ageLabel
                    .classed('active', false)
                    .classed('inactive', true);
            }

            else {
                povertyLabel
                    .classed('active', false)
                    .classed('inactive', true);
                ageLabel
                    .classed('active', true)
                    .classed('inactive', false);
            }
        }
    })

}).catch(function(error) {
console.log(error);
});