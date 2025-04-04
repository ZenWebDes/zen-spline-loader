import { Application } from 'https://unpkg.com/@splinetool/runtime@latest';

function loadSplineScene(canvas) {
  const url = canvas.getAttribute("data-spline-url");
  if (!url) return;

  canvas.style.display = "block";
  adjustCanvasSize(canvas);

  const app = new Application(canvas);
  app.load(url)
    .then(() => console.log(`Spline scene loaded: ${url}`))
    .catch(err => console.error(`Error loading Spline scene: ${url}`, err));
}

function adjustCanvasSize(canvas) {
  if (window.innerWidth < 768) {
    canvas.style.width = "100%";
    canvas.style.height = "300px";
  } else {
    canvas.style.width = "100%";
    canvas.style.height = "600px";
  }
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

window.addEventListener("resize", () => {
  document.querySelectorAll(".splineCanvas").forEach(canvas => {
    if (canvas.style.display === "block") {
      adjustCanvasSize(canvas);
    }
  });
});
