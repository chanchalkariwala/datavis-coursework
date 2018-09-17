/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css
        
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.
        
        d3.select("#map").selectAll("path")
            .classed("host", false)
            .classed("team", false);
            
        d3.select('#points .gold').remove();
        d3.select('#points .silver').remove();
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();
        
        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.
        
        let self = this;
        
        d3.select("#points")
            .append("circle")
            .attr("cx", self.projection(worldcupData.win_pos)[0])
            .attr("cy", self.projection(worldcupData.win_pos)[1])
            .attr("r", 8)
            .classed("gold", true);
            
        d3.select("#points")
            .append("circle")
            .attr("cx", self.projection(worldcupData.ru_pos)[0])
            .attr("cy", self.projection(worldcupData.ru_pos)[1])
            .attr("r", 8)
            .classed("silver", true);
        
        // Select the host country and change it's color accordingly.
        d3.select('#'+worldcupData.host_country_code)
            .classed("host", true);

        // Iterate through all participating teams and change their color as well.
        for(let i=0; i<worldcupData.teams_iso.length; i++)
        {            
            d3.select("#" + worldcupData.teams_iso[i])
                .classed("team", true);
        }
        
        // We strongly suggest using CSS classes to style the selected countries.
        
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world, allData) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map
        
        let worldData = topojson.feature(world, world.objects.countries);
        
        let path = d3.geoPath()
                        .projection(this.projection);
        
        d3.select("#map").selectAll("path")
                .data(worldData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .classed('countries', true)
                .attr('id', function(d){ return d.id })
                .on('click', function(){
                    
                    let id = d3.select(this).attr('id')
                
                    d3.select('#country-details').remove();
                    
                    let country_title = d3.select('#details').append('div').attr('id', 'country-details').append('h3').text('World Cups played by '+id)
                    
                    let worldcup_list = d3.select('#country-details')
                                            .append('ul');
                    
                    for(let i=0; i<allData.length; i++)
                    {
                        if(allData[i].teams_iso.includes(id) == true)
                        {
                            let item = worldcup_list.append('li').text(allData[i].EDITION);
                        }
                    }
                });
                
        let graticule = d3.geoGraticule();
        d3.select("#map")
            .append('path')
            .datum(graticule)
            .attr('class', "grat")
            .attr('d', path)
            .attr('fill', 'none');
        
        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

    }
}
