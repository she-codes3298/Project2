document.addEventListener("DOMContentLoaded", function () {
    const navbarHTML = `
        <header class="navbar">
            <div class="logo">Routing Algorithms</div>
            <nav>
                <ul>
                    <li><a class="nav_link" href="/home/rupali/project2/dijkstra_algo/index.html">Dijkstra</a></li>
                    <li><a class="nav_link" href="/home/rupali/project2/multi-state_routing/index.html">Multicast</a></li>
                    <li><a class="nav_link" href="/home/rupali/project2/flooding/index.html">Flooding</a></li>
                    <li><a class="nav_link" href="/home/rupali/project2/link-state_routing/index.html">Link State</a></li>
                    <li><a class="nav_link" href="/home/rupali/project2/broad-cast_routing/index.html">Broadcast</a></li>
                    <li><a class="nav_link" href="/home/rupali/project2/distance-vector_routing/index.html">Distance Vector</a></li>
                    <li><a class="nav_link" href="/home/rupali/project2/hierarchical-routing/index.html">Hierarchical Routing</a></li>
                </ul>
            </nav>
        </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    const navLinks = document.querySelectorAll('.nav_link');
    const currentPath = window.location.pathname;

    // Loop through the nav links and add 'active' class to the matching link
    navLinks.forEach(link => {
        // Compare the currentPath with the link's href directly
        const linkPath = link.getAttribute('href');

        // Ensure correct path handling
        if (currentPath.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });
});

