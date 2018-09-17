/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName, level, position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) 
	{

		this.nodes = new Array();
		
		for(var i=0; i< json.length; i++)
		{
			let currentNode = new Node(json[i].name, json[i].parent);
			
			currentNode.parentNode = this.nodes.filter(node => currentNode.parentName == node.name)[0];
			
			this.nodes.push(currentNode);
		}
		
	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() 
	{
		for(var i=0; i< this.nodes.length; i++)
		{
			if(this.nodes[i].parentName === "root")
			{
				this.root = this.nodes[i];
			}
			
			this.nodes[i].children = this.nodes.filter(node => node.parentNode === this.nodes[i]);
			
		}
		
		this.assignLevel(this.root, 0);
		this.assignPosition(this.root, 0);

	//Assign Positions and Levels by making calls to assignPosition() and assignLevel()
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) 
	{	
		if(node.parentNode && node.parentNode !== null)
		{
			if(node.parentNode.position > position)
			{
				position = node.parentNode.position
			}
		}
		
		for(var i=0; i<this.nodes.length; i++)
		{
			if(this.nodes[i].level == node.level && this.nodes[i].position >= position)
			{
				position = this.nodes[i].position+1;
			}
		}

		node.position = position;
		
		for(var i=0; i< node.children.length; i++)
		{	
			this.assignPosition(node.children[i], position+i); 
		}
	}

	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) 
	{
		node.level = level;
		
		for(var i=0; i< node.children.length; i++)
		{	
			this.assignLevel(node.children[i], level + 1); 
		}
	}

	/**
	 * Function that renders the tree
	 */
	renderTree() 
	{
		var svgContainer = d3.select("body").append("svg").attr("height", "1200").attr("width", "1200");
		
		for(var i=0; i<this.nodes.length; i++)
		{
			if(this.nodes[i].children !== null)
			{
				var px = this.nodes[i].level*200 + 50;
				var py = this.nodes[i].position*100 + 50;

				for(var j=0; j<this.nodes[i].children.length; j++)
				{
					var cx = this.nodes[i].children[j].level*200 + 50;
					var cy = this.nodes[i].children[j].position*100 + 50;
					
					svgContainer.append("line")
						.attr("x1", px)
						.attr("y1", py)
						.attr("x2", cx)
						.attr("y2", cy);						
				}
			}
		}
	
		var groups = svgContainer.selectAll("g")
						.data(this.nodes)
						.enter()
                        .append("g");

		var circles = groups.append("circle")
						.attr("cx", function (d) { return d.level*200 + 50; })
                        .attr("cy", function (d) { return d.position*100 + 50; })
                        .attr("r", function (d) { return 40; });

		groups.append("text")
						.attr("dx", function (d) { return d.level*200 + 50; })
                        .attr("dy", function (d) { return d.position*100 + 50; })
						.attr("class", "label")
						.text(function(d){return d.name});
		
	}
		
}