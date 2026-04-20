const drone = document.getElementById("drone-model");
const parallaxSections = document.querySelectorAll(".section-parallax");

let mouseX = 0;
let mouseY = 0;
let currentRX = 0;
let currentRY = 0;

window.addEventListener("mousemove", (event) => {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  mouseX = x * 20;
  mouseY = y * 20;
});

function animateDrone() {
  currentRY += (mouseX - currentRY) * 0.08;
  currentRX += (-mouseY - currentRX) * 0.08;
  if (drone) {
    drone.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
  }
  requestAnimationFrame(animateDrone);
}

animateDrone();

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  parallaxSections.forEach((section) => {
    const speed = Number(section.getAttribute("data-speed") || 0.1);
    section.style.transform = `translate3d(0, ${y * speed * -0.18}px, 0)`;
  });
});

let targetScroll = window.scrollY;
let currentScroll = window.scrollY;
let isTicking = false;

window.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    targetScroll += event.deltaY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    if (!isTicking) {
      isTicking = true;
      smoothScroll();
    }
  },
  { passive: false }
);

function smoothScroll() {
  currentScroll += (targetScroll - currentScroll) * 0.12;
  window.scrollTo(0, currentScroll);
  if (Math.abs(targetScroll - currentScroll) > 0.4) {
    requestAnimationFrame(smoothScroll);
  } else {
    isTicking = false;
  }
}
