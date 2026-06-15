const phrases = [
  "component-based Angular and React applications",
  "ASP.NET Core APIs with SOLID service boundaries",
  "Entity Framework data paths over SQL Server",
  "transactional workloads with tuned queries",
  "unit-tested releases through CI/CD pipelines",
  "secure validation and identity-aware services",
  "maintainable UI backed by reliable data models"
];

const rotatingText = document.querySelector("#rotating-text");
let phraseIndex = 0;

if (rotatingText) {
  window.setInterval(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    const exitAnimation = rotatingText.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-8px)" }
      ],
      { duration: 180, easing: "ease-out" }
    );

    exitAnimation.onfinish = () => {
      rotatingText.textContent = phrases[phraseIndex];
      rotatingText.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 240, easing: "ease-out" }
      );
    };
  }, 2400);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const numberObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const numberElement = entry.target.querySelector("[data-count]");
      if (!numberElement) {
        return;
      }

      const target = Number(numberElement.dataset.count);
      const duration = 1200;
      const start = performance.now();

      const tick = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        numberElement.textContent = Math.round(target * eased).toString();

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
      numberObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll(".metric").forEach((metric) => {
  numberObserver.observe(metric);
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.filter;
    projectCards.forEach((card) => {
      const shouldShow = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const tiltTarget = document.querySelector("[data-tilt]");

if (tiltTarget && window.matchMedia("(pointer: fine)").matches) {
  tiltTarget.addEventListener("mousemove", (event) => {
    const rect = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    tiltTarget.style.transform = `perspective(1000px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
  });

  tiltTarget.addEventListener("mouseleave", () => {
    tiltTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
}

const canvas = document.querySelector("#app-canvas");
const context = canvas ? canvas.getContext("2d") : null;
const particles = [];
const palette = ["#42f5d7", "#6ca8ff", "#a37bff", "#71e8a8", "#f4bd5f"];
const particleCount = 96;

function resizeCanvas() {
  if (!canvas || !context) {
    return;
  }

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createParticle() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    radius: 1.1 + Math.random() * 2.1,
    color: palette[Math.floor(Math.random() * palette.length)]
  };
}

function seedParticles() {
  particles.length = 0;
  for (let index = 0; index < particleCount; index += 1) {
    particles.push(createParticle());
  }
}

function drawParticles() {
  if (!context) {
    return;
  }

  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = window.innerWidth + 20;
    if (particle.x > window.innerWidth + 20) particle.x = -20;
    if (particle.y < -20) particle.y = window.innerHeight + 20;
    if (particle.y > window.innerHeight + 20) particle.y = -20;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = particle.color;
    context.globalAlpha = 0.34;
    context.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 132) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = particle.color;
        context.globalAlpha = (1 - distance / 132) * 0.17;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  });

  context.globalAlpha = 1;
  window.requestAnimationFrame(drawParticles);
}

resizeCanvas();
seedParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "stroke-width": 2
    }
  });
}
