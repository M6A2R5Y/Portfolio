document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle Logic ---
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Animate mobile toggle bars
    const spans = mobileToggle.querySelectorAll('span');
    if (mobileToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });

  // --- Projects Filter System ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Add fade out animation first
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(10px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            // Trigger reflow
            card.offsetHeight;
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          } else {
            card.style.display = 'none';
          }
        }, 200);
      });
    });
  });

  // --- Intersection Observer for Scroll Animations ---
  const revealElements = document.querySelectorAll('.reveal, .timeline-item, .project-card, .skills-card, .cert-card-featured');
  
  // Add base reveal class to observe non-hero components
  revealElements.forEach((el, index) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // --- Certificate Modal & Copy Credential ID Logic ---
  const certModal = document.getElementById('cert-modal');
  const certPreviewTrigger = document.getElementById('cert-preview-trigger');
  const btnQuickPreview = document.getElementById('btn-quick-preview');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalCloseBtn = document.getElementById('cert-modal-close-btn');
  const certModalBackdrop = document.getElementById('cert-modal-backdrop');

  const openCertModal = () => {
    if (certModal) {
      certModal.classList.add('active');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCertModal = () => {
    if (certModal) {
      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (certPreviewTrigger) {
    certPreviewTrigger.addEventListener('click', openCertModal);
    certPreviewTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertModal();
      }
    });
  }

  if (btnQuickPreview) {
    btnQuickPreview.addEventListener('click', openCertModal);
  }

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeCertModal);
  if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

  // Copy Credential ID
  const copyBtn = document.getElementById('copy-credential-btn');
  const credentialIdVal = document.getElementById('credential-id-val');

  if (copyBtn && credentialIdVal) {
    copyBtn.addEventListener('click', async () => {
      const textToCopy = credentialIdVal.textContent.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
        const copyText = copyBtn.querySelector('.copy-text');
        const defaultIcon = copyBtn.querySelector('.copy-icon-default');
        const successIcon = copyBtn.querySelector('.copy-icon-success');

        copyBtn.classList.add('copied');
        if (copyText) copyText.textContent = 'Copied!';
        if (defaultIcon) defaultIcon.style.display = 'none';
        if (successIcon) successIcon.style.display = 'inline-block';

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyText) copyText.textContent = 'Copy ID';
          if (defaultIcon) defaultIcon.style.display = 'inline-block';
          if (successIcon) successIcon.style.display = 'none';
        }, 2200);
      } catch (err) {
        console.error('Failed to copy credential ID:', err);
      }
    });
  }
  // --- Interactive Background: floating code glyphs + connected particles ---
  const canvas = document.getElementById('bg-canvas');
  const glow = document.querySelector('.cursor-glow');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = { x: -9999, y: -9999 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (glow) {
      glow.classList.add('visible');
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = mouse.y = -9999;
    if (glow) glow.classList.remove('visible');
  });

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const glyphs = ['</>', '{ }', '=>', '()', '[]', 'const', 'def', 'async', 'ts', 'py', 'js', '//', '&&', '#'];
    let w, h, dpr, particles = [];

    const palette = () => document.documentElement.getAttribute('data-theme') === 'light'
      ? { dot: '110, 70, 220', glyph: '90, 60, 180' }
      : { dot: '167, 139, 250', glyph: '125, 211, 252' };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
        glyph: i % 4 === 0 ? glyphs[Math.floor(Math.random() * glyphs.length)] : null,
        size: Math.random() * 6 + 12
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const c = palette();
      ctx.textBaseline = 'middle';

      for (const p of particles) {
        // Gentle repulsion from the cursor
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const d = Math.sqrt(d2) || 1;
          const f = (150 - d) / 150;
          p.x += (dx / d) * f * 2.2;
          p.y += (dy / d) * f * 2.2;
        }
        if (!reduceMotion) { p.x += p.vx; p.y += p.vy; }
        if (p.x < -30) p.x = w + 30; else if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30; else if (p.y > h + 30) p.y = -30;

        if (p.glyph) {
          ctx.font = `${p.size}px "Fira Code", Consolas, monospace`;
          ctx.fillStyle = `rgba(${c.glyph}, 0.22)`;
          ctx.fillText(p.glyph, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.dot}, 0.55)`;
          ctx.fill();
        }
      }

      // Connect nearby dots, and link them to the cursor
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        if (a.glyph) continue;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (b.glyph) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${c.dot}, ${0.18 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 180) {
          ctx.strokeStyle = `rgba(${c.glyph}, ${0.4 * (1 - dm / 180)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
  }});
