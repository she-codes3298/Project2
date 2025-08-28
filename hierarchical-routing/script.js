// Define the nodes with region information
const nodes = [
    { id: 'A1', region: 'Region 1', x: 100, y: 100 },
    { id: 'A2', region: 'Region 1', x: 200, y: 100 },
    { id: 'B1', region: 'Region 2', x: 400, y: 100 },
    { id: 'B2', region: 'Region 2', x: 600, y: 100 },
    { id: 'C1', region: 'Region 3', x: 300, y: 300 },
    { id: 'C2', region: 'Region 3', x: 400, y: 300 }
];

// Define the links, differentiating between intra-region and inter-region links
const links = [
    { source: 'A1', target: 'A2', weight: 1, type: 'intra' },
    { source: 'B1', target: 'B2', weight: 1, type: 'intra' },
    { source: 'C1', target: 'C2', weight: 1, type: 'intra' },
    { source: 'A2', target: 'B1', weight: 2, type: 'inter' },
    { source: 'B2', target: 'C1', weight: 3, type: 'inter' },
    { source: 'A1', target: 'C1', weight: 2, type: 'dotted' } // Add dotted link
];

let currentStep = 0;

// Select SVG containers
const dynamicGraphSvg = d3.select("#dynamic-graph");
const staticGraphSvg = d3.select("#static-graph");

// Function to draw circles around regions
function drawRegionCircles(svg, nodes) {
    const regions = Array.from(new Set(nodes.map(node => node.region)));

    regions.forEach(region => {
        const regionNodes = nodes.filter(node => node.region === region);

        const minX = Math.min(...regionNodes.map(n => n.x));
        const maxX = Math.max(...regionNodes.map(n => n.x));
        const minY = Math.min(...regionNodes.map(n => n.y));
        const maxY = Math.max(...regionNodes.map(n => n.y));

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const radius = Math.max(maxX - minX, maxY - minY) / 2 + 50;

        // Draw the circle
        svg.append("circle")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", radius)
            .attr("stroke", "blue")
            .attr("fill", "none");

        // Add region label
        svg.append("text")
            .attr("x", centerX)
            .attr("y", centerY - radius - 10)
            .attr("text-anchor", "middle")
            .text(region)
            .attr("font-size", "16px")
            .attr("fill", "blue");
    });
}

// Function to draw the graph (both static and dynamic)
function drawGraph(svg, nodes, links) {
    drawRegionCircles(svg, nodes);

    // Draw links
    svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", d => d.type === 'intra' ? 'intra' : d.type === 'inter' ? 'inter' : 'dotted') // Add class for dotted links
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y)
        .attr("stroke", d => d.type === 'intra' ? 'green' : d.type === 'inter' ? 'red' : 'red') // Change color for dotted lines
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", d => d.type === 'dotted' ? '5,5' : '0'); // Dotted line style

    // Add weights to the links
    svg.selectAll(".link-label")
        .data(links)
        .enter()
        .append("text")
        .attr("class", "link-label")
        .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
        .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2 - 10)
        .text(d => d.weight)
        .attr("text-anchor", "middle");

    // Draw nodes
    svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 20)
        .attr("fill", "orange");

    // Add node labels
    svg.selectAll(".node-label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "node-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", -30)
        .text(d => d.id)
        .attr("text-anchor", "middle");
}

// Draw static graph
drawGraph(staticGraphSvg, nodes, links);

// Update the dynamic graph
function updateDynamicGraph() {
    dynamicGraphSvg.selectAll("*").remove(); // Clear existing elements
    drawGraph(dynamicGraphSvg, nodes, links); // Redraw the graph
}

function highlightShortestPath(sourceId, targetId) {
    // Clear previous highlights
    dynamicGraphSvg.selectAll(".link")
        .attr("stroke", d => d.type === 'intra' ? 'green' : d.type === 'inter' ? 'red' : 'red')
        .attr("stroke-width", 2);

    const sourceNode = nodesArray.find(n => n.id === sourceId); // Change from name to id
    const targetNode = nodesArray.find(n => n.id === targetId); // Change from name to id

    // Check if nodes are valid
    if (!sourceNode || !targetNode) {
        console.error("Source or Target Node not found");
        return;
    }

    let path = [sourceNode.id];
    let currentNode = sourceNode;

    // Find the shortest path using the routing table
    while (currentNode.routingTable[targetId] && currentNode.routingTable[targetId].nextHop !== currentNode.id) {
        currentNode = nodesArray.find(n => n.id === currentNode.routingTable[targetId].nextHop); // Change from name to id
        path.push(currentNode.id);
    }

    // Highlight the path
    for (let i = 0; i < path.length - 1; i++) {
        const linkToHighlight = links.find(link =>
            (link.source === path[i] && link.target === path[i + 1]) ||
            (link.source === path[i + 1] && link.target === path[i])
        );

        if (linkToHighlight) {
            dynamicGraphSvg.selectAll(".link")
                .filter(d => (d.source === linkToHighlight.source && d.target === linkToHighlight.target) ||
                             (d.source === linkToHighlight.target && d.target === linkToHighlight.source))
                .attr("stroke", "yellow") // Change to distinct highlight color
                .attr("stroke-width", 4);
        }
    }

    console.log("Highlighted path: ", path);
}

// Initialize nodes and neighbors
let nodesArray = [];
nodes.forEach(node => {
    const newNode = new Node(node.id, node.region);
    nodesArray.push(newNode);
});

// Add neighbors based on links
links.forEach(link => {
    const sourceNode = nodesArray.find(n => n.id === link.source);
    const targetNode = nodesArray.find(n => n.id === link.target);
    sourceNode.addNeighbor(targetNode);
});

// Periodically update routing tables (mock update for demonstration)
setInterval(() => {
    nodesArray.forEach(node => {
        node.neighbors.forEach(neighborId => {
            const neighborNode = nodesArray.find(n => n.id === neighborId);
            if (neighborNode) {
                if (node.updateRoutingTable(neighborNode)) {
                    console.log(`Routing table updated for ${node.id}`);
                }
            }
        });
    });
}, 5000); // Update every 5 seconds

// Run simulation on button click
document.getElementById("runSimulationButton").onclick = function() {
    updateDynamicGraph();
    highlightShortestPath('A1', 'B2'); // Example: Highlight path from A1 to B2
};

// Draw the initial graph
updateDynamicGraph();

