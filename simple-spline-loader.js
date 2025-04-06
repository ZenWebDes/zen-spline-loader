// Optimized Single Spline Scene Loader

import { Application } from 'https://unpkg.com/@splinetool/runtime@latest';

let sceneLoaded = false;

function loadSplineScene(canvas) {
  const url = canvas.getAttribute("data-spline-url");
  if (!url || sceneLoaded) return; // Prevent loading more than one scene per page

  // Render the scene directly
  const app = new Application(canvas);
  app.load(url)
    .then(() => {
      sceneLoaded = true; // Mark the scene as loaded
      canvas.style.opacity = "1"; // Ensure the scene is fully visible
      console.log(`Spline scene loaded successfully: ${url}`);
    })
    .catch(err => console.error(`Error loading Spline scene: ${url}`, err));
}

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !sceneLoaded) {
      loadSplineScene(entry.target);
      observer.unobserve(entry.target); // Stop observing once the scene is loaded
    }
  });
}

const canvas = document.querySelector(".splineCanvas");

if (canvas) {  // Ensure canvas is present before initializing observer
  const observer = new IntersectionObserver(handleIntersection, {
    rootMargin: "300px",
    threshold: 0.1
  });

  observer.observe(canvas);
}
