/** Class implementing the shiftChart. */
class ShiftChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
    };
    
    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
     */
    updateYears(selectedYears){
        
        // ******* TODO: PART V *******
        //Display the names of selected states in a list
        
        let span = d3.select('#yearList');
        
        let list = span.select('ul');

        if(list.empty())
        {
            list = span.append('ul');
        }
        
        let listItems = list.selectAll('li').data(selectedYears);
        
        listItems.exit().remove();
        listItems = listItems.enter().append('li').merge(listItems);
        
        listItems.text(function(d){
            return d["YEAR"];
        })
        
    };
    
    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    update(selectedStates){
        
        // ******* TODO: PART V *******
        //Display the names of selected states in a list
        
        let span = d3.select('#stateList');
        
        let list = span.select('ul');

        if(list.empty())
        {
            list = span.append('ul');
        }
        
        let listItems = list.selectAll('li').data(selectedStates);
        
        listItems.exit().remove();
        listItems = listItems.enter().append('li').merge(listItems);
        
        listItems.text(function(d){
            return d["State"];
        })
        
        
    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

    };


}
