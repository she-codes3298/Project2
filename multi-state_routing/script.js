 const nodes = [
            { id: 'A', x: 150, y: 100 },
            { id: 'B', x: 300, y: 70 },
            { id: 'C', x: 300, y: 130 },
            { id: 'D', x: 150, y: 250 },
            { id: 'E', x: 300, y: 210 },
            { id: 'F', x: 450, y: 100 },
            { id: 'G', x: 450, y: 250 },
            { id: 'H', x: 300, y: 350 },
            { id: 'I', x: 450, y: 350 },
            { id: 'J', x: 600, y: 210 },
            { id: 'K', x: 600, y: 350 }
        ];

        const links = [
            { source: 'A', target: 'C' },
            { source: 'A', target: 'B' },
            { source: 'A', target: 'D' },
            { source: 'B', target: 'C' },
            { source: 'D', target: 'E' },
            { source: 'C', target: 'E' },
            { source: 'E', target: 'H' },
            { source: 'E', target: 'G' },
            { source: 'G', target: 'I' },
            { source: 'G', target: 'F' },
            { source: 'G', target: 'J' },
            { source: 'H', target: 'I' },
            { source: 'I', target: 'K' },
            { source: 'I', target: 'J' },
            { source: 'K', target: 'J' }
        ];

        const group1 = ['B', 'D', 'E', 'H', 'I'];
        const group2 = ['B', 'D', 'C', 'G', 'J'];

        let currentStep = 0;

        const staticGraphSvg = d3.select("#static-graph");
        const dynamicGraphSvg = d3.select("#dynamic-graph");

        function drawGraph(svg, nodes, links, highlightGroups = false) {
            svg.selectAll("*").remove();

            // Draw links
            svg.selectAll(".link")
                .data(links)
                .enter()
                .append("line")
                .attr("class", "link")
                .attr("x1", d => nodes.find(n => n.id === d.source).x)
                .attr("y1", d => nodes.find(n => n.id === d.source).y)
                .attr("x2", d => nodes.find(n => n.id === d.target).x)
                .attr("y2", d => nodes.find(n => n.id === d.target).y);

            // Draw nodes
            svg.selectAll(".node")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", 20)
                .style("fill", d => highlightGroups && (group1.includes(d.id) || group2.includes(d.id)) ? "steelblue" : "gray");

            // Add node labels
            svg.selectAll(".node-label")
                .data(nodes)
                .enter()
                .append("text")
                .attr("class", "node-label")
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("dy", -30)
                .text(d => d.id);

            // Add group labels
            if (highlightGroups) {
                svg.selectAll(".group-label")
                    .data(nodes)
                    .enter()
                    .append("text")
                    .attr("class", "group-label")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .attr("dy", 35)
                    .text(d => {
                        if (group1.includes(d.id) && group2.includes(d.id)) return "Group 1 & 2";
                        else if (group1.includes(d.id)) return "Group 1";
                        else if (group2.includes(d.id)) return "Group 2";
                        return "";
                    });
            }
        }


        // Step actions
        const steps = [
            {
                description: "Step 1: Display the original graph with group numbers",
                action: () => drawGraph(staticGraphSvg, nodes, links, true)
            },
            {
                description: "Step 2: Display the spanning tree for multicast",
                action: () => {
                    const spanningTreeLinks = [
                        { source: 'A', target: 'B' },
                        { source: 'A', target: 'C' },
                        { source: 'A', target: 'D' },
                        { source: 'C', target: 'E' },
                        { source: 'E', target: 'H' },
                        { source: 'H', target: 'I' },
                        { source: 'I', target: 'G' },
                        { source: 'G', target: 'F' },
                        { source: 'I', target: 'K' },
                        { source: 'K', target: 'J' },
                    ];
                    drawGraph(dynamicGraphSvg, nodes, spanningTreeLinks);
                }
            },
            {
                description: "Step 3: Multicast graph for Group 1",
                action: () => {
                    const prunedTreeLinks = [
                        { source: 'A', target: 'B' },
                        { source: 'A', target: 'C' },
                        { source: 'A', target: 'D' },
                        { source: 'C', target: 'E' },
                        { source: 'E', target: 'H' },
                        { source: 'H', target: 'I' },
                    ];
                    drawGraph(dynamicGraphSvg, nodes, prunedTreeLinks);
                }
            },
            {
                description: "Step 4: Multicast graph for group 2",
                action: () => {
                    const finalTreeLinks = [
                        { source: 'A', target: 'B' },
                        { source: 'A', target: 'C' },
                        { source: 'A', target: 'D' },
                        { source: 'C', target: 'E' },
                        { source: 'E', target: 'H' },
                        { source: 'H', target: 'I' },
                        { source: 'I', target: 'G' },
                        { source: 'I', target: 'K' },
                        { source: 'K', target: 'J' },
                    ];
                    drawGraph(dynamicGraphSvg, nodes, finalTreeLinks);
                }
            },
            {
    description: "Step 5: Connect multicast graphs to switches and router",
    action: () => {
        // Clear the dynamic graph for the new drawing
        dynamicGraphSvg.selectAll("*").remove();

        // Draw multicast Group 1 with a switch
        dynamicGraphSvg.append("text")
            .attr("x", 300)
            .attr("y", 30)
            .text("Multicast Group 1");

        // Group 1 connections
        const group1Links = [
                        { source: 'A', target: 'B' },
                        { source: 'A', target: 'C' },
                        { source: 'A', target: 'D' },
                        { source: 'C', target: 'E' },
                        { source: 'E', target: 'H' },
                        { source: 'H', target: 'I' },
        ];

        // Draw Group 1 graph
        drawGraph(dynamicGraphSvg.append("g").attr("transform", "translate(50, 50)"), nodes, group1Links);

        // Draw switch for Group 1
        const switchGroup1 = dynamicGraphSvg.append("g").attr("transform", "translate(150, 500)");
        switchGroup1.append("rect")
            .attr("width", 100)
            .attr("height", 20)
            .attr("fill", "#f9e79f")
            .attr("stroke", "black");

        switchGroup1.append("text")
            .attr("x", 20)
            .attr("y", 15)
            .text("Switch 1");

        // Draw connection from node A to switch 1
        dynamicGraphSvg.append("line")
            .attr("class", "link")
            .attr("x1", 180) // Node A's x position
            .attr("y1", 500) // Node A's y position
            .attr("x2", 180) // Switch 1's x position
            .attr("y2", 150); // Switch's y position
            
        


        // Draw multicast Group 2 with a switch
        dynamicGraphSvg.append("text")
            .attr("x", 850) // Adjusted position for Group 2 label
            .attr("y", 30)
            .text("Multicast Group 2");

        // Group 2 connections
        const group2Links = [
                        { source: 'A', target: 'B' },
                        { source: 'A', target: 'C' },
                        { source: 'A', target: 'D' },
                        { source: 'C', target: 'E' },
                        { source: 'E', target: 'H' },
                        { source: 'H', target: 'I' },
                        { source: 'I', target: 'G' },
                        { source: 'I', target: 'K' },
                        { source: 'K', target: 'J' },
        ];

        // Draw Group 2 graph
        drawGraph(dynamicGraphSvg.append("g").attr("transform", "translate(600, 50)"), nodes, group2Links);

        // Draw switch for Group 2
        const switchGroup2 = dynamicGraphSvg.append("g").attr("transform", "translate(700, 500)");
        switchGroup2.append("rect")
            .attr("width", 100)
            .attr("height", 20)
            .attr("fill", "#f9e79f")
            .attr("stroke", "black");

        switchGroup2.append("text")
            .attr("x", 20)
            .attr("y", 15)
            .text("Switch 2");

        // Draw connection from Node A of Group 2 to Switch 2
        dynamicGraphSvg.append("line")
            .attr("class", "link")
            .attr("x1", 726) // This is still Node A's original position
            .attr("y1", 157) // This is still Node A's original position
            .attr("x2", 726) // Switch 2's x position
            .attr("y2", 500); // Switch's y position
            
            
            // Draw Router for Group 2
        const router = dynamicGraphSvg.append("g").attr("transform", "translate(500, 600)");
        router.append("rect")
            .attr("width", 100)
            .attr("height", 20)
            .attr("fill", "#73c6b6")
            .attr("stroke", "black");

        router.append("text")
            .attr("x", 20)
            .attr("y", 15)
            .text("ROUTER");
            
        dynamicGraphSvg.append("line")
          .attr("class", "link")
            .attr("x1", 500) // This is still Node A's original position
            .attr("y1", 600) // This is still Node A's original position
            .attr("x2", 250) // Switch 2's x position
            .attr("y2", 500); // Switch's y position
            
       dynamicGraphSvg.append("line")
          .attr("class", "link")
            .attr("x1", 580) // This is still Node A's original position
            .attr("y1", 600) // This is still Node A's original position
            .attr("x2", 700) // Switch 2's x position
            .attr("y2", 500); // Switch's y position

// draw internet box
    const internet = dynamicGraphSvg.append("g").attr("transform", "translate(500, 650)");
        internet.append("rect")
            .attr("width", 100)
            .attr("height", 20)
            .attr("fill", "#ec7063")
            .attr("stroke", "black");

        internet.append("text")
            .attr("x", 20)
            .attr("y", 15)
            .text("INTERNET");
            
        dynamicGraphSvg.append("line")
          .attr("class", "link")
            .attr("x1", 550) // This is still Node A's original position
            .attr("y1", 650) // This is still Node A's original position
            .attr("x2", 550) // Switch 2's x position
            .attr("y2", 610); // Switch's y position
            
            
      const host = dynamicGraphSvg.append("g").attr("transform", "translate(700, 650)");
        host.append("rect")
            .attr("width", 100)
            .attr("height", 20)
            .attr("fill", "lightgray")
            .attr("stroke", "black");

        host.append("text")
            .attr("x", 20)
            .attr("y", 15)
            .text("HOST");
            
        dynamicGraphSvg.append("line")
          .attr("class", "link")
            .attr("x1",600 ) // This is still Node A's original position
            .attr("y1", 660) // This is still Node A's original position
            .attr("x2", 700) // Switch 2's x position
            .attr("y2", 660); // Switch's y position
            
      
       
        
    }
},
 
   

 ];
 
        function updateStep() {
            steps[currentStep].action();
            d3.select("#step-description").text(steps[currentStep].description);
        }

       document.getElementById("next-step").onclick = () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep();
            }
        };

        document.getElementById("prev-step").onclick = () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep();
            }
        };
      

        updateStep(); // Initialize with the first step*/

