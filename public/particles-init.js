// Global particle initialization - persistent across hot reloads
console.log("[Particles] Initialization script loaded");

window.initCyberVerseParticles = function () {
  console.log("[Particles] Attempting to initialize...");

  // Clear any existing particles
  if (window.pJSDom && window.pJSDom.length > 0) {
    console.log("[Particles] Clearing existing particles");
    window.pJSDom.forEach((pjs) => {
      if (pjs && pjs.pJS) {
        try {
          pjs.pJS.fn.vendors.destroySvgs();
          pjs.pJS.fn.vendors.destroy();
        } catch (e) {
          console.warn("[Particles] Error clearing old instance:", e);
        }
      }
    });
    window.pJSDom = [];
  }

  // Wait for particles.js to be loaded
  if (!window.particlesJS) {
    console.log("[Particles] particles.js not loaded yet, retrying...");
    setTimeout(window.initCyberVerseParticles, 100);
    return;
  }

  console.log("[Particles] particles.js found, initializing...");

  try {
    particlesJS("particles-js", {
      particles: {
        number: { value: 150, density: { enable: true, value_area: 800 } },
        color: { value: ["#217fd9", "#2edd7d", "#ffd700"] },
        shape: { type: "circle" },
        opacity: { value: 0.3, random: true },
        size: { value: 2.5, random: true },
        line_linked: {
          enable: true,
          distance: 200,
          color: "#2edd7d",
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
    console.log("[Particles] Successfully initialized!");
  } catch (e) {
    console.error("[Particles] Failed to initialize:", e);
  }
};

// Initialize particles immediately
console.log("[Particles] Document ready state:", document.readyState);
if (document.readyState === "loading") {
  console.log("[Particles] Adding DOMContentLoaded listener");
  document.addEventListener("DOMContentLoaded", window.initCyberVerseParticles);
} else {
  console.log("[Particles] DOM already loaded, initializing now");
  window.initCyberVerseParticles();
}

// Re-initialize on window resize
window.addEventListener("resize", () => {
  if (window.pJSDom && window.pJSDom.length > 0) {
    try {
      window.pJSDom[0].pJS.fn.reloadParticles();
    } catch (e) {
      console.warn("[Particles] Error on resize:", e);
    }
  }
});

// Re-initialize particles on visibility change (tab switch)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    console.log("[Particles] Visibility changed, reinitializing");
    setTimeout(window.initCyberVerseParticles, 300);
  }
});
