/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year
        
        d3.select('#edition').text(oneWorldCup.EDITION);
        
        d3.select('#host').text(oneWorldCup.host);
        
        d3.select('#winner').text(oneWorldCup.winner);
        
        d3.select('#silver').text(oneWorldCup.runner_up);
        
        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.
        
        let team_names_span = d3.select('#teams')
        team_names_span.text('')
        
        let list = team_names_span.append('ul')
        
        for(let i=0; i<oneWorldCup.teams_names.length; i++)
        {
            let item = list.append('li').text(oneWorldCup.teams_names[i])
        }
        
        //Set Labels

    }

}