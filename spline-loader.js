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

document.addEventListener("DOMContentLoaded", function () {
  const canvases = document.querySelectorAll(".splineCanvas");
  const observer = new IntersectionObserver(handleIntersection, { rootMargin: "100px" });

  canvases.forEach(canvas => {
    observer.observe(canvas);
  });
});
