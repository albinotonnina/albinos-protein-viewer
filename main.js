import './style.css';
import * as $3Dmol from '3dmol';

// Application state
const state = {
  viewer: null,
  currentPDB: '1MBN',
  currentProtein: 'Myoglobin',
  currentStyle: 'cartoon',
  currentColor: 'spectrum',
  isSpinning: true,
  spinAnimationId: null,
  lastFrameTime: 0,
  currentModel: null,
  particlesEnabled: true,
  particles: [],
  particleAnimationId: null,
  rainbowHue: 0
};

// Particle class
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.size = Math.random() * 3 + 1;
    this.life = 1;
    this.decay = Math.random() * 0.01 + 0.005;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;

    if (this.life <= 0 || this.x < 0 || this.x > this.canvas.width || 
        this.y < 0 || this.y > this.canvas.height) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life * 0.8;
    ctx.fillStyle = `hsl(${state.rainbowHue}, 70%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Initialize the application
function init() {
  // Create 3DMol viewer with performance optimizations
  const viewerElement = document.getElementById('viewer');
  state.viewer = $3Dmol.createViewer(viewerElement, {
    backgroundColor: 'white',
    antialias: true,
    preserveDrawingBuffer: true
  });

  // Load initial protein
  loadProtein(state.currentPDB);

  // Setup event listeners
  setupEventListeners();

  // Create and start particle canvas
  createParticleCanvas();
  animateParticles();
  animateRainbowHue();
}

// Load protein from PDB database
async function loadProtein(pdbId) {
  showLoading(true);
  
  try {
    // Clear previous model
    state.viewer.clear();

    // Fetch PDB data
    const response = await fetch(`https://files.rcsb.org/download/${pdbId}.pdb`);
    
    if (!response.ok) {
      throw new Error(`Failed to load protein: ${pdbId}`);
    }

    const pdbData = await response.text();

    // Add model to viewer
    state.currentModel = state.viewer.addModel(pdbData, 'pdb');

    // Apply current style and color
    applyVisualization();

    // Center and zoom
    state.viewer.zoomTo();
    state.viewer.zoom(0.7, 500); // Zoom out to 70% for smaller protein view
    state.viewer.render();

    // Fetch and display educational information
    fetchProteinInfo(pdbId);

    // Start spinning if enabled
    if (state.isSpinning) {
      startSpin();
    }

    showLoading(false);
  } catch (error) {
    console.error('Error loading protein:', error);
    showLoading(false);
    alert(`Failed to load protein ${pdbId}. Please try another one.`);
  }
}

