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
    '.about-card, .info-card, .skill-node, .ship, .tl-item, .contact-box, .orbit-wrap'
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

// Draggable panel cards
(function () {
  document.querySelectorAll('.draggable').forEach((card) => {
    let startX, startY, origX = 0, origY = 0, dragging = false;

    const pointerDown = (e) => {
      dragging = true;
      card.classList.add('dragging');
      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      const t = card.style.transform.match(/-?\d+(\.\d+)?/g);
      origX = t ? parseFloat(t[0]) : 0;
      origY = t ? parseFloat(t[1]) : 0;
      window.addEventListener('mousemove', pointerMove);
      window.addEventListener('touchmove', pointerMove, { passive: false });
      window.addEventListener('mouseup', pointerUp);
      window.addEventListener('touchend', pointerUp);
    };

    const pointerMove = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      card.style.transform = `translate(${origX + dx}px, ${origY + dy}px)`;
    };

    const pointerUp = () => {
      dragging = false;
      card.classList.remove('dragging');
      window.removeEventListener('mousemove', pointerMove);
      window.removeEventListener('touchmove', pointerMove);
      window.removeEventListener('mouseup', pointerUp);
      window.removeEventListener('touchend', pointerUp);
    };

    const handle = card.querySelector('.drag-handle') || card;
    handle.addEventListener('mousedown', pointerDown);
    handle.addEventListener('touchstart', pointerDown, { passive: true });
  });
})();

// i18n language switcher
(function () {
  function applyLanguage(lang) {
    const dict = window.I18N && window.I18N[lang];
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-switch button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    localStorage.setItem('ssb-lang', lang);
  }

  document.querySelectorAll('.lang-switch button').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const saved = localStorage.getItem('ssb-lang');
  if (saved && window.I18N && window.I18N[saved]) {
    applyLanguage(saved);
  }
})();
