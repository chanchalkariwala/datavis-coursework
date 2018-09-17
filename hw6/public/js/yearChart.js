
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //Global colorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        // ******* TODO: PART I *******

        // Create the chart by adding circle elements representing each election year
        //The circles should be colored based on the winning party for that year
        //HINT: Use the .yearChart class to style your circle elements
        //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
        
        //console.log(this.electionWinners)
        
        let circleXScale = d3.scaleLinear()
            .domain([0, this.electionWinners.length])
            .range([this.margin.left, this.svgWidth - this.margin.right]);
        
        var self = this;
        
        let gSVG = this.svg.append('g');
        
        var data = [[0, (this.svgHeight - 40)/2], [this.svgWidth, (this.svgHeight - 40)/2]];

        var lineGenerator = d3.line();
        var pathString = lineGenerator(data);

        gSVG.append('path')
            .attr('d', pathString)
            .style("stroke-dasharray", ("3, 3"))
            .attr('stroke', 'black')
            
        let years = gSVG.selectAll('g')
                        .data(this.electionWinners)
                        .enter()
                        .append('g');
        
        let cicrcleYears = years.append('circle')
            .attr('r', 15)
            .attr('cx', function(d, i) {return circleXScale(i)} )
            .attr('cy', (this.svgHeight - 40)/2)
            .attr('class', function(d){
                return self.chooseClass(d.PARTY)
            })
        
        //Append text information of each year right below the corresponding circle
        //HINT: Use .yeartext class to style your text elements
        years.append('text')
            .attr('x', function(d, i) {return circleXScale(i)} )
            .attr('y', (this.svgHeight - 15)/2 + 30)
            .attr('yearText', true)
            .attr('text-anchor', 'middle')
            .text(function(d){return d.YEAR})
        
        //Style the chart by adding a dashed line that connects all these years.
        //HINT: Use .lineChart to style this dashed line
        //Done. Before adding circles
        
        //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
        //HINT: Use .highlighted class to style the highlighted circle
        years.selectAll('circle')
            .on('mouseover', function(d, i){
                d3.select(this).classed('highlighted', true);
            })
            .on('mouseout', function(d, i){
                years.selectAll('circle').classed('highlighted', false);
            })
            .on('click', function(d, i){
                years.selectAll('circle').classed('selected', false);
                d3.select(this).classed('selected', true);
                
                let filename = 'data/Year_Timeline_' + d.YEAR + '.csv'
                
                d3.csv(filename, function (error, electionResult) {
                    self.electoralVoteChart.update(electionResult, self.colorScale);
                    self.votePercentageChart.update(electionResult);
                    self.tileChart.update(electionResult, self.colorScale);
                });
                
            })
        
        //Election information corresponding to that year should be loaded and passed to
        // the update methods of other visualizations

        //******* TODO: EXTRA CREDIT *******

        //Implement brush on the year chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.
        
        let brushed = function() {
            var selection = d3.event.selection;
            
            if(selection == null)
                return;
            
            let selectedYearsArray = new Array();
            
            let selectedYears = cicrcleYears.filter(function(d){
                let currentYear = d3.select(this);
                let x1 = parseInt(currentYear.attr('cx'));
                if(x1 > selection[0] && x1 < selection[1])
                {
                    selectedYearsArray.push(d);
                    return true;
                }
                return false;
            })
            
            self.electoralVoteChart.shiftChart.updateYears(selectedYearsArray)
            
        };
        
        var brush = d3.brushX()
            .extent([[0, 50], [this.svgWidth, this.svgHeight - 10]])
            .on("end", brushed);
        
        gSVG.append("g")
            .attr("class", "brush")
            .call(brush)
      
    };

};