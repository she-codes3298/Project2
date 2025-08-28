const graph = {
    nodes: [
        { id: 'A', x: 150, y: 150 }, { id: 'B', x: 300, y: 150 },
        { id: 'C', x: 450, y: 150 }, { id: 'D', x: 600, y: 150 },
        { id: 'E', x: 225, y: 300 }, { id: 'F', x: 375, y: 300 },
        { id: 'G', x: 525, y: 300 }, { id: 'H', x: 675, y: 300 }
    ],
    links: [
        { source: 'A', target: 'B' }, { source: 'A', target: 'E' },
        { source: 'B', target: 'C' }, { source: 'B', target: 'E' },
        { source: 'B', target: 'G' }, { source: 'B', target: 'F' },
        { source: 'C', target: 'D' }, { source: 'C', target: 'E' },
        { source: 'C', target: 'H' }, { source: 'D', target: 'C' },
        { source: 'D', target: 'E' }, { source: 'E', target: 'A' },
        { source: 'E', target: 'B' }, { source: 'E', target: 'C' },
        { source: 'E', target: 'D' }, { source: 'E', target: 'F' },
        { source: 'F', target: 'B' }, { source: 'F', target: 'G' },
        { source: 'G', target: 'B' }, { source: 'G', target: 'F' },
        { source: 'H', target: 'C' }
    ]
};

const svg = d3.select("#originalGraph");

const spanningTreeStepDescriptions = [
    "Step 1: Start at node A, connecting to B and E.",
    "Step 2: Connect from B to C.",
    "Step 3: Connect from E to F.",
    "Step 4: Connect from C to D.",
    "Step 5: Connect from F to G.",
    "Step 5: Connect from C to H.",
    "Final Step: Complete Spanning Tree Highlighted."
];

let currentSpanningTreeStep = 0; // Initialize the step variable

// Draw the original graph (nodes and links)
function drawOriginalGraph() {
    svg.selectAll("*").remove(); // Clear previous drawings

    svg.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => graph.nodes.find(node => node.id === d.source).x)
        .attr("y1", d => graph.nodes.find(node => node.id === d.source).y)
        .attr("x2", d => graph.nodes.find(node => node.id === d.target).x)
        .attr("y2", d => graph.nodes.find(node => node.id === d.target).y);

    const nodes = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodes.append("circle")
        .attr("r", 15);

    nodes.append("text")
        .attr("dy", 4)
        .attr("text-anchor", "middle")
        .text(d => d.id);
}

// Draws the spanning tree graph
function drawSpanningTreeGraph() {
    const svg = d3.select("#spanningTreeGraph");
    svg.selectAll("*").remove(); // Clear previous drawings

    // Draw initial links (could be the entire graph, adjust as needed)
    svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links) // Adjust this to draw only spanning tree links if necessary
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => graph.nodes.find(n => n.id === d.source).x)
        .attr("y1", d => graph.nodes.find(n => n.id === d.source).y)
        .attr("x2", d => graph.nodes.find(n => n.id === d.target).x)
        .attr("y2", d => graph.nodes.find(n => n.id === d.target).y)
        .attr("stroke", "gray");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("r", 15)
        .attr("fill", "#69b3a2")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

    node.append("text").text(d => d.id)
        .attr('x', 18)
        .attr('y', 5);
}

function updateSpanningTreeGraph(step) {
    const svg = d3.select("#spanningTreeGraph");
    svg.selectAll(".highlighted-links").remove(); // Clear previous highlights

    let highlightedLinks = [];
    if (step === 0) {
        highlightedLinks = [{ source: 'A', target: 'B' }, { source: 'A', target: 'E' }];
    } else if (step === 1) {
        highlightedLinks = [{ source: 'B', target: 'C' }];
    } else if (step === 2) {
        highlightedLinks = [{ source: 'E', target: 'F' }];
    } else if (step === 3) {
        highlightedLinks = [{ source: 'C', target: 'D' }];
    } else if (step === 4) {
        highlightedLinks = [{ source: 'F', target: 'G' }];
    } else if (step === 4) {
        highlightedLinks = [{ source: 'C', target: 'H' }];
        }
    
    else if (step === spanningTreeStepDescriptions.length - 1) {
        // Final step - show all highlighted links
        highlightedLinks = [
            { source: 'A', target: 'B' }, { source: 'A', target: 'E' },
            { source: 'B', target: 'C' }, { source: 'E', target: 'F' },
            { source: 'C', target: 'D' }, { source: 'F', target: 'G' },
            { source: 'C', target: 'H' }
        ];
    }

    // Draw highlighted links
    const highlighted = svg.append("g")
        .attr("class", "highlighted-links");

    highlighted.selectAll("line")
        .data(highlightedLinks)
        .enter().append("line")
        .attr("class", "highlighted-link")
        .attr("x1", d => graph.nodes.find(n => n.id === d.source).x)
        .attr("y1", d => graph.nodes.find(n => n.id === d.source).y)
        .attr("x2", d => graph.nodes.find(n => n.id === d.target).x)
        .attr("y2", d => graph.nodes.find(n => n.id === d.target).y)
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    // Update description
    d3.select("#spanningTreeDescription").text(spanningTreeStepDescriptions[step]);
}

// Event listeners
document.getElementById('spanningTreeBtn').onclick = function() {
    currentSpanningTreeStep = 0; // Reset step count
    drawSpanningTreeGraph(); // Draw initial spanning tree graph
    updateSpanningTreeGraph(currentSpanningTreeStep); // Display the first step
};

document.getElementById('spanningTreeNextStepBtn').onclick = function() {
    if (currentSpanningTreeStep < spanningTreeStepDescriptions.length - 1) {
        currentSpanningTreeStep++;
        updateSpanningTreeGraph(currentSpanningTreeStep); // Update for the next step
    }
};

document.getElementById('spanningTreeBackStepBtn').onclick = function() {
    if (currentSpanningTreeStep > 0) {
        currentSpanningTreeStep--;
        updateSpanningTreeGraph(currentSpanningTreeStep); // Update for the previous step
    }
};

// Initial drawing of the graphs
drawOriginalGraph(); // Ensure this is called to draw the original graph on page load

