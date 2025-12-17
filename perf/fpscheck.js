// This code will:
//    1. Log the FPS to the console every second.
//    2. Provide the startFPSCounter() and stopFPSCounter() functions to control it.

(function () {
  let frameCount = 0;
  let lastTime = performance.now();
  let rafId = null;

  function updateFPS() {
    const currentTime = performance.now();
    frameCount++;

    // Calculate FPS every second
    if (currentTime > lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      console.log("FPS:", fps);
      frameCount = 0;
      lastTime = currentTime;
    }
    rafId = requestAnimationFrame(updateFPS);
  }

  window.startFPSCounter = function () {
    if (!rafId) {
      console.log("FPS Counter Started...");
      frameCount = 0;
      lastTime = performance.now();
      rafId = requestAnimationFrame(updateFPS);
    } else {
      console.log("FPS Counter is already running.");
    }
  };

  window.stopFPSCounter = function () {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      console.log("FPS Counter Stopped.");
    } else {
      console.log("FPS Counter is not running.");
    }
  };

  console.log(
    "FPS functions (startFPSCounter(), stopFPSCounter()) are now available."
  );
})();
