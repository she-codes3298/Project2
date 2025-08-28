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

        // Select the SVG container for the original graph
        const svg = d3.select("#originalGraph");

        // Create links
        svg.selectAll(".link")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", d => graph.nodes.find(node => node.id === d.source).x)
            .attr("y1", d => graph.nodes.find(node => node.id === d.source).y)
            .attr("x2", d => graph.nodes.find(node => node.id === d.target).x)
            .attr("y2", d => graph.nodes.find(node => node.id === d.target).y);

        // Create nodes
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

        // Point-to-point transmission implementation
        const svgAlgorithm = d3.select("#algorithmGraph");
        let currentStep = 0; // Step counter for transmission process

        // Define the path for point-to-point transmission from node A to all nodes
        const pointToPointPath = [
            { source: 'A', target: 'B' },
            { source: 'A', target: 'E' },
            { source: 'A', target: 'C' },
            { source: 'A', target: 'D' },
            { source: 'A', target: 'F' },
            { source: 'A', target: 'G' },
            { source: 'A', target: 'H' }
        ];

        // Function to clear the algorithm graph
        function clearAlgorithmGraph() {
            svgAlgorithm.selectAll("*").remove(); // Remove all existing elements
        }

        // Function to draw the nodes on the graph
        function drawNodes() {
            const nodesGroup = svgAlgorithm.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(graph.nodes)
                .enter().append("g")
                .attr("transform", d => `translate(${d.x},${d.y})`);

            // Append circles for nodes
            nodesGroup.append("circle")
                .attr("class", "node")
                .attr("r", 15)
                .attr("fill", "#69b3a2")
                .attr("stroke", "black")
                .attr("stroke-width", 1.5);

            // Append text for node labels
            nodesGroup.append("text")
                .text(d => d.id)
                .attr('x', 18)
                .attr('y', 5);
        }

        // Function to highlight the current step's path with transitions
        function highlightCurrentStep() {
            const pathSegment = [pointToPointPath[currentStep]]; // Get the current step's path
            svgAlgorithm.append("g")
                .selectAll("line")
                .data(pathSegment)
                .enter().append("line")
                .attr("class", "highlighted-link")
                .attr("x1", d => graph.nodes.find(n => n.id === d.source).x)
                .attr("y1", d => graph.nodes.find(n => n.id === d.source).y)
                .attr("x2", d => graph.nodes.find(n => n.id === d.target).x)
                .attr("y2", d => graph.nodes.find(n => n.id === d.target).y)
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .transition()
                .duration(500)
                .attr("stroke-width", 3); // Smooth transition
        }

        // Function to handle the point-to-point transmission process for the current step
        function pointToPointTransmission() {
            clearAlgorithmGraph(); // Clear previous visuals
            drawNodes(); // Draw nodes on the graph
            highlightCurrentStep(); // Highlight the current step's path
            updateStepDescription(); // Update the description text
        }

        // Function to update the step description
        function updateStepDescription() {
            document.getElementById("stepDescription").innerText = `Point-to-Point Transmission: Step ${currentStep + 1} from node A to ${pointToPointPath[currentStep].target}.`;
        }

        // Event listener for the Next button
        document.getElementById('nextStepBtn').addEventListener('click', function() {
            if (currentStep < pointToPointPath.length - 1) {
                currentStep++; // Move to the next step
                pointToPointTransmission(); // Redraw for the new step
            }
        });

        // Event listener for the Back button
        document.getElementById('backStepBtn').addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--; // Move back to the previous step
                pointToPointTransmission(); // Redraw for the previous step
            }
        });

        // Event listener for the Point-to-Point button
        document.getElementById('pointToPointBtn').addEventListener('click', function() {
            currentStep = 0; // Reset step counter
            pointToPointTransmission(); // Start the visualization
        });
        
        
  // Navbar functionality
document.addEventListener("DOMContentLoaded", function() {
    // Fetch the navbar HTML and insert it into the #navbar div
    fetch("navbar.html")  // Ensure this path is correct relative to your project structure
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar").innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
});

