// Graph structure: nodes and links
const graph = {
    nodes: [
        { id: 'A', x: 150, y: 150 }, { id: 'B', x: 300, y: 150 },
        { id: 'C', x: 450, y: 150 }, { id: 'D', x: 600, y: 150 },
        { id: 'E', x: 225, y: 300 }, { id: 'F', x: 375, y: 300 },
        { id: 'G', x: 525, y: 300 }, { id: 'H', x: 675, y: 300 }
    ],
    links: [
        { source: 'A', target: 'B' }, { source: 'A', target: 'E' },
        { source: 'B', target: 'E' }, { source: 'B', target: 'G' },
        { source: 'B', target: 'C' }, { source: 'B', target: 'F' },
        { source: 'C', target: 'B' }, { source: 'C', target: 'E' },
        { source: 'C', target: 'D' }, { source: 'C', target: 'H' },
        { source: 'D', target: 'C' }, { source: 'D', target: 'E' },
        { source: 'E', target: 'A' }, { source: 'E', target: 'B' },
        { source: 'E', target: 'C' }, { source: 'E', target: 'D' },
        { source: 'E', target: 'F' }, { source: 'F', target: 'B' },
        { source: 'F', target: 'G' }, { source: 'G', target: 'B' },
        { source: 'G', target: 'F' }, { source: 'H', target: 'C' }
    ]
};

const svgOriginal = d3.select("#originalGraph");
const svgMultidestination = d3.select("#multidestinationGraph");

const multidestinationStepDescriptions = [
    "Step 1: Start at node A, routing to B.",
    "Step 2: Continue from A to C.",
    "Step 3: Continue from A to D.",
    "Step 4: Routing to E from B.",
    "Step 5: Routing to F from C.",
    "Step 6: Routing to G from D."
];

let currentMultidestinationStep = 0; // Initialize the step variable

// Draw the original graph (nodes and links)
function drawOriginalGraph() {
    svgOriginal.selectAll("*").remove(); // Clear previous drawings

    svgOriginal.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => graph.nodes.find(node => node.id === d.source).x)
        .attr("y1", d => graph.nodes.find(node => node.id === d.source).y)
        .attr("x2", d => graph.nodes.find(node => node.id === d.target).x)
        .attr("y2", d => graph.nodes.find(node => node.id === d.target).y);

    const nodes = svgOriginal.selectAll(".node")
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

// Draw the multidestination graph
function drawMultidestinationGraph() {
    svgMultidestination.selectAll("*").remove(); // Clear previous drawings

    // Draw initial links
    svgMultidestination.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => graph.nodes.find(n => n.id === d.source).x)
        .attr("y1", d => graph.nodes.find(n => n.id === d.source).y)
        .attr("x2", d => graph.nodes.find(n => n.id === d.target).x)
        .attr("y2", d => graph.nodes.find(n => n.id === d.target).y)
        .attr("stroke", "gray");

    const node = svgMultidestination.append("g")
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

function updateMultidestinationGraph(step) {
    svgMultidestination.selectAll(".highlighted-link").remove(); // Clear previous highlights

    let highlightedLinks = [];
    
    switch (step) {
        case 0:
            highlightedLinks = [{ source: 'A', target: 'B' }];
            break;
        case 1:
            highlightedLinks = [{ source: 'A', target: 'C' }];
            break;
        case 2:
            highlightedLinks = [{ source: 'A', target: 'D' }];
            break;
        case 3:
            highlightedLinks = [{ source: 'B', target: 'E' }];
            break;
        case 4:
            highlightedLinks = [{ source: 'C', target: 'F' }];
            break;
        case 5:
            highlightedLinks = [{ source: 'D', target: 'G' }];
            break;
    }

    // Draw highlighted links
    const highlighted = svgMultidestination.append("g")
        .attr("class", "highlighted-links");

    highlighted.selectAll("line")
        .data(highlightedLinks)
        .enter().append("line")
        .attr("class", "highlighted-link")
        .attr("x1", d => graph.nodes.find(n => n.id === d.source).x)
        .attr("y1", d => graph.nodes.find(n => n.id === d.source).y)
        .attr("x2", d => graph.nodes.find(n => n.id === d.target).x)
        .attr("y2", d => graph.nodes.find(n => n.id === d.target).y);
}

// Event listeners for buttons
document.getElementById("multidestinationBtn").addEventListener("click", () => {
    currentMultidestinationStep = 0;
    drawMultidestinationGraph();
    updateMultidestinationGraph(currentMultidestinationStep);
    document.getElementById("multidestinationDescription").innerText = multidestinationStepDescriptions[currentMultidestinationStep];
});

document.getElementById("multidestinationNextStepBtn").addEventListener("click", () => {
    if (currentMultidestinationStep < multidestinationStepDescriptions.length - 1) {
        currentMultidestinationStep++;
        updateMultidestinationGraph(currentMultidestinationStep);
        document.getElementById("multidestinationDescription").innerText = multidestinationStepDescriptions[currentMultidestinationStep];
    }
});

document.getElementById("multidestinationBackStepBtn").addEventListener("click", () => {
    if (currentMultidestinationStep > 0) {
        currentMultidestinationStep--;
        updateMultidestinationGraph(currentMultidestinationStep);
        document.getElementById("multidestinationDescription").innerText = multidestinationStepDescriptions[currentMultidestinationStep];
    }
});

// Initial drawing of the original graph
drawOriginalGraph();

