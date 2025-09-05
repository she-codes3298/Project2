# Routing Algorithms Visualization Hub

An interactive web-based platform for visualizing and understanding fundamental routing algorithms used in computer networking. This educational tool provides step-by-step visualizations of how different routing algorithms work, making complex networking concepts accessible and easy to understand.



## 📋 Table of Contents

- [Features](#features)
- [Supported Algorithms](#supported-algorithms)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [File Upload Format](#file-upload-format)
- [Algorithm Details](#algorithm-details)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 1. **Interactive Graph Generation**
- **Manual Input**: Enter nodes and links directly through user-friendly input fields
- **File Upload**: Upload graph data from text files for quick setup
- **Dynamic Visualization**: Real-time graph rendering with D3.js

### 2. **Step-by-Step Algorithm Visualization**
- **Interactive Controls**: Navigate through algorithm execution with Next/Previous step buttons
- **Visual Feedback**: Nodes and links change colors to show algorithm progress
- **Detailed Descriptions**: Each step includes explanatory text to enhance learning
- **Dual Graph View**: Compare static and dynamic states side by side

### 3. **Educational Content**
- **Algorithm Introductions**: Comprehensive explanations for each routing algorithm
- **Implementation Steps**: Detailed breakdown of how each algorithm works
- **Visual Learning**: Interactive demonstrations make complex concepts intuitive

## 🔧 Supported Algorithms

| Algorithm | Graph Input | Step Visualization | Optimal Node Count |
|-----------|-------------|-------------------|-------------------|
| **Dijkstra's Algorithm** | ✅ Manual/Upload | ✅ Yes | 4-8 nodes |
| **Flooding Algorithm** | ✅ Manual/Upload | ✅ Yes | 4-7 nodes |
| **Link State Routing** | ✅ Manual/Upload | ✅ Yes | 4-6 nodes |
| **Hierarchical Routing** | ❌ Hardcoded | ✅ Yes | Fixed topology |
| **Multicast Routing** | ❌ Hardcoded | ✅ Yes | Fixed topology |

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: D3.js v7
- **Styling**: Custom CSS with responsive design
- **File Handling**: FileReader API for graph data upload
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/routing-algorithms-visualization.git
   cd routing-algorithms-visualization
   ```

2. **No build process required** - This is a static web application
   
3. **Serve the files** using any web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📖 Usage

### Getting Started

1. **Navigate to the main page** and select a routing algorithm from the navbar
2. **Read the introduction** to understand the algorithm concepts
3. **Click "Visualization"** to access the interactive demo

### Graph Input Methods

#### Method 1: Manual Input
- **Nodes**: Enter comma-separated node IDs (e.g., `A,B,C,D`)
- **Links**: Enter link data in format `source-target,weight` separated by semicolons
  - Example: `A-B,4;B-C,5;C-D,3`

#### Method 2: File Upload
- Click **"Upload"** button and select a text file
- File format: First line contains nodes, second line contains links
- Example file content:
  ```
  A,B,C,D
  A-B,4;B-C,5;C-D,3;A-D,7
  ```

### Visualization Controls

- **Generate Graph**: Creates the network visualization
- **Run Algorithm**: Starts the algorithm execution
- **Next Step**: Advances to the next algorithm step
- **Back Step**: Returns to the previous step (where available)

## 📄 File Upload Format

Create a text file with the following structure:

```
# Line 1: Comma-separated node names
A,B,C,D,E

# Line 2: Link definitions (source-target,weight separated by semicolons)
A-B,2;B-C,3;C-D,1;D-E,4;A-E,6
```

### Example Files

**Simple Network (4 nodes)**
```
A,B,C,D
A-B,1;B-C,2;C-D,1;A-D,4
```

**Complex Network (6 nodes)**
```
A,B,C,D,E,F
A-B,2;A-C,4;B-D,3;C-D,1;D-E,2;E-F,3;B-F,5
```

## 🎯 Algorithm Details

### Dijkstra's Algorithm
- **Purpose**: Find shortest paths from source to all other nodes
- **Visualization**: Shows distance updates and visited nodes
- **Best for**: Learning shortest path concepts


### Flooding Algorithm
- **Purpose**: Message broadcasting across network
- **Visualization**: Shows packet propagation
- **Best for**: Learning network flooding concepts

### Link State Routing
- **Purpose**: Topology-aware routing protocol
- **Visualization**: Demonstrates link state advertisements
- **Best for**: Understanding modern routing protocols

### Hierarchical Routing
- **Purpose**: Scalable routing for large networks
- **Visualization**: Shows regional routing tables
- **Best for**: Learning network hierarchy concepts

### Multicast Routing
- **Purpose**: One-to-many communication
- **Visualization**: Displays multicast tree construction
- **Best for**: Understanding group communication

## 📧 Contact

- 📧 Email: [rupali4bharti@gmail.com](mailto:rupali4bharti@gmail.co)
- 💼 LinkedIn: [Connect with me](https://www.linkedin.com/in/rupali-bharti-13aa78257/)
- 🐙 GitHub: [@rupalibharti](https://github.com/she-codes3298)

## 🙏 Acknowledgments

- **D3.js** for powerful visualization capabilities
- **Computer Network textbooks** for algorithm references
- **Open source community** for inspiration and resources

---

### 📊 Performance Notes

- **Optimal graph sizes**: 4-8 nodes for best visualization clarity
- **Browser requirements**: Modern browser with JavaScript enabled
- **Performance**: Optimized for educational use, not large-scale networks

### 🐛 Known Issues

- Large graphs (>10 nodes) may appear cluttered
- File upload requires specific format adherence
- Some algorithms use hardcoded topologies for accuracy

---

**Made with ❤️ for computer networking education**
