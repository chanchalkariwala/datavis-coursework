/** Class implementing the bar chart view. */
class BarChart {
    
    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {
        
        let self = this;
        
        let xLeftbuffer = 60
        let xRightbuffer = 30
        let ybuffer = 40
        
        let width = 500 - xLeftbuffer - xRightbuffer;
        
        let height = 400 - ybuffer;
        
        // ******* TODO: PART I *******
        
        // Create the x and y scales; make
        // sure to leave room for the axes
        
        let xScale = d3.scaleBand()
                            .domain(this.allData.map(function(d) { return d.year; }))
                            .range([width, 0])
                            
        let yScale = d3.scaleLinear()
                        .domain([0, d3.max(this.allData, d => d[selectedDimension])])
                        .range([height, 0]);
            
        // Create colorScale
        let colorScale = d3.scaleLinear()
                .domain([
                    d3.min(this.allData, d => d[selectedDimension]), 
                    d3.max(this.allData, d => d[selectedDimension])
                ])
                .range(["blue", "steelblue"]);
        
        // Create the axes (hint: use #xAxis and #yAxis)
        let gXAxis = d3.select('#xAxis')
                        .attr("transform", "translate(" + xLeftbuffer + ", " + height + ")")
                        .transition()
                        .duration(1000)
            
        let xAxis = d3.axisBottom().scale(xScale);
                        
        gXAxis.call(xAxis)
            .selectAll("text")
            .attr("y", -5)
            .attr("x", -8)
            .attr("transform", "rotate(270)")
            .style("text-anchor", "end")
        
        let gYAxis = d3.select('#yAxis')
                        .attr('transform', 'translate('+ xLeftbuffer + ', ' + 0 +')')
                        .transition()
                        .duration(1000)
                        
        let yAxis = d3.axisLeft().scale(yScale);
                        
        gYAxis.call(yAxis);
        
        // Create the bars (hint: use #bars)
        let gBars = d3.select('#bars')
            .attr("transform", "translate(" + xLeftbuffer + ", " + height + ") scale(1, -1)");
        
        let bars = gBars.selectAll("rect").data(this.allData)
        
        bars = bars.enter()
            .append('rect')
            .merge(bars);
        
        bars.transition()
            .duration(1000)
            .attr('x', function(d) {return xScale(d.year)} )
            .attr('y', 0) 
            .attr('width', width/(this.allData.length) - 2)
            .attr('height', function(d) {return height - yScale(d[selectedDimension])} ) 
            .attr('fill', function(d) {return colorScale(d[selectedDimension])})
            
        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.
        
        var updateOtherComponents = function(dataRow)
        {
            self.worldMap.updateMap(dataRow);
            self.infoPanel.updateInfo(dataRow);
        }
        
        bars.on('click', function(d, i){
                bars.classed("selected", false);
                d3.select(this).classed("selected", true);
                updateOtherComponents(d);
            });
            
        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.
        
    }
    
    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}