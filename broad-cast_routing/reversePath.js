// reversePathForwarding.js
const reversePathGraph = {
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

function drawReversePathGraph() {
    const svg = d3.select("#reversePathGraph");

    svg.selectAll("*").remove(); // Clear previous drawings

    // Draw links
    svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(reversePathGraph.links)
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => reversePathGraph.nodes.find(n => n.id === d.source).x)
        .attr("y1", d => reversePathGraph.nodes.find(n => n.id === d.source).y)
        .attr("x2", d => reversePathGraph.nodes.find(n => n.id === d.target).x)
        .attr("y2", d => reversePathGraph.nodes.find(n => n.id === d.target).y);

    // Draw nodes
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(reversePathGraph.nodes)
        .enter().append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle").attr("r", 15); // Increased circle size for visibility
    node.append("text").text(d => d.id).attr('x', 18).attr('y', 5);

    document.getElementById('reversePathDescription').innerText = "Description of Reverse Path Forwarding.";
}

// Show/hide implementation based on button clicks
document.getElementById('reversePathBtn').addEventListener('click', () => {
    document.getElementById('reversePathContainer').style.display = 'block';
    document.getElementById('multiDestContainer').style.display = 'none';
    document.getElementById('spanningTreeContainer').style.display = 'none';
    drawReversePathGraph();
});

