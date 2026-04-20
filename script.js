const drone = document.getElementById("drone-model");
const parallaxSections = document.querySelectorAll(".section-parallax");
const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let prefersReducedMotion = motionMediaQuery.matches;
const parallaxConfig = Array.from(parallaxSections, (section) => ({
  section,
  speed: Number(section.getAttribute("data-speed") || 0.1),
}));

let mouseX = 0;
let mouseY = 0;
let currentRX = 0;
let currentRY = 0;
let droneAnimationFrameId = null;
let scrollTicking = false;
let scrollY = window.scrollY;

window.addEventListener("mousemove", (event) => {
  if (prefersReducedMotion) return;
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  mouseX = x * 20;
  mouseY = y * 20;
});

function animateDrone() {
  if (!drone || prefersReducedMotion) {
    droneAnimationFrameId = null;
    return;
  }

  currentRY += (mouseX - currentRY) * 0.08;
  currentRX += (-mouseY - currentRX) * 0.08;
  drone.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
  droneAnimationFrameId = requestAnimationFrame(animateDrone);
}

function startDroneAnimation() {
  if (!prefersReducedMotion && droneAnimationFrameId === null) {
    droneAnimationFrameId = requestAnimationFrame(animateDrone);
  }
}

function stopDroneAnimation() {
  if (droneAnimationFrameId !== null) {
    cancelAnimationFrame(droneAnimationFrameId);
    droneAnimationFrameId = null;
  }
  if (drone) {
    drone.style.transform = "rotateX(0deg) rotateY(0deg)";
  }
}

function applyParallax() {
  if (prefersReducedMotion) {
    parallaxConfig.forEach(({ section }) => {
      section.style.transform = "translate3d(0, 0, 0)";
    });
  } else {
    parallaxConfig.forEach(({ section, speed }) => {
      section.style.transform = `translate3d(0, ${scrollY * speed * -0.18}px, 0)`;
    });
  }
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(applyParallax);
  }
});

motionMediaQuery.addEventListener("change", (event) => {
  prefersReducedMotion = event.matches;
  if (prefersReducedMotion) {
    stopDroneAnimation();
  } else {
    startDroneAnimation();
  }
  applyParallax();
});

startDroneAnimation();
applyParallax();
