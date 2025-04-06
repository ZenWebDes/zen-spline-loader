// Optimized Spline Scene Loader

import { Application } from 'https://unpkg.com/@splinetool/runtime@latest';

const sceneCache = new Map();

function loadSplineScene(canvas) {
  const url = canvas.getAttribute("data-spline-url");
  if (!url) return;

  canvas.style.display = "block";

  if (sceneCache.has(url)) { 
    canvas.appendChild(sceneCache.get(url)); // Reuse the cached scene
    console.log(`Loaded cached Spline scene: ${url}`);
    return;
  }

  const app = new Application(canvas);

  // Optimize rendering for mobile
  if (window.innerWidth < 768) { // Assuming mobile devices
    Application.config = { frameRate: 30 }; // Reduce frame rate for mobile devices
  }

  app.load(url)
    .then(() => {
      sceneCache.set(url, canvas); // Cache the scene for future use
      console.log(`Spline scene loaded: ${url}`);
    })
    .catch(err => console.error(`Error loading Spline scene: ${url}`, err));
}

function unloadSplineScene(canvas) {
  const url = canvas.getAttribute("data-spline-url");
  if (!url || !sceneCache.has(url)) return;

  const app = sceneCache.get(url).app;
  app.destroy(); // Properly destroy the scene to free up memory
  sceneCache.delete(url);
  canvas.innerHTML = ""; // Clear the canvas element
  console.log(`Spline scene unloaded: ${url}`);
}

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadSplineScene(entry.target);
    } else if (!entry.isIntersecting) {
      unloadSplineScene(entry.target);
    }
  });
}

// Initialize observer with improved settings
const canvases = document.querySelectorAll(".splineCanvas");

if (canvases.length > 0) {  // Ensure canvases are present before initializing observer
  const observer = new IntersectionObserver(handleIntersection, {
    rootMargin: "300px", // Increased margin for smoother loading
    threshold: 0.1 // Trigger loading when at least 10% of the canvas is visible
  });

  canvases.forEach(canvas => {
    observer.observe(canvas);
  });
}
