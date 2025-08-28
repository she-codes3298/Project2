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


// Broadcasting Algorithms

function pointToPointTransmission(nodes, links, sourceId) {
    steps = [];
    nodes.forEach(node => {
        if (node.id !== sourceId) {
            steps.push({
                type: 'visit-node',
                nodeId: node.id,
                description: `Point-to-point message from ${sourceId} to ${node.id}.`
            });
        }
    });
    stepIndex = 0;
}

function floodingAlgorithm(nodes, links, sourceId) {
    const visited = new Set();
    const queue = [sourceId];
    steps = [];

    while (queue.length > 0) {
        const currentId = queue.shift();
        visited.add(currentId);

        steps.push({
            type: 'visit-node',
            nodeId: currentId,
            description: `Flooding: Node ${currentId} broadcasting to its neighbors.`
        });

        links.filter(link => link.source.id === currentId || link.target.id === currentId)
            .forEach(link => {
                const neighborId = link.source.id === currentId ? link.target.id : link.source.id;
                if (!visited.has(neighborId)) {
                    queue.push(neighborId);
                    visited.add(neighborId);
                }
            });
    }
    stepIndex = 0;
}


// Handle Next Step
document.getElementById('next-step').addEventListener('click', () => {
    if (stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    document.querySelector('.step-description').textContent = step.description;

    if (step.type === 'visit-node') {
        d3.select("#dynamic-graph").selectAll('circle')
            .filter(d => d.id === step.nodeId)
            .classed('visited-node', true);
    }

    stepIndex++;
});

// Event listeners for algorithm buttons
document.getElementById('generate-graph').addEventListener('click', generateGraph);

document.getElementById('point-to-point').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    pointToPointTransmission(nodes, links, source);
});

document.getElementById('flooding').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    floodingAlgorithm(nodes, links, source);
});

// Add similar event listeners for other algorithms...


// Spanning Tree algorithm (simplified example)
function spanningTreeAlgorithm(nodes, links, startId) {
    steps = [];
    const visited = new Set();
    const queue = [startId];
    const spanningTreeEdges = [];
    
    visited.add(startId);

    while (queue.length > 0) {
        const currentId = queue.shift();

        // Process current node
        steps.push({
            type: 'visit-node',
            nodeId: currentId,
            description: `Spanning Tree: Node ${currentId} processing.`
        });

        links.filter(link => link.source === currentId || link.target === currentId)
            .forEach(link => {
                const neighborId = link.source === currentId ? link.target : link.source;
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    spanningTreeEdges.push(link);  // Add edge to the spanning tree
                    queue.push(neighborId);

                    steps.push({
                        type: 'visit-node',
                        nodeId: neighborId,
                        description: `Node ${neighborId} added to the spanning tree.`
                    });
                }
            });
    }

    // Optionally: visualize spanning tree edges
    spanningTreeEdges.forEach(edge => {
        steps.push({
            type: 'visit-edge',
            source: edge.source,
            target: edge.target,
            description: `Edge from ${edge.source} to ${edge.target} is part of the spanning tree.`
        });
    });

    stepIndex = 0;
}


// Function to handle the next step in the algorithm
document.getElementById('next-step').addEventListener('click', () => {
    if (stepIndex >= steps.length) return;
    
    const step = steps[stepIndex];
    document.querySelector('.step-description').textContent = step.description;

    if (step.type === 'visit-node') {
        d3.select("#dynamic-graph").selectAll('.node')
            .filter(d => d.id === step.nodeId)
            .classed('broadcasted-node', true);
    }

    stepIndex++;
});

// Event listeners for algorithm buttons
document.getElementById('generate-graph').addEventListener('click', generateGraph);

document.getElementById('point-to-point').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    pointToPointTransmission(nodes, links, source);
});

document.getElementById('flooding').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    floodingAlgorithm(nodes, links, source);
});

document.getElementById('multi-destination').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    multiDestination(nodes, links, source);
});

document.getElementById('reverse-path').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    reversePathForwarding(nodes, links, source);
});

document.getElementById('spanning-tree').addEventListener('click', () => {
    const source = document.getElementById('source').value;
    spanningTreeAlgorithm(nodes, links, source);
});

