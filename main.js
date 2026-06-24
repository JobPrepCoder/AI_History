/* ========================================
   AI HISTORY — MAIN JAVASCRIPT
   ======================================== */

// ---- STARFIELD ----
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      s: Math.random() * 0.4 + 0.05,
      a: Math.random() * Math.PI * 2,
      pulse: Math.random() * 0.02 + 0.005,
    }));
  };
  window.addEventListener('resize', resize);
  resize();

  const colors = ['rgba(200,216,240,', 'rgba(0,229,255,', 'rgba(155,89,255,'];
  let frame = 0;
  (function draw() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.pulse;
      const alpha = 0.3 + Math.sin(s.a) * 0.3;
      const ci = Math.floor(s.r / 1.5);
      const c = colors[Math.min(ci, colors.length - 1)];
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = c + alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
})();

// ---- NEURAL NET CANVAS ----
(function initNeural() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [], W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    nodes = Array.from({ length: 48 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));
  };
  window.addEventListener('resize', resize);
  resize();

  (function draw() {
    ctx.clearRect(0, 0, W, H);

    // update
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.pulse += 0.025;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      const glow = 0.6 + Math.sin(n.pulse) * 0.4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${glow})`;
      ctx.fill();

      if (n.r > 2) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${glow * 0.15})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  })();
})();

// ---- SCROLL ANIMATIONS ----
(function initScrollAnim() {
  const items = document.querySelectorAll('.animate-in');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = (e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || i;
    observer.observe(el);
  });
})();

// ---- TIMELINE ANIMATION ----
(function initTimelineAnim() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeSlideIn 0.5s ease forwards';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
})();

// ---- COUNTER ANIMATION ----
(function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => observer.observe(el));
})();

// ---- MOBILE NAV ----
(function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!hamburger || !mobileNav) return;
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  // close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
    }
  });
})();

// ---- ACTIVE NAV LINK ----
(function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ---- FILTER / SEARCH ----
function initFilters(options) {
  const { searchId, chipsSelector, itemsSelector, textSelector, tagSelector } = options;
  const searchEl  = document.getElementById(searchId);
  const chips     = document.querySelectorAll(chipsSelector);
  const items     = document.querySelectorAll(itemsSelector);
  if (!items.length) return;

  let activeFilter = 'all';

  const applyFilters = () => {
    const q = searchEl ? searchEl.value.toLowerCase() : '';
    items.forEach(item => {
      const text   = textSelector ? item.querySelector(textSelector)?.textContent.toLowerCase() || '' : item.textContent.toLowerCase();
      const tags   = tagSelector  ? [...item.querySelectorAll(tagSelector)].map(t => t.textContent.toLowerCase()) : [];
      const allText = text + ' ' + tags.join(' ');
      const matchQ = !q || allText.includes(q);
      const matchF = activeFilter === 'all' || tags.some(t => t.includes(activeFilter)) || allText.includes(activeFilter);
      item.style.display = (matchQ && matchF) ? '' : 'none';
    });
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  });
  if (searchEl) searchEl.addEventListener('input', applyFilters);
}

// export for page scripts
window.AI = { initFilters };
