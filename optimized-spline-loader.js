// Optimized and Isolated Spline Scene Loader with Smooth Transition Handling

import { Application } from 'https://unpkg.com/@splinetool/runtime@latest';

const sceneCache = new Map();
let loadQueue = [];
let loading = false;

function loadSplineScene(canvas) {
  const url = canvas.getAttribute("data-spline-url");
  if (!url) return;

  // Render the scene offscreen to avoid layout shifts
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  offscreenCanvas.style.opacity = "0.01"; // Slightly visible to allow rendering
  offscreenCanvas.style.transition = "opacity 0.5s ease-in-out";

  const app = new Application(offscreenCanvas);

  // Optimize rendering for mobile
  if (window.innerWidth < 768) {
    Application.config = { frameRate: 30 };
  }

  app.load(url)
    .then(() => {
      canvas.replaceWith(offscreenCanvas); // Replace original canvas with loaded scene
      sceneCache.set(url, offscreenCanvas); // Cache the rendered scene

      // Ensure the fade-in transition is applied correctly
      setTimeout(() => {
        offscreenCanvas.style.opacity = "1"; // Trigger fade-in
        console.log(`Spline scene fully loaded and visible: ${url}`);
      }, 300); // Increased delay to ensure rendering is complete
    })
    .catch(err => console.error(`Error loading Spline scene: ${url}`, err));
}

function unloadSplineScene(canvas) {
  const url = canvas.getAttribute("data-spline-url");
  if (!url || !sceneCache.has(url)) return;

  const app = sceneCache.get(url).app;
  app.destroy();
  sceneCache.delete(url);
  canvas.innerHTML = "";
  console.log(`Spline scene unloaded: ${url}`);
}

function processQueue() {
  if (loading || loadQueue.length === 0) return;

  loading = true;
  const { canvas } = loadQueue.shift();
  loadSplineScene(canvas);

  setTimeout(() => {
    loading = false;
    processQueue();
  }, 300); // Adjust delay as needed
}

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadQueue.push({ canvas: entry.target });
      observer.unobserve(entry.target);
      processQueue();
    }
  });
}

const canvases = document.querySelectorAll(".splineCanvas");

if (canvases.length > 0) {
  const observer = new IntersectionObserver(handleIntersection, {
    rootMargin: "300px",
    threshold: 0.1
  });

  canvases.forEach(canvas => {
    observer.observe(canvas);
  });
}
