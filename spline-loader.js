import { Application } from 'https://unpkg.com/@splinetool/runtime@latest';

function loadSplineScene(canvas) {
  const url = canvas.getAttribute("data-spline-url");
  if (!url) return;

  canvas.style.display = "block";

  const app = new Application(canvas);
  app.load(url)
    .then(() => console.log(`Spline scene loaded: ${url}`))
    .catch(err => console.error(`Error loading Spline scene: ${url}`, err));
}

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadSplineScene(entry.target);
      observer.unobserve(entry.target);
    }
  });
}

// Directly executing the scene-loading logic without waiting for DOMContentLoaded
const canvases = document.querySelectorAll(".splineCanvas");

if (canvases.length > 0) {  // Ensure canvases are present before initializing observer
  const observer = new IntersectionObserver(handleIntersection, { rootMargin: "200px" });

  canvases.forEach(canvas => {
    observer.observe(canvas);
  });
}
