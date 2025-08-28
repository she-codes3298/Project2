let nodes = [];
let links = [];
let stepIndex = 0;
let steps = [];

const staticSvg = d3.select("#static-graph");
const dynamicSvg = d3.select("#dynamic-graph");

// Function to draw the graph
function drawGraph(svg, nodes, links, showWeights = false) {
    svg.selectAll("*").remove(); // Clear the previous graph

    const linkSelection = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => nodes.find(n => n.id === d.source).x)
        .attr("y1", d => nodes.find(n => n.id === d.source).y)
        .attr("x2", d => nodes.find(n => n.id === d.target).x)
        .attr("y2", d => nodes.find(n => n.id === d.target).y);

    if (showWeights) {
        svg.selectAll(".link-label")
            .data(links)
            .enter()
            .append("text")
            .attr("class", "link-label")
            .attr("x", d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
            .attr("y", d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2)
            .attr("dy", -10)
            .attr("text-anchor", "middle")
            .text(d => d.weight);
    }

    const nodeSelection = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 20);

    svg.selectAll(".node-label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "node-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text(d => d.id);

    // Add distance labels
    svg.selectAll(".distance-label")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "distance-label")
        .attr("x", d => d.x)
        .attr("y", d => d.y - 22) // Position above the node
        .attr("text-anchor", "middle")
        .text(d => (d.distance !== undefined) ? d.distance : '∞'); // Display '∞' if distance is undefined
}

// Function to generate unique random positions
function getRandomPosition(existingPositions, radius) {
    const maxTries = 100;
    let position;

    for (let tries = 0; tries < maxTries; tries++) {
        const x = Math.random() * (400 - 2 * radius) + radius; // Adjusted for smaller SVG
        const y = Math.random() * (400 - 2 * radius) + radius; // Adjusted for smaller SVG
        position = { x, y };

        // Check for overlaps
        const overlap = existingPositions.some(pos => {
            const dx = pos.x - position.x;
            const dy = pos.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 2 * radius; // Nodes should not overlap
        });

        if (!overlap) {
            return position;
        }
    }

    return position; // Fallback if no position is found after max tries
}

// Function to convert user input to nodes and links
function generateGraph() {
    const nodeInput = document.getElementById('node-input').value;
    const edgeInput = document.getElementById('edge-input').value;

    const nodeIds = nodeInput.split(',').map(id => id.trim());
    const positions = [];

    nodes = nodeIds.map(id => {
        const pos = getRandomPosition(positions, 25); // 25 is the radius
        positions.push(pos);
        return { id, ...pos, distance: undefined }; // Initialize distance as undefined
    });

    links = edgeInput.split(' ').map(edge => {
        const [nodes, weight] = edge.split(',');
        const [source, target] = nodes.split('-');
        return { source: source.trim(), target: target.trim(), weight: parseInt(weight) };
    });

    // Draw static graph
    drawGraph(staticSvg, nodes, links, true);

    // Draw dynamic graph
    drawGraph(dynamicSvg, nodes, links, true);
}

// Dijkstra's algorithm with step recording
function dijkstraWithSteps(nodes, links, startId, destinationId) {
    steps = []; // Reset steps for each algorithm run
    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes.map(n => n.id));

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        node.distance = Infinity; // Reset distance for dynamic graph
    });
    distances[startId] = 0;
    nodes.find(n => n.id === startId).distance = 0; // Update distance for start node

    steps.push({
        type: 'update-distance-label',
        nodeId: startId,
        newDistance: 0,
        description: `Start at node ${startId}. Distance initialized to 0.`
    });

    while (unvisited.size) {
        const currentId = Array.from(unvisited)
            .reduce((closest, nodeId) => distances[nodeId] < distances[closest] ? nodeId : closest);

        unvisited.delete(currentId);
        const currentNode = nodes.find(n => n.id === currentId);
        currentNode.distance = distances[currentId]; // Update current node's distance

        steps.push({
            type: 'visit-node',
            nodeId: currentId,
            description: `Visiting node ${currentId}, with current shortest distance ${distances[currentId]}.`
        });

        links.filter(link => link.source === currentId || link.target === currentId)
            .forEach(link => {
                const neighborId = link.source === currentId ? link.target : link.source;
                if (unvisited.has(neighborId)) {
                    const alt = distances[currentId] + link.weight;
                    if (alt < distances[neighborId]) {
                        distances[neighborId] = alt;
                        previous[neighborId] = currentId;

                        steps.push({
                            type: 'update-distance',
                            nodeId: neighborId,
                            newDistance: alt,
                            description: `Updating distance for node ${neighborId} to ${alt}.`
                        });

                        // Update node distance in dynamic SVG
                        const neighborNode = dynamicSvg.selectAll('.distance-label')
                            .filter(d => d.id === neighborId);
                        neighborNode.text(alt); // Update distance label for the neighbor

                        // Record the step for updating distance labels
                        steps.push({
                            type: 'update-distance-label',
                            nodeId: neighborId,
                            newDistance: alt,
                            description: `Updated displayed distance for node ${neighborId} to ${alt}.`
                        });
                    }
                }
            });
    }

    // Find the shortest path
    const path = [];
    let currentNode = destinationId;
    while (previous[currentNode]) {
        path.unshift([currentNode, previous[currentNode]]);
        currentNode = previous[currentNode];
    }

    path.forEach(([from, to]) => {
        steps.push({
            type: 'highlight-path',
            from: to,
            to: from,
            description: `Highlighting shortest path from ${to} to ${from}.`
        });
    });
}

// Add event listeners for button clicks
document.getElementById('generate-graph').addEventListener('click', generateGraph);
document.getElementById('run-algorithm').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    dijkstraWithSteps(nodes, links, source, destination);
});

// Next step functionality
document.getElementById('next-step').addEventListener('click', () => {
    if (stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    document.querySelector('.step-description').textContent = step.description;

    if (step.type === 'visit-node') {
        dynamicSvg.selectAll('.node')
            .filter(d => d.id === step.nodeId)
            .classed('visited-node', true);
    } else if (step.type === 'update-distance-label') {
        dynamicSvg.selectAll('.distance-label')
            .filter(d => d.id === step.nodeId)
            .text(step.newDistance);
    } else if (step.type === 'highlight-path') {
        dynamicSvg.selectAll('.link')
            .filter(d => (d.source === step.from && d.target === step.to) || (d.source === step.to && d.target === step.from))
            .classed('path-highlight', true);
    }

    stepIndex++;
});
// Event listener for "Generate Graph from File" button
document.getElementById('generate-graph-from-file').addEventListener('click', () => {
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
}




