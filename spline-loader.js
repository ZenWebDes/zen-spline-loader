window.addEventListener('load', () => {
  import('https://unpkg.com/@splinetool/runtime@latest').then(({ Application }) => {
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

    const canvases = document.querySelectorAll(".splineCanvas");

    if (canvases.length > 0) {
      const observer = new IntersectionObserver(handleIntersection, { rootMargin: "200px" });

      canvases.forEach(canvas => {
        observer.observe(canvas);
      });
    }
  }).catch(err => {
    console.error("Failed to load Spline runtime module:", err);
  });
});
