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
});
