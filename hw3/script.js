/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  
    let bars = document.getElementById("bars-a").getElementsByTagName("rect");
    for (i = 0; i < bars.length; i++)
    {
        let height = (i*10) + 10;
        bars[i].setAttribute("height", height);
    }
    
}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()

        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);
    
    // ****** TODO: PART III (you will also edit in PART V) ******
    
    // TODO: Select and update the 'a' bar chart bars
    let selection_a = d3.select('#bars-a').select("g").selectAll("rect").data(data)
    
    selection_a.exit()
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();
    
    selection_a = selection_a.enter().append("rect").merge(selection_a);
    
    selection_a
        .transition()
        .duration(1000)
        //.attr('x', function(d, i) {return i*10 + 10} )
        .attr('x', function(d, i) {return iScale(i)} )
        .attr('y', 0)
        .attr('width', 10)
        .attr("height", function(d) {return aScale(d.a)} );
    
    
    // TODO: Select and update the 'b' bar chart bars
    let selection_b = d3.select('#bars-b').select("g").selectAll("rect").data(data);
    
    selection_b.exit()
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();
    
    selection_b = selection_b.enter().append("rect").merge(selection_b);
    
    selection_b
        .transition()
        .duration(1000)
        .attr('x', function(d, i) {return iScale(i)} )
        .attr('y', 0)
        .attr('width', 10)
        .attr("height", function(d) {return bScale(d.b)} );
    
    
    // TODO: Select and update the 'a' line chart path using this line generator
    
    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));
    
    d3.select('#lines-a').select("g").select("path")
        .transition()
        .duration(1000)
        .attr("d", function(d) {return aLineGenerator(data)} );
    
    // TODO: Select and update the 'b' line chart path (create your own generator)
    
    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));
    
    d3.select('#lines-b').select("g").select("path")
        .transition()
        .duration(1000)
        .attr("d", function(d) {return bLineGenerator(data)} );
    
    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));
    
    d3.select('#area-a').select("g").select("path")
        .transition()
        .duration(1000)
        .attr("d", function(d) {return aAreaGenerator(data)} );
        
    // TODO: Select and update the 'b' area chart path (create your own generator)
    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));
    
    d3.select('#area-b').select("g").select("path")
        .transition()
        .duration(1000)
        .attr("d", function(d) {return bAreaGenerator(data)} );
    
    // TODO: Select and update the scatterplot points
    let selection_plot = d3.select('#scatterplot').select("g").selectAll("circle").data(data)
    
    selection_plot.exit()
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .attr("opacity", 0)
        .remove();
    
    selection_plot = selection_plot.enter().append('circle').merge(selection_plot)
    
    selection_plot
        .transition()
        .duration(1000)
        .attr('r', 5)
        .attr("cx", function(d) {return aScale(d.a)} )
        .attr("cy", function(d) {return bScale(d.b)} );
    
    // ****** TODO: PART IV ******
    
    //Change color on hover by javascript
    let aBars = document.getElementById("bars-a").getElementsByTagName("rect");
    for(let i =0; i<aBars.length; i++)
    {
        let bar = aBars[i];
        bar.onmouseover = function(){bar.style.fill='red'};
        bar.onmouseout = function(){bar.style.fill='steelblue'};
    }
    
    let bBars = document.getElementById("bars-b").getElementsByTagName("rect");
    for(let i =0; i<bBars.length; i++)
    {
        let bar = bBars[i];
        bar.onmouseover = function(){bar.style.fill='red'};
        bar.onmouseout = function(){bar.style.fill='steelblue'};
    }

    d3.select('#scatterplot').select("g").selectAll("circle")
        .data(data)
        .on('click', function(d,i){ console.log("(x,y) : ("+ aScale(d.a) + ", " + bScale(d.b) +")"  )  })
        .append("title") 
            .text(function(d) { return "("+ aScale(d.a) + ", " + bScale(d.b) +")" });
        
}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
    //alert("Change Data called!")
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}