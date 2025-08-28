let nodes = [];
let links = [];
let currentStep = 0;
let nodeObjects = [];
let previousLinkStateTables = [];

const staticGraphSvg = d3.select("#static-graph");



// Event listener for generating the graph
document.getElementById("generate-graph").addEventListener("click", () => {
    const nodesInput = document.getElementById("nodes-input").value.trim();
    const linksInput = document.getElementById("links-input").value.trim();

    if (!nodesInput || !linksInput) {
        alert("Please enter both nodes and links.");
        return;
    }
     // Reset for new graph
    nodes = [];
    links = [];
    currentStep = 0;
    nodeObjects = [];
    previousLinkStateTables = [];


    // Process nodes and links
    nodes = nodesInput.split(',').map((id, index) => ({
        id: id.trim(),
        x: 100 + index * 100,
        y: 100 + (index % 2) * 200
    }));

    links = linksInput.split(';').map(link => {
        const [source, target, weight] = link.trim().split(',');
        return { source: source.trim(), target: target.trim(), weight: +weight };
    });

    staticGraphSvg.selectAll("*").remove();

    drawGraph(staticGraphSvg, nodes, links);
    initLinkStateRouting(nodes, links);
});
function drawGraph(svg, nodes, links) {
    // Draw links
    svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Add weights to the links with dynamic positioning
    svg.selectAll(".link-label")
        .data(links)
        .enter()
        .append("text")
        .attr("class", "link-label")
        .attr("x", d => {
            const sourceNode = nodes.find(n => n.id === d.source);
            const targetNode = nodes.find(n => n.id === d.target);
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            // Calculate angle and offset
            const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
            const offsetX = 15 * Math.cos(angle + Math.PI / 2); // Offset label to the side
            const offsetY = 15 * Math.sin(angle + Math.PI / 2);

            return midX + offsetX;
        })
        .attr("y", d => {
            const sourceNode = nodes.find(n => n.id === d.source);
            const targetNode = nodes.find(n => n.id === d.target);
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            // Calculate angle and offset
            const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
            const offsetX = 15 * Math.cos(angle + Math.PI / 2); // Offset label to the side
            const offsetY = 15 * Math.sin(angle + Math.PI / 2);

            return midY + offsetY;
        })
        .attr("text-anchor", "middle")
        .text(d => d.weight);
    
    // Draw nodes
    svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 20)
        .attr("fill", "lightblue");

    // Add node labels
    svg.selectAll(".node-label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "node-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y - 30)
        .attr("text-anchor", "middle")
        .text(d => d.id);
}



// Function to initialize Link State Routing
function initLinkStateRouting(nodes, links) {
    document.getElementById("next-step").disabled = false;
    document.getElementById("back-step").disabled = true; // Disable back step 

    class Node {
        constructor(name) {
            this.name = name;
            this.links = {};
            this.routingTable = {};
        }

        addLink(targetNode, weight) {
            this.links[targetNode.name] = weight; // Store weight to the target node
        }

        computeLinkStateTable() {
    this.routingTable = {};
    for (const neighbor in this.links) {
        this.routingTable[neighbor] = {
            cost: this.links[neighbor],
            nextHop: neighbor
        };
    }
    return this.routingTable; // Returning the routing table
}


        computeRoutingTable() {
            const unvisited = new Set(nodes.map(n => n.id));
            const distances = {};
            const previous = {};

            // Initialize distances and previous nodes
            nodes.forEach(node => {
                distances[node.id] = Infinity; // Set initial distances to infinity
                previous[node.id] = null; // No previous node
            });
            distances[this.name] = 0; // Distance to itself is 0

            // Dijkstra's algorithm loop
            while (unvisited.size) {
                // Get the unvisited node with the smallest distance
                const currentNode = [...unvisited].reduce((minNode, node) => {
                    return distances[node] < distances[minNode] ? node : minNode;
                });

                unvisited.delete(currentNode); // Mark as visited

                // Update distances for all neighboring nodes
                const currentLinks = nodeObjects.find(n => n.name === currentNode).links;
                for (const neighbor in currentLinks) {
                    const newDistance = distances[currentNode] + currentLinks[neighbor]; // Calculate new distance
                    // If the calculated distance is less, update the table
                    if (newDistance < distances[neighbor]) {
                        distances[neighbor] = newDistance; // Update shortest distance
                        previous[neighbor] = currentNode; // Update previous node
                    }
                }
            }

            // Build routing table from distances and previous nodes
            this.routingTable = {};
            for (const node of nodes) {
                this.routingTable[node.id] = {
                    cost: distances[node.id] === Infinity ? '∞' : distances[node.id],
                    nextHop: previous[node.id] ? getFirstHop(this.name, node.id, previous) : null,
                };
            }
        }

        printRoutingTable() {
    const table = this.routingTable;
    let html = `<h4>Routing table for ${this.name}</h4><table><tr><th>Destination</th><th>Distance vector</th><th>Next Hop</th></tr>`;
    for (const destination in table) {
        html += `<tr><td>${destination}</td><td>${table[destination].cost}</td><td>${table[destination].nextHop || '0'}</td></tr>`;
    }
    html += "</table>";
    return html;
}

    }

    // Utility function to find the first hop in the shortest path
    function getFirstHop(source, destination, previous) {
        let currentNode = destination;
        while (previous[currentNode] && previous[currentNode] !== source) {
            currentNode = previous[currentNode];
        }
        return currentNode;
    }

    // Create node objects
    nodeObjects = nodes.map(nodeData => new Node(nodeData.id));

    // Establish links between nodes
    links.forEach(link => {
        const sourceNode = nodeObjects.find(n => n.name === link.source);
        const targetNode = nodeObjects.find(n => n.name === link.target);
        if (sourceNode && targetNode) {
            sourceNode.addLink(targetNode, link.weight); // Link from source to target
            targetNode.addLink(sourceNode, link.weight); // Link from target to source (bi-directional)
        }
    });

    // Step 1: Compute Link State Tables
    previousLinkStateTables = nodeObjects.map(node => node.printRoutingTable());
    nodeObjects.forEach(node => {
        node.computeLinkStateTable(); // Each node computes its link state table
    });

    // Display step description
    document.getElementById("step-description").innerText = "Step 1:Nodes calculate the distance of their direct neighbor ";

    const routingTablesDiv = document.querySelector(".routing-tables");
    routingTablesDiv.innerHTML = nodeObjects.map(node => node.printRoutingTable()).join("");

    currentStep++;
}

// Event listeners for step buttons
document.getElementById("next-step").addEventListener("click", nextStepHandler);
document.getElementById("back-step").addEventListener("click", backStepHandler);

function nextStepHandler() {
    if (currentStep === 1) {
        // Step 2: Compute shortest paths using Dijkstra's algorithm
        nodeObjects.forEach(node => node.computeRoutingTable());
        document.getElementById("step-description").innerText = "Step 2: Nodes compute their routing table with distance vector of their neighbors";
        const routingTablesDiv = document.querySelector(".routing-tables");
        routingTablesDiv.innerHTML = nodeObjects.map(node => node.printRoutingTable()).join("");
        currentStep++;
        document.getElementById("back-step").disabled = false; // Enable back step
    }
}

function backStepHandler() {
    if (currentStep === 2) {
        // Go back to Step 1: Restore link state tables
        // No need to restore since we will recompute them if needed
        document.getElementById("step-description").innerText = "Step 1:Nodes calculate the distance of their direct neighbor";
        const routingTablesDiv = document.querySelector(".routing-tables");
        routingTablesDiv.innerHTML = previousLinkStateTables.join(""); // Display previous link state tables
        currentStep--; // Decrease the current step

        // Disable the back button if we're now at step 1
        document.getElementById("back-step").disabled = true; 
    }
    else if (currentStep === 1) {
        // At step 1, you cannot go back
        document.getElementById("back-step").disabled = true;
    }
}

