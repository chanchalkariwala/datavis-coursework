/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)
    }

	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){
        
        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,0];
            })
            .html((d)=> {
                
                let tooltip_data = {
                    "result":[
                    {"nominee": partyDInfo['nominee'], "votecount": partyDInfo['vote_total'],"percentage": partyDInfo['vote_value'],"party":"D"},
                    {"nominee": partyRInfo['nominee'], "votecount": partyRInfo['vote_total'],"percentage": partyRInfo['vote_value'],"party":"R"},
                    ]
                }
                
                if(partyIInfo != null)
                    tooltip_data['result'].push({"nominee": partyIInfo['nominee'], "votecount": partyIInfo['vote_total'],"percentage": partyIInfo['vote_value'],"party":"I"})
                
                return self.tooltip_render(tooltip_data);
            });


        // ******* TODO: PART III *******

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .votesPercentage class to style your bars.
        
        let electionArray = d3.nest()
                        .key(function(d) {return d["State_Winner"]} )
                        .rollup(function(leaves) { 
                            //console.log(leaves[0])
                            let party_name = leaves[0]['State_Winner'];
                            let vote_percentage = party_name + '_PopularPercentage'
                            let vote_total = party_name + '_Votes_Total'
                            let nominee = party_name + '_Nominee_prop'
                            return {
                                'party' : party_name,
                                'vote_value' : parseFloat(leaves[0][vote_percentage]),
                                'vote_total' : parseInt(leaves[0][vote_total]),
                                'nominee' : leaves[0][nominee]
                            }
                        })
                        .entries(electionResult)
        
        let partyIInfo = null;
        let partyRInfo = null;
        let partyDInfo= null;
        
        for(let i=0; i<electionArray.length; i++)
        {
            if(electionArray[i].key == 'I')
                partyIInfo = electionArray[i].value
            
            if(electionArray[i].key == 'R')
                partyRInfo = electionArray[i].value
                
            if(electionArray[i].key == 'D')
                partyDInfo = electionArray[i].value
             
        }
        
        let partiesArray = new Array();
        if(partyIInfo != null)
        {
            partiesArray.push(partyIInfo)
        }
        partiesArray.push(partyDInfo)
        partiesArray.push(partyRInfo)
        
        var self = this;
        this.xScale = d3.scaleLinear()
                .domain([0, d3.sum(partiesArray, d => d.vote_value)])
                .range([0, self.svgWidth]);
        
        let partiesRect = this.svg.selectAll('rect')
            .data(partiesArray);
            
        partiesRect.exit().remove();
        partiesRect = partiesRect.enter().append('rect').merge(partiesRect);
        
        let portionSeen = 0;
        
        partiesRect
            .attr('x', function(d){
                let x = self.xScale(portionSeen);
                portionSeen = portionSeen + d.vote_value;
                return x;
            })
            .attr('y', 3*this.svgHeight/4 - 5)
            .attr('width', function(d){
                return self.xScale(d.vote_value)
            })
            .attr('height', this.svgHeight/4)
            .attr('class', '')
            .attr('class', function(d){
                return self.chooseClass(d.party);
            })
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
        
        partiesRect.call(tip)
        
        //Display the total percentage of votes won by each party
        //on top of the corresponding groups of bars.
        //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary
        
        let textPercentParties = this.svg.selectAll('.votesPercentageText').filter('.percentage')
                            .data(partiesArray)
        
        textPercentParties.exit().remove();
        textPercentParties = textPercentParties.enter().append('text').merge(textPercentParties)
        
        textPercentParties
            .attr('class', '')
            .attr('class', function(d){
                return 'votesPercentageText percentage ' + self.chooseClass(d.party)
            })
            .attr('x', function(d){
                
                if(d.party == 'I')
                    return 0;
                
                if(d.party == 'D')
                {
                    if(partyIInfo == null)
                        return 0;
                    
                    d3.select(this).attr('text-anchor', 'end');
                    
                    return self.svgWidth/4;
                }
                
                if(d.party == 'R')
                {
                    d3.select(this).attr('text-anchor', 'end')
                    return self.svgWidth;
                }
            })
            .attr('y', 3*this.svgHeight/4 - 15)
            .text(function(d){
                return d.vote_value + '%'
            })
        
        let textNomineeParties = this.svg.selectAll('.votesPercentageText').filter('.nominee')
                            .data(partiesArray)
        
        textNomineeParties.exit().remove();
        textNomineeParties = textNomineeParties.enter().append('text').merge(textNomineeParties)
        
        textNomineeParties
            .attr('class', '')
            .attr('class', function(d){
                return 'votesPercentageText nominee ' + self.chooseClass(d.party)
            })
            .attr('x', function(d){
                
                if(d.party == 'I')
                    return 0;
                
                if(d.party == 'D')
                {
                    if(partyIInfo == null)
                        return 0;
                    
                    d3.select(this).attr('text-anchor', 'end');
                    
                    return self.svgWidth/4;
                }
                
                if(d.party == 'R')
                {
                    d3.select(this).attr('text-anchor', 'end')
                    return self.svgWidth;
                }
            })
            .attr('y', 3*this.svgHeight/4 - 50)
            .text(function(d){
                return d.nominee
            })
            
        
        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        let evLine = this.svg.selectAll('path');
        if(evLine.empty())
        {
            var data = [[this.svgWidth/2, 3*this.svgHeight/4 - 10], [this.svgWidth/2, 3*this.svgHeight/4 + this.svgHeight/4]];

            var lineGenerator = d3.line();
            var pathString = lineGenerator(data);

            this.svg.append('path')
                .attr('d', pathString)
                .attr('stroke-width', '2')
                .attr('stroke', '#000')
        }
        
        //Just above this, display the text mentioning details about this mark on top of this bar
        //HINT: Use .votesPercentageNote class to style this text element
        
        let evText = this.svg.selectAll('.votesPercentageNote');
                    
        if(evText.empty())
        {
            evText = this.svg.append('text')
        
            evText.classed('votesPercentageNote', true)
                .attr('x', this.svgWidth/2)
                .attr('y', 3*this.svgHeight/4 - 20)
                .text('Popular Vote (50%)')
        }
        //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
        //then, vote percentage and number of votes won by each party.

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}