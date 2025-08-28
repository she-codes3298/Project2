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
class Node {
    constructor(name, region) {
        this.name = name;
        this.region = region;
        this.routingTable = {};
        this.neighbors = {};
        // Initialize self routing
        this.routingTable[name] = { hops: 0, nextHop: name }; 
    }

    addNeighbor(neighbor) {
        // Each neighbor counts as one hop
        this.neighbors[neighbor.name] = 1; 
        this.routingTable[neighbor.name] = { hops: 1, nextHop: neighbor.name }; 
        console.log(`${this.name} added neighbor ${neighbor.name} with initial hops of 1.`);
    }

    updateRoutingTable(neighbor) {
        let updated = false;
        console.log(`Updating routing table for ${this.name} from neighbor ${neighbor.name}`);
        
        for (let destination in neighbor.routingTable) {
            // Calculate new hops count
            let newHops = this.neighbors[neighbor.name] + neighbor.routingTable[destination].hops; 
            console.log(`Checking destination ${destination}: new hops = ${newHops}`);

            // If new hops are smaller or destination isn't in the table yet, update
            if (!this.routingTable[destination] || newHops < this.routingTable[destination].hops) {
                this.routingTable[destination] = { hops: newHops, nextHop: neighbor.name };
                updated = true;
                console.log(`${this.name} updated route to ${destination}: ${newHops} hops, next hop ${neighbor.name}`);
            }
        }
        return updated;
    }

    updateRoutingTableForRegion(neighbor) {
        let updated = false;
        if (neighbor.region !== this.region) {
            const regionEntry = `Region ${neighbor.region.split(' ')[1]}`; 
            const newHops = (this.neighbors[neighbor.name] || 0) + 1; 

            // Update if this is a better route
            if (!this.routingTable[regionEntry] || newHops < this.routingTable[regionEntry].hops) {
                this.routingTable[regionEntry] = { hops: newHops, nextHop: neighbor.name };
                updated = true;
                console.log(`${this.name} updated route to ${regionEntry}: ${newHops} hops, next hop ${neighbor.name}`);
            }
        }
        return updated;
    }

    broadcast(neighbors, interRegionOnly = false) {
        neighbors.forEach(neighbor => {
            if (interRegionOnly) {
                // Update routing table for neighboring region
                if (this.updateRoutingTableForRegion(neighbor)) {
                    console.log(`${this.name} updated routing table for neighboring region ${neighbor.region}`);
                }
            } else {
                // Update routing table for neighbors
                if (this.updateRoutingTable(neighbor)) {
                    console.log(`${this.name} updated routing table from ${neighbor.name}`);
                }
            }
        });
    }

    printRoutingTable() {
        const table = this.routingTable;
        let html = `<h4>Routing table for ${this.name}</h4><table>`;
        html += "<tr><th>Dest</th><th>Hops</th><th>Next Hop</th></tr>";
        for (const destination in table) {
            html += `<tr><td>${destination}</td><td>${table[destination].hops}</td><td>${table[destination].nextHop}</td></tr>`;
        }
        html += "</table>";
        document.getElementById(`table-${this.name}`).innerHTML = html;
    }
}

// Initialize nodes
const A1 = new Node('A1', 'Region 1');
const A2 = new Node('A2', 'Region 1');
const B1 = new Node('B1', 'Region 2');
const B2 = new Node('B2', 'Region 2');
const C1 = new Node('C1', 'Region 3');
const C2 = new Node('C2', 'Region 3');

// Set up neighbors
A1.addNeighbor(A2);
A2.addNeighbor(A1);
B1.addNeighbor(B2);
B2.addNeighbor(B1);
C1.addNeighbor(C2);
C2.addNeighbor(C1);

// Array of nodes for processing
const nodesArray = [A1, A2, B1, B2, C1, C2];

// Steps for routing logic
const steps = [
    {
        description: "Step 1: Each node calculates its distance from its neighbors within the same region.",
        action: () => {
            // Intra-region broadcasts
            A1.broadcast([A2]);
            A2.broadcast([A1]);
            B1.broadcast([B2]);
            B2.broadcast([B1]);
            C1.broadcast([C2]);
            C2.broadcast([C1]);
            
            nodesArray.forEach(node => node.printRoutingTable());
            updateDynamicGraph();
        }
    },
    {
        description: "Step 2: Nodes calculate the distances to neighboring regions.",
        action: () => {
            // Inter-region broadcasts
            A2.broadcast([B1], true);  // A2 to B1 (Region 1 to 2)
            B1.broadcast([A2, B2], true); // B1 to A2 and B2
            B2.broadcast([B1, C1], true);  // B2 to B1 and C1
            C1.broadcast([B2], true); // C1 to B2
            
            // Ensure A1 and A2 update for Region 3
            A1.broadcast([C1], true); // A1 to C1 (Region 1 to 3)
            A2.broadcast([C1], true); // A2 to C1 (Region 1 to 3)
            
            // Ensure C1 and C2 update for Region 1
            C1.broadcast([A1, A2], true); // C1 to A1 and A2 (Region 3 to 1)

            nodesArray.forEach(node => node.printRoutingTable());
            updateDynamicGraph();
        }
    }
];

// Event binding for step navigation
document.getElementById('next-step').addEventListener('click', nextStep);
function nextStep() {
    currentStep = (currentStep + 1) % steps.length; 
    document.getElementById('step-description').innerText = steps[currentStep].description; 
    steps[currentStep].action(); 
}

// Initial setup to show the first step description only
document.getElementById('step-description').innerText = steps[currentStep].description;