// Function to highlight the path
function highlightPath(path) {
    staticGraphSvg.selectAll(".highlighted-link").remove(); // Clear previous highlights

    if (path.length === 0) {
        alert("No path found.");
        return;
    }

    // Highlight the path
    for (let i = 0; i < path.length - 1; i++) {
        const link = links.find(l => (l.source === path[i] && l.target === path[i + 1]) || 
                                       (l.source === path[i + 1] && l.target === path[i]));
        if (link) {
            staticGraphSvg.append("line")
                .attr("class", "highlighted-link")
                .attr("x1", nodes.find(n => n.id === link.source).x)
                .attr("y1", nodes.find(n => n.id === link.source).y)
                .attr("x2", nodes.find(n => n.id === link.target).x)
                .attr("y2", nodes.find(n => n.id === link.target).y)
                .attr("stroke", "red") // Highlight color
                .attr("stroke-width", 4);
        }
    }
}

// Function to find the path using Dijkstra's algorithm
function findPath(source, destination) {
    const sourceNode = nodeObjects.find(n => n.name === source);
    const destinationNode = nodeObjects.find(n => n.name === destination);
    
    if (!sourceNode || !destinationNode) {
        alert("Source or destination node not found.");
        return [];
    }

    const unvisited = new Set(nodes.map(n => n.id));
    const distances = {};
    const previous = {};

    // Initialize distances and previous nodes
    nodes.forEach(node => {
        distances[node.id] = Infinity; 
        previous[node.id] = null; 
    });
    distances[source] = 0; 

    // Dijkstra's algorithm loop
    while (unvisited.size) {
        const currentNode = [...unvisited].reduce((minNode, node) => {
            return distances[node] < distances[minNode] ? node : minNode;
        });

        unvisited.delete(currentNode); 

        const currentLinks = nodeObjects.find(n => n.name === currentNode).links;
        for (const neighbor in currentLinks) {
            const newDistance = distances[currentNode] + currentLinks[neighbor];
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance; 
                previous[neighbor] = currentNode; 
            }
        }
    }

    // Build the path
    const path = [];
    let current = destination;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }

    return path[0] === source ? path : []; // Return the path if it starts with the source
}

// Event listener for finding the path
document.getElementById("find-path").addEventListener("click", () => {
    const source = document.getElementById("source-input").value.trim();
    const destination = document.getElementById("destination-input").value.trim();

    const path = findPath(source, destination);
    highlightPath(path);
    document.getElementById("path-description").innerText = path.length > 0 ? `Path found: ${path.join(" -> ")}` : "No path found.";
});
// Event listener to trigger the file input click when the "Upload" button is clicked
document.getElementById("generate-graph-from-file").addEventListener("click", () => {
    document.getElementById("file-input").click(); // Simulate click on the hidden file input
});

// Event listener to handle the file input change (file selection)
document.getElementById("file-input").addEventListener("change", (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
        const reader = new FileReader(); // Create a FileReader object to read the file

        reader.onload = function(e) {
            const fileContents = e.target.result; // File content as a string

            // Assuming the file contains nodes and links in the same format as the input fields
            // For example: Nodes: A,B,C,D and Links: A,B,1;A,C,2;B,D,4;C,D,3

            const lines = fileContents.split('\n'); // Split file contents into lines
            const nodesInput = lines[0].trim(); // First line for nodes
            const linksInput = lines[1].trim(); // Second line for links

            document.getElementById("nodes-input").value = nodesInput; // Set nodes input value
            document.getElementById("links-input").value = linksInput; // Set links input value

            // Now that the inputs are set, trigger graph generation (simulate the "Generate Graph" button click)
            document.getElementById("generate-graph").click();
        };

        reader.readAsText(file); // Read the file as text
    }
});

// Event listener for "Generate Graph from File" button
/*document.getElementById('generate-graph-from-file').addEventListener('click', () => {
    document.getElementById('file-input').click(); // Trigger the hidden file input
});

// Event listener for file selection
document.getElementById('file-input').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');

        // Assume first line is the node input and the second line is the edge input
        if (lines.length >= 2) {
            const nodeInput = lines[0].trim();
            const edgeInput = lines[1].trim();

            // Set the values of the input boxes
            document.getElementById('node-input').value = nodeInput;
            document.getElementById('edge-input').value = edgeInput;

            // Now call the generateGraph function to process the inputs
            generateGraph();
        } else {
            alert('The file format is incorrect. Please provide at least two lines: one for nodes and one for edges.');
        }
    };

    // Read the file as text
    reader.readAsText(file);
}*/





