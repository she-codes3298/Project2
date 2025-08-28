let nodes = [];
    let links = [];
    let stepDescriptions = [];
    let currentStep = 0;
    let floodingSteps = [];

    const staticGraphSvg = d3.select("#static-graph").append("svg")
        .attr("width", "100%")
        .attr("height", 400);
    const dynamicGraphSvg = d3.select("#dynamic-graph").append("svg")
        .attr("width", "100%")
        .attr("height", 400);

    document.getElementById("generate-graph").addEventListener("click", () => {
        const nodesInput = document.getElementById("nodes-input").value.trim();
        const linksInput = document.getElementById("links-input").value.trim();

        if (!nodesInput || !linksInput) {
            alert("Please enter both nodes and links.");
            return;
        }

        // Parse nodes
        nodes = nodesInput.split(',').map((id, index) => ({
            id: id.trim(),
            x: 100 + index * 100,
            y: 100 + (index % 2) * 200
        }));

        // Parse links
        links = linksInput.split(';').map(link => {
            const [source, target] = link.trim().split(',');
            return { source: source.trim(), target: target.trim() };
        });

        staticGraphSvg.selectAll("*").remove();
        dynamicGraphSvg.selectAll("*").remove();

        // Update initiator dropdown
        const initiatorSelect = document.getElementById("initiator");
        initiatorSelect.innerHTML = nodes.map(node => `<option value="${node.id}">${node.id}</option>`).join('');
        initiatorSelect.selectedIndex = 0; // Select the first initiator by default

        drawGraph(staticGraphSvg, nodes, links);
        drawGraph(dynamicGraphSvg, nodes, links);
        initFlooding(); // Initialize flooding after graph generation
    });

    function drawGraph(svg, nodes, links) {
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

        svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 20)
            .attr("fill", "#4682b4");

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

    function initFlooding() {
    document.getElementById("start-flooding").disabled = false;

    // Get the elements for displaying the description
    const startFloodingButton = document.getElementById("start-flooding");
    const floodingDescription = document.getElementById("flooding-description");

    // Add event listener to the Start Flooding button
    startFloodingButton.addEventListener("click", () => {
        // Make the paragraph visible
        floodingDescription.style.display = "block";

        const initiatorId = document.getElementById("initiator").value;
        startFlooding(initiatorId);
    });
}


    function startFlooding(initiatorId) {
        const visited = new Set();
        const messageQueue = [{ node: initiatorId, from: null }]; // Start with the selected node

        // Reset everything for dynamic graph
        dynamicGraphSvg.selectAll("*").remove();
        drawGraph(dynamicGraphSvg, nodes, links);

        stepDescriptions = []; // Reset step descriptions
        currentStep = 0; // Reset current step
        floodingSteps = []; // Reset flooding steps

        // Execute flooding but store each step
        while (messageQueue.length > 0) {
            const { node: currentNode, from } = messageQueue.shift();

            if (!visited.has(currentNode)) {
                visited.add(currentNode);

                // Store the current step for later use
                floodingSteps.push({ node: currentNode, from });

                // Add neighboring nodes (except the one we came from) to the message queue
                links.forEach(link => {
                    if (link.source === currentNode && link.target !== from) {
                        messageQueue.push({ node: link.target, from: currentNode });
                    } else if (link.target === currentNode && link.source !== from) {
                        messageQueue.push({ node: link.source, from: currentNode });
                    }
                });
            }
        }

        // Initialize step descriptions
        floodingSteps.forEach(({ node, from }) => {
            stepDescriptions.push(`Packet arrived at ${node} from ${from || "N/A"}`);
        });

        // Enable step buttons and display the first step
        document.getElementById("backStep").disabled = false;
        document.getElementById("nextStep").disabled = false;
        updateStep(0); // Start with step 0
    }

    function updateStep(stepIndex) {
        const { node: currentNode, from } = floodingSteps[stepIndex];

        // Clear previous highlights
        dynamicGraphSvg.selectAll(".node").attr("fill", "#4682b4");
        dynamicGraphSvg.selectAll(".link").attr("stroke", "#bbb").attr("stroke-width", 2);

        // Highlight the current node
        dynamicGraphSvg.selectAll(".node")
            .filter(d => d.id === currentNode)
            .attr("fill", "orange");

        // Highlight the link from which the packet arrived
        if (from) {
            dynamicGraphSvg.selectAll(".link")
                .filter(d => (d.source === from && d.target === currentNode) || (d.source === currentNode && d.target === from))
                .attr("stroke", "#ffa500")
                .attr("stroke-width", 4);
        }

        // Update the description for the current step
        document.getElementById("description").textContent = stepDescriptions[stepIndex];
    }

    document.getElementById("nextStep").addEventListener("click", () => {
        if (currentStep < floodingSteps.length - 1) {
            currentStep++;
            updateStep(currentStep);
        }
    });

    document.getElementById("backStep").addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            updateStep(currentStep);
        }
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

        // Ensure there are at least two lines for nodes and links
        if (lines.length >= 2) {
            const nodesInput = lines[0].trim(); // First line for nodes
            const linksInput = lines[1].trim(); // Second line for links

            // Set the values of the input boxes
            document.getElementById('nodes-input').value = nodesInput; // Correct ID
            document.getElementById('links-input').value = linksInput; // Correct ID

            // Call the generate graph logic
            document.getElementById('generate-graph').click(); // Simulate click on generate graph button
        } else {
            alert('The file format is incorrect. Please provide at least two lines: one for nodes and one for edges.');
        }
    };

    // Read the file as text
    reader.readAsText(file);
}