// Fetch protein metadata from RCSB API
async function fetchProteinInfo(pdbId) {
  try {
    const response = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`);
    if (!response.ok) return;

    const data = await response.json();
    
    // Extract educational information
    const title = data.struct?.title || 'N/A';
    const method = data.exptl?.[0]?.method || 'N/A';
    const resolution = data.rcsb_entry_info?.resolution_combined?.[0] || 'N/A';
    const weight = data.rcsb_entry_info?.molecular_weight || 'N/A';
    const keywords = data.struct_keywords?.pdbx_keywords || 'N/A';
    const pubDate = data.rcsb_accession_info?.initial_release_date?.split('T')[0] || 'N/A';
    const authors = data.rcsb_primary_citation?.rcsb_authors?.[0] || 'N/A';
    
    // Update the info panel
    displayProteinInfo({
      title,
      method,
      resolution,
      weight,
      keywords,
      pubDate,
      authors,
      pdbId
    });
  } catch (error) {
    console.error('Error fetching protein info:', error);
  }
}

// Display protein information in UI
function displayProteinInfo(info) {
  const infoPanel = document.getElementById('proteinInfo');
  const infoPanelMobile = document.getElementById('proteinInfoMobile');
  
  if (!infoPanel) return;

  const resolutionText = info.resolution !== 'N/A' ? `${info.resolution} Å` : 'N/A';
  const weightText = info.weight !== 'N/A' ? `${parseFloat(info.weight).toFixed(2)} kDa` : 'N/A';

  const infoHTML = `
    <div class="info-content">
      <div class="info-item">
        <span class="info-label">Title</span>
        <span class="info-value">${info.title}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Resolution</span>
        <span class="info-value">${resolutionText}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Molecular Weight</span>
        <span class="info-value">${weightText}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Method</span>
        <span class="info-value">${info.method}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Function</span>
        <span class="info-value">${info.keywords}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Published</span>
        <span class="info-value">${info.pubDate}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Author</span>
        <span class="info-value">${info.authors}</span>
      </div>
    </div>
  `;
  
  // Update both desktop (overlay) and mobile versions
  infoPanel.innerHTML = infoHTML;
  if (infoPanelMobile) {
    infoPanelMobile.innerHTML = infoHTML;
  }
}

// Apply visualization style
function applyVisualization() {
  if (!state.currentModel) return;

  switch (state.currentStyle) {
    case 'cartoon':
      state.viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      break;
    case 'stick':
      state.viewer.setStyle({}, { stick: {} });
      break;
    case 'sphere':
      state.viewer.setStyle({}, { sphere: {} });
      break;
  }

  state.viewer.render();
}

// Auto-spin functionality using requestAnimationFrame
function startSpin() {
  stopSpin();
  
  const animate = (currentTime) => {
    if (!state.isSpinning) return;
    
    const deltaTime = currentTime - state.lastFrameTime;
    
    if (deltaTime >= 16) {
      state.viewer.rotate(0.5, 'y');
      state.lastFrameTime = currentTime;
    }
    
    state.spinAnimationId = requestAnimationFrame(animate);
  };
  
  state.lastFrameTime = performance.now();
  state.spinAnimationId = requestAnimationFrame(animate);
}

function stopSpin() {
  if (state.spinAnimationId) {
    cancelAnimationFrame(state.spinAnimationId);
    state.spinAnimationId = null;
  }
}

// Create particle canvas overlay
function createParticleCanvas() {
  const viewer = document.getElementById('viewer');
  
  // Remove existing canvas if present
  const existingCanvas = document.getElementById('particleCanvas');
  if (existingCanvas) {
    existingCanvas.remove();
  }
  
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.width = viewer.clientWidth;
  canvas.height = viewer.clientHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  viewer.appendChild(canvas);

  // Initialize particles
  state.particles = [];
  for (let i = 0; i < 80; i++) {
    state.particles.push(new Particle(canvas));
  }

  // Handle resize
  const resizeHandler = () => {
    canvas.width = viewer.clientWidth;
    canvas.height = viewer.clientHeight;
  };
  
  window.addEventListener('resize', resizeHandler);
}

// Particle animation loop
function animateParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (state.particlesEnabled) {
      state.particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
    }

    state.particleAnimationId = requestAnimationFrame(animate);
  };
  
  state.particleAnimationId = requestAnimationFrame(animate);
}

// Animate rainbow hue for particles
function animateRainbowHue() {
  state.rainbowHue = (state.rainbowHue + 2) % 360;
  setTimeout(animateRainbowHue, 50);
}

// Show/hide loading indicator
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (show) {
    loading.classList.remove('hidden');
  } else {
    loading.classList.add('hidden');
  }
}

// Setup all event listeners
function setupEventListeners() {
  // Protein selection buttons
  document.querySelectorAll('.protein-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const pdbId = button.dataset.pdb;
      const proteinName = button.dataset.name;

      document.querySelectorAll('.protein-btn').forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      state.currentPDB = pdbId;
      state.currentProtein = proteinName;
      
      loadProtein(pdbId);
      updateInfo();
    });
  });

  // Style buttons
  document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const style = button.dataset.style;

      document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      state.currentStyle = style;
      applyVisualization();
    });
  });

  // Spin toggle
  document.getElementById('spinToggle').addEventListener('change', (e) => {
    state.isSpinning = e.target.checked;
    if (state.isSpinning) {
      startSpin();
    } else {
      stopSpin();
    }
  });

  // Particles toggle
  const particlesToggle = document.getElementById('particlesToggle');
  if (particlesToggle) {
    particlesToggle.addEventListener('change', (e) => {
      state.particlesEnabled = e.target.checked;
    });
  }

  // Custom PDB input
  document.getElementById('loadCustom').addEventListener('click', () => {
    const input = document.getElementById('customPDB');
    const pdbId = input.value.trim().toUpperCase();

    if (pdbId.length === 4) {
      state.currentPDB = pdbId;
      state.currentProtein = pdbId;
      
      document.querySelectorAll('.protein-btn').forEach(b => b.classList.remove('active'));
      
      loadProtein(pdbId);
      updateInfo();
      input.value = '';
    } else {
      alert('Please enter a valid 4-character PDB ID');
    }
  });

  // Enter key for custom PDB
  document.getElementById('customPDB').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('loadCustom').click();
    }
  });

  // Reset view button
  document.getElementById('resetView').addEventListener('click', () => {
    state.viewer.zoomTo();
    state.viewer.render();
  });

  // Screenshot button
  document.getElementById('screenshot').addEventListener('click', () => {
    const imgData = state.viewer.pngURI();
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${state.currentPDB}_structure.png`;
    link.click();
  });

  // Fullscreen button
  document.getElementById('fullscreen').addEventListener('click', () => {
    const viewerContainer = document.querySelector('.viewer-container');
    if (!document.fullscreenElement) {
      viewerContainer.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Handle fullscreen change
  document.addEventListener('fullscreenchange', () => {
    setTimeout(() => {
      state.viewer.resize();
    }, 100);
  });

  // Window resize handler
  window.addEventListener('resize', () => {
    if (state.viewer) {
      state.viewer.resize();
    }
  });
}

// Update protein info display
function updateInfo() {
  document.getElementById('currentProtein').textContent = state.currentProtein;
  document.getElementById('currentPDB').textContent = state.currentPDB;
  document.getElementById('viewerTitle').textContent = `${state.currentProtein} Structure`;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
