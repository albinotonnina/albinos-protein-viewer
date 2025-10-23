# Albino's Protein Visualizer

An interactive 3D protein structure visualization application built with Vite and 3DMol.js. This application demonstrates advanced frontend development skills through real-time 3D rendering, dynamic data fetching, and a polished user interface.

![Albino's Protein Visualizer Screenshot](screenshot.png)

## 🚀 Features

### Interactive 3D Visualization
- **Multiple Protein Structures**: Pre-loaded selection of proteins (Myoglobin, Hemoglobin, Crambin, Ubiquitin, Adenylate Kinase, Insulin)
- **Custom PDB Loading**: Load any protein from the Protein Data Bank by entering its 4-letter ID
- **Real-time Rendering**: Smooth 3D visualization powered by 3DMol.js

### Visualization Controls
- **4 Rendering Styles**: Cartoon, Stick, Sphere, and Surface representations
- **4 Color Schemes**: Spectrum, Secondary Structure, Chain, and Atom Type coloring
- **Auto-spin**: Optional automatic rotation for better viewing
- **Depth Fog**: Optional depth perception enhancement
- **Interactive Controls**: Drag to rotate, scroll to zoom, right-click to pan

### User Interface
- **Modern Design**: Clean, professional interface with gradient accents
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Easy on the eyes for extended viewing sessions
- **Utility Functions**: Screenshot capture, fullscreen mode, and view reset

## 🛠️ Technical Stack

- **Vite** - Lightning-fast build tool and dev server
- **3DMol.js** - WebGL-based molecular visualization library
- **Vanilla JavaScript** - No framework overhead, pure performance
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **RCSB PDB API** - Real-time protein structure data fetching

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd albinos-protein-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Usage

1. **Select a Protein**: Click on any of the pre-loaded protein buttons in the left panel
2. **Change Visualization**: Choose different rendering styles (Cartoon, Stick, Sphere, Surface)
3. **Apply Color Schemes**: Select from various color schemes to highlight different aspects
4. **Load Custom Proteins**: Enter any 4-letter PDB ID in the custom input field
5. **Control the View**: Use mouse controls to rotate, zoom, and pan
6. **Take Screenshots**: Capture the current view as a PNG image
7. **Go Fullscreen**: Maximize the viewer for detailed analysis

## 🎨 Design Highlights

### Color Palette
- **Primary Background**: Deep space blue (#0a0e27)
- **Accent Colors**: Indigo to purple gradient (#6366f1 → #8b5cf6)
- **Text Hierarchy**: Three-tier text color system for optimal readability

### User Experience
- **Instant Feedback**: Visual feedback on all interactive elements
- **Loading States**: Clear loading indicators during data fetching
- **Error Handling**: Graceful error messages for failed protein loads
- **Accessibility**: High contrast ratios and clear visual hierarchy

## 🔬 Protein Structures Included

1. **Myoglobin (1MBN)** - Oxygen-storage protein in muscle cells
2. **Hemoglobin (2DHB)** - Oxygen-transport protein in blood
3. **Crambin (1CRN)** - Small plant seed protein
4. **Ubiquitin (1UBQ)** - Protein degradation signal
5. **Adenylate Kinase (1AKI)** - Energy transfer enzyme
6. **Insulin (1L2Y)** - Blood sugar regulation hormone

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📝 Code Quality

- **Clean Architecture**: Well-organized code with clear separation of concerns
- **State Management**: Centralized application state
- **Error Handling**: Comprehensive try-catch blocks and user feedback
- **Performance**: Optimized rendering and event handling
- **Comments**: Well-documented code for maintainability

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist` folder, ready for deployment to any static hosting service.

## 📚 Learning Resources

- [3DMol.js Documentation](https://3dmol.csb.pitt.edu/)
- [RCSB Protein Data Bank](https://www.rcsb.org/)
- [Vite Documentation](https://vitejs.dev/)

## 🎓 Skills Demonstrated

- **Frontend Development**: Modern HTML5, CSS3, and ES6+ JavaScript
- **3D Graphics**: WebGL-based rendering and visualization
- **API Integration**: RESTful API consumption and data handling
- **UI/UX Design**: User-centered interface design and interaction patterns
- **State Management**: Application state handling and updates
- **Responsive Design**: Mobile-first, adaptive layouts
- **Performance Optimization**: Efficient rendering and resource management

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

---

**Built with ❤️ to showcase frontend development skills**
