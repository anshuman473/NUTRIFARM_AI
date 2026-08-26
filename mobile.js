/* ============================================
   NutriFarm AI — mobile.js
   Small helpers for mobile UX.
   Load AFTER script.js, before </body>:
   <script src="script.js"></script>
   <script src="mobile.js"></script>
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Hamburger menu toggle (expects a button with class="nav-toggle"
  //    and a nav container with class="nav-links" — add these classes
  //    to your existing nav markup if not already present)
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    // Close menu after tapping a link (mobile UX nicety)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // 2. Fix the classic mobile browser "100vh includes the address bar" bug
  //    Use calc(var(--vh, 1vh) * 100) instead of 100vh in your CSS for
  //    any full-screen sections (hero, login pages, etc).
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };
  setViewportHeight();
  window.addEventListener("resize", setViewportHeight);
  window.addEventListener("orientationchange", setViewportHeight);

  // 3. Disable double-tap-to-zoom on buttons/links (feels more native)
  let lastTouch = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTouch <= 300) e.preventDefault();
      lastTouch = now;
    },
    { passive: false }
  );
});
