// Starfield canvas
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }

  function makeStars() {
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      s: Math.random() * 0.5 + 0.1,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const star of stars) {
      star.tw += 0.02 * star.s;
      const alpha = 0.4 + Math.sin(star.tw) * 0.4;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(alpha, 0.05)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    makeStars();
  });

  resize();
  makeStars();
  draw();
})();

// Reveal on scroll
(function () {
  const targets = document.querySelectorAll(
    '.about-card, .info-card, .skill-node, .ship, .tl-item, .contact-box'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => io.observe(el));
})();

// Clickable small ship cards
(function () {
  document.querySelectorAll('.ship-small[data-href]').forEach((card) => {
    const go = () => window.open(card.dataset.href, '_blank', 'noopener');
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
  });
})();
