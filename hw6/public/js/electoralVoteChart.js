   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){

        // ******* TODO: PART II *******

        //Group the states based on the winning party for the state;
        //then sort them based on the margin of victory
        
        let electionArray = d3.nest()
                            .key(function(d) {return d["State_Winner"]} )
                            .sortValues(function(a,b) { 
                                return parseFloat(a.RD_Difference) - parseFloat(b.RD_Difference)
                            })
                            .entries(electionResult)
                            
        let statesIArray = [];
        let statesRArray = [];
        let statesDArray = [];
        
        for(let i=0; i<electionArray.length; i++)
        {
            if(electionArray[i].key == 'I')
                statesIArray = electionArray[i].values
            
            if(electionArray[i].key == 'R')
                statesRArray = electionArray[i].values
                
            if(electionArray[i].key == 'D')
                statesDArray = electionArray[i].values
             
        }
        
        let statesArray = []
        statesArray = statesArray.concat(statesIArray)
        statesArray = statesArray.concat(statesDArray)
        statesArray = statesArray.concat(statesRArray)
        
        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .electoralVotes class to style your bars.
        var self = this;
        
        this.xScale = d3.scaleLinear()
                .domain([0, d3.sum(statesArray, d => parseInt(d['Total_EV']))])
                .range([0, self.svgWidth]);
        
        let rectG = this.svg.select('g');
        
        if(rectG.empty())
        {
            rectG = this.svg.append('g')
        }
        
        let statesRect = rectG.selectAll('rect')
            .data(statesArray);
            
        statesRect.exit().remove();
        statesRect = statesRect.enter().append('rect').merge(statesRect);
        
        let votesSeen = 0;
        
        statesRect
            .attr('x', function(d){
                let x = self.xScale(votesSeen);
                votesSeen = votesSeen + parseInt(d['Total_EV']);
                return x;
            })
            .attr('y', 5*this.svgHeight/8)
            .attr('width', function(d){
                return self.xScale(d['Total_EV'])
            })
            .attr('height', this.svgHeight/4)
            .attr('class', '')
            .attr('fill', function(d){
                
                if(d['State_Winner'] == 'I')
                {
                    d3.select(this).attr('class', function(d){
                        return self.chooseClass(d["State_Winner"])
                    });
                    return;
                }
            
                return colorScale(d["RD_Difference"])
            })
            .attr('rd_diff', function(d){
                return d["RD_Difference"];
            })
            .attr('state_winner', function(d){
                return d["State_Winner"];
            })
            .attr('abbr', function(d){
                return d["Abbreviation"];
            })
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1)
        
        //Display total count of electoral votes won by the Democrat and Republican party
        //on top of the corresponding groups of bars.
        //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary
        
        let textDEV = this.svg.selectAll('.electoralVoteText').filter('.democrat')
                        .data([d3.sum(statesDArray, d => parseInt(d['D_EV']))])
                        
        textDEV = textDEV.enter().append('text').merge(textDEV)
        
        textDEV.classed('electoralVoteText', true)
            .classed('democrat', true)
            .attr('x', 0)
            .attr('y', 5*this.svgHeight/8 - 10)
            .attr('text-anchor', 'start')
            .text(function(d){
                return d;
            })
        
        let textIEV = this.svg.selectAll('.electoralVoteText').filter('.independent')
                        .data([d3.sum(statesIArray, d => parseInt(d['I_EV']))])
                        
        if(statesIArray.length != 0)
        {
            textDEV.attr('x', this.svgWidth/5).attr('text-anchor', 'end')
            
            textIEV = textIEV.enter().append('text').merge(textIEV)
        
            textIEV.classed('electoralVoteText', true)
                .classed('independent', true)
                .attr('x', 0)
                .attr('y', 5*this.svgHeight/8 - 10)
                .attr('text-anchor', 'start')
                .text(function(d){
                    return d;
                })
        }
        else
        {
            textIEV = textIEV.data([]);
            textIEV.exit().remove();
            textIEV.enter().merge(textIEV)
        }
        
        let textREV = this.svg.selectAll('.electoralVoteText').filter('.republican')
                        .data([d3.sum(statesRArray, d => parseInt(d['R_EV']))])
                        
        textREV = textREV.enter().append('text').merge(textREV)
        
        textREV.classed('electoralVoteText', true)
            .classed('republican', true)
            .attr('x', this.svgWidth)
            .attr('y', 5*this.svgHeight/8 - 10)
            .attr('text-anchor', 'end')
            .text(function(d){
                return d;
            })
        
        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.
        
        let evLine = this.svg.selectAll('path');
        if(evLine.empty())
        {
            var data = [[this.svgWidth/2, 5*this.svgHeight/8 - 5], [this.svgWidth/2, 5*this.svgHeight/8 + this.svgHeight/4 + 5]];

            var lineGenerator = d3.line();
            var pathString = lineGenerator(data);

            this.svg.append('path')
                .attr('d', pathString)
                .attr('stroke-width', '2')
                .attr('stroke', '#000')
        }
        
        //Just above this, display the text mentioning the total number of electoral votes required
        // to win the elections throughout the country
        //HINT: Use .electoralVotesNote class to style this text element
        
        let evText = this.svg.selectAll('.electoralVotesNote')
                        .data([d3.sum(statesArray, d => parseInt(d['Total_EV']))])
                        
        evText = evText.enter().append('text').merge(evText)
        
        evText.classed('electoralVotesNote', true)
            .attr('x', this.svgWidth/2)
            .attr('y', 5*this.svgHeight/8 - 15)
            .text(function(d){
                let ev = d/2;
                return 'Electoral Vote (' + ev + ' needed to win)';
            })
        
        
        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        //******* TODO: PART V *******
        //Implement brush on the bar chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.
        
        let  brushed = function() {
            var selection = d3.event.selection;
            
            if(selection == null)
                return;
            
            let selectedStatesArray = new Array();
            
            let selectedStates = statesRect.filter(function(d){
                let currentRect = d3.select(this);
                let x1 = parseInt(currentRect.attr('x'));
                let x2 = x1 + parseInt(currentRect.attr('width'));
                if(x1 > selection[0] && x2 < selection[1])
                {
                    selectedStatesArray.push(d);
                    return true;
                }
                return false;
            })
            
            console.log(selection)
            console.log(selectedStatesArray)
            
            self.shiftChart.update(selectedStatesArray)
            
        };
        
        var brush = d3.brushX()
            .extent([[0, 5*this.svgHeight/8 - 5], [this.svgWidth, 5*this.svgHeight/8 + this.svgHeight/4 + 5]])
            .on("end", brushed);
        
        rectG.append("g")
            .attr("class", "brush")
            .call(brush)
        
    };

    
}
