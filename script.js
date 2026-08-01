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
  const revealElements = document.querySelectorAll('.reveal, .timeline-item, .project-card, .skills-card');
  
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
});
