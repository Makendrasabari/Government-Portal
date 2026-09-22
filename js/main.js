/**
 * Government Portal - Main Global Scripts
 * Navigation, Accessibility, Animations, Tabs, Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initStickyHeader();
  initMobileMenu();
  initA11yControls();
  initScrollAnimations();
  initCounters();
  initSearchModal();
  initTabs();
  initFAQ();
  initHeroCarousel();
  initHeroCategoriesArrangeAnimation();
  initNewsShuffle();
  initValuesShuffleAndFlip();
  initMilestonesTimelineAnimation();
  initLeadershipMarquee();
  initHierarchyArrangeAnimation();
  initCharterShuffle();
  initServicesRowArrange();
  initWorkflowArrangeAnimation();
  initScoreboardArrangeAnimation();
  initFeaturedBannerAnimation();
  initBlogGridArrangeAnimation();
  initNewsletterSubscription();
  initBriefingsArrangeAnimation();
  initPolicyPollAnimation();
  initHelplineMarquee();
  initContactGridAnimation();
  initContactGrievanceForm();
  initSalemMapInteraction();
  initTalukDirectoryAnimation();
  initAppointmentBookingAnimation();
  initAppointmentBookingForm();
});

/* Professional Government Portal Preloading Screen */
function initPreloader() {
  const preloader = document.getElementById('gov-preloader');
  if (!preloader) return;

  document.body.classList.add('preloader-active');

  // After 1.5 seconds, animate both halves smoothly in opposite directions
  setTimeout(() => {
    preloader.classList.add('open');
    document.body.classList.remove('preloader-active');

    // Remove preloader after transition finishes (total duration: 1.5-2 seconds)
    setTimeout(() => {
      preloader.classList.add('done');
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 600);
  }, 1500);
}

/* Sticky / Fixed Header on Scroll */
function initStickyHeader() {
  const header = document.querySelector('.gov-header');
  if (!header) return;

  document.body.classList.add('has-fixed-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* Mobile Drawer Menu (Exact 768px Breakpoint, Auto-Close, Scroll Lock) */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.gov-mobile-toggle');
  const drawer = document.querySelector('.gov-mobile-drawer');
  if (!toggleBtn || !drawer) return;

  function closeDrawer() {
    drawer.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function openDrawer() {
    drawer.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close when clicking outside the drawer or toggle button
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      }
    }
  });

  // Automatically close menu immediately when any menu item is clicked
  const links = drawer.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Automatically close and restore desktop view at 768px and above
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeDrawer();
    }
  });
}

/* Accessibility Controls: Font Size Scaling */
function initA11yControls() {
  const fontDec = document.getElementById('font-decrease');
  const fontNorm = document.getElementById('font-normal');
  const fontInc = document.getElementById('font-increase');

  if (fontDec) {
    fontDec.addEventListener('click', () => {
      document.body.classList.remove('font-large');
      document.body.classList.add('font-small');
    });
  }
  if (fontNorm) {
    fontNorm.addEventListener('click', () => {
      document.body.classList.remove('font-small', 'font-large');
    });
  }
  if (fontInc) {
    fontInc.addEventListener('click', () => {
      document.body.classList.remove('font-small');
      document.body.classList.add('font-large');
    });
  }

  // Live Date display in topbar
  const dateEl = document.getElementById('current-gov-date');
  if (dateEl) {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-IN', options);
  }
}

/* Scroll-triggered Reveal Animations */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.fade-in-up, .anim-card-left, .anim-card-right, .anim-card-down, .section-title, .section-subtitle, .section-desc, .anim-about-left, .anim-about-image'
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('anim-about-image')) {
          setTimeout(() => {
            entry.target.classList.add('reveal-done');
          }, 1400);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* Animated Counters (Live run and stop at target position) */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  // Initialize display to zero with prefix/suffix so live run starts visibly
  counters.forEach(c => {
    const prefix = c.getAttribute('data-prefix') || '';
    const suffix = c.getAttribute('data-suffix') || '';
    c.textContent = `${prefix}0${suffix}`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        let startTimestamp = null;

        function step(timestamp) {
          if (!startTimestamp) startTimestamp = timestamp;
          const elapsed = timestamp - startTimestamp;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic: fast launch, deceleration, and smooth stop
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * target);

          el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  counters.forEach(c => observer.observe(c));
}

/* Search Modal */
function initSearchModal() {
  const searchTriggers = document.querySelectorAll('.gov-search-trigger, [data-open-search]');
  const modal = document.getElementById('gov-search-modal');
  const closeBtn = document.querySelector('.search-modal-close');
  const searchInput = document.getElementById('gov-search-input');
  const resultsContainer = document.getElementById('search-modal-results');

  if (!modal) return;

  searchTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      if (searchInput) {
        searchInput.focus();
        searchInput.value = '';
        renderSearchResults('');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });

  const searchableItems = [
    { title: 'Birth Certificate Application', cat: 'Certificates', url: 'services.html' },
    { title: 'Income & Asset Certificate', cat: 'Revenue', url: 'services.html' },
    { title: 'Community / Caste Certificate', cat: 'Revenue', url: 'services.html' },
    { title: 'Driving License Renewal & Test', cat: 'Transport', url: 'services.html' },
    { title: 'Smart Ration Card Services', cat: 'Civil Supplies', url: 'services.html' },
    { title: 'Land Records & Patta Chitta', cat: 'Revenue', url: 'services.html' },
    { title: 'PM-KISAN Agriculture Scheme', cat: 'Agriculture', url: 'services.html' },
    { title: 'Senior Citizen Pension Scheme', cat: 'Social Welfare', url: 'services.html' },
    { title: 'Trade License for Small Business', cat: 'Commerce', url: 'services.html' },
    { title: 'Online Public Grievance Portal', cat: 'Grievance', url: 'services.html' },
    { title: 'National Digital Health Mission Update', cat: 'News', url: 'blog.html' },
    { title: 'Salem Collectorate Office Directory', cat: 'Contact', url: 'contact.html' }
  ];

  if (searchInput && resultsContainer) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim().toLowerCase());
    });
  }

  function renderSearchResults(query) {
    if (!resultsContainer) return;
    const matches = query 
      ? searchableItems.filter(item => item.title.toLowerCase().includes(query) || item.cat.toLowerCase().includes(query))
      : searchableItems.slice(0, 6);

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: #64748B;">No government services found matching your search.</div>';
      return;
    }

    resultsContainer.innerHTML = matches.map(item => `
      <a href="${item.url}" class="search-result-item">
        <span class="search-item-badge">${item.cat}</span>
        <span style="font-weight: 600; flex: 1;">${item.title}</span>
      </a>
    `).join('');
  }
}

/* Category Filter Tabs (Home & Services Page) */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn[data-category]');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.filter-tabs-nav');
      if (parent) {
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      const cards = document.querySelectorAll('.filterable-card');

      cards.forEach(card => {
        const itemCat = card.getAttribute('data-category') || '';
        if (category === 'all' || itemCat.includes(category)) {
          card.style.display = '';
          card.classList.add('is-arranged', 'arrange-done');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* FAQ Accordion */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-accordion-header') || item.querySelector('.faq-question');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open') || item.classList.contains('active');
        faqItems.forEach(i => {
          i.classList.remove('is-open');
          i.classList.remove('active');
          const h = i.querySelector('.faq-accordion-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

/* Continuous 5-Image Hero Carousel (2-Second Interval per user request) */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-bg-slide');
  if (!slides || slides.length === 0) return;
  const heroImg = document.getElementById('hero-main-carousel-img');
  const dots = document.querySelectorAll('.carousel-dot');
  
  const heroImages = [
    'Assets/hero-parliament.webp',
    'Assets/hero-vidhana.webp',
    'Assets/hero-command.webp',
    'Assets/about-building.webp',
    'Assets/citizen-service.webp'
  ];

  let currentIndex = 0;
  const totalSlides = 5;

  function setSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    
    // Update background slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    // Update main hero frame image
    if (heroImg) {
      heroImg.src = heroImages[currentIndex];
    }

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Allow manual clicking on dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      setSlide(idx);
    });
  });

  // Continuous timer: exactly 2 seconds gap of time
  setInterval(() => {
    setSlide(currentIndex + 1);
  }, 2000);
}

/* Hero Categories Bar: Sequential Arrange Animation Controller (Education -> Health -> Agriculture -> Business -> Transport -> Social Welfare) */
function initHeroCategoriesArrangeAnimation() {
  const bar = document.getElementById('hero-categories-bar');
  if (!bar) return;

  let arrangeDone = false;

  function triggerArrange() {
    if (arrangeDone) return;
    arrangeDone = true;

    bar.classList.remove('is-animated', 'arrange-complete');
    void bar.offsetWidth; // Force reflow
    bar.classList.add('is-animated');

    // Release animation locks after the 6th card finishes settling (~1.85s) so hover works smoothly
    setTimeout(() => {
      bar.classList.add('arrange-complete');
    }, 1850);
  }

  // Preloader opens at ~1.5s; trigger when ready or via intersection
  const preloader = document.getElementById('gov-preloader');
  if (preloader && !preloader.classList.contains('done')) {
    setTimeout(triggerArrange, 1550);
  } else {
    triggerArrange();
  }

  // Intersection observer fallback
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(bar);
}

/* Shuffle and Arrange Animation for Latest News & Updates */
function initNewsShuffle() {
  const grid = document.getElementById('news-shuffle-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.news-card');
  const replayBtn = document.getElementById('btn-replay-shuffle');

  function triggerShuffle() {
    // Reset cards state
    cards.forEach(c => {
      c.classList.remove('shuffle-done');
    });
    grid.classList.remove('visible');

    // Force reflow to re-trigger CSS animations
    void grid.offsetWidth;

    // Start shuffle animation
    grid.classList.add('visible');
  }

  // Once keyframe animation completes, remove animation constraints so standard hover effects work cleanly
  cards.forEach(card => {
    card.addEventListener('animationend', () => {
      card.classList.add('shuffle-done');
    });
  });

  // IntersectionObserver to trigger when section enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerShuffle();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  // Allow re-shuffling on button click
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerShuffle();
    });
  }
}

/* Mission & Vision: 3D Flip Cards & Shuffle-Arrange Animation */
function initValuesShuffleAndFlip() {
  const grid = document.getElementById('values-shuffle-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.values-card');
  const replayBtn = document.getElementById('btn-replay-values-shuffle');

  // Toggle 3D card flip on click and keyboard activation (Enter / Space)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't flip if an explicit interactive link/button inside was clicked
      if (e.target.closest('a') || e.target.closest('button')) return;
      card.classList.toggle('is-flipped');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });

    // When the shuffle keyframe animation completes, mark shuffle-done to release animation locks
    card.addEventListener('animationend', () => {
      card.classList.add('shuffle-done');
    });
  });

  function triggerValuesShuffle() {
    // Reset cards state and ensure they face front for the shuffle
    cards.forEach(c => {
      c.classList.remove('shuffle-done');
    });
    grid.classList.remove('visible');

    // Force reflow
    void grid.offsetWidth;

    // Trigger shuffle animation
    grid.classList.add('visible');
  }

  // IntersectionObserver to trigger shuffle when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerValuesShuffle();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  // Replay shuffle button
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerValuesShuffle();
    });
  }
}

/* Governance Milestones: Rotating Circle & Slide-in Sentence Choreography */
function initMilestonesTimelineAnimation() {
  const container = document.getElementById('timeline-milestones-container');
  if (!container) return;

  const replayBtn = document.getElementById('btn-replay-milestones');
  const items = container.querySelectorAll('.timeline-item');
  let animationTimer = null;

  function triggerMilestonesAnimation() {
    if (animationTimer) clearTimeout(animationTimer);

    // Reset classes
    container.classList.remove('is-animated');
    container.classList.remove('timeline-animation-complete');
    items.forEach(item => item.classList.remove('replay-active'));

    // Force reflow
    void container.offsetWidth;

    // Start sequential timeline animation
    container.classList.add('is-animated');

    // After all 4 steps finish (~5.8s), mark complete to unlock hover effects
    animationTimer = setTimeout(() => {
      container.classList.add('timeline-animation-complete');
    }, 5800);
  }

  // Trigger when timeline enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerMilestonesAnimation();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(container);

  // Header replay button
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerMilestonesAnimation();
    });
  }

  // Interactive re-trigger when clicking any circle
  items.forEach(item => {
    const circle = item.querySelector('.timeline-circle');
    if (circle) {
      circle.addEventListener('click', () => {
        item.classList.remove('replay-active');
        void item.offsetWidth;
        item.classList.add('replay-active');
        setTimeout(() => {
          item.classList.remove('replay-active');
        }, 1100);
      });

      circle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.classList.remove('replay-active');
          void item.offsetWidth;
          item.classList.add('replay-active');
          setTimeout(() => {
            item.classList.remove('replay-active');
          }, 1100);
        }
      });
    }
  });
}

/* Leadership Council: Continuous Horizontal Live Run Controller */
function initLeadershipMarquee() {
  const container = document.getElementById('leadership-marquee-container');
  const toggleBtn = document.getElementById('btn-toggle-leadership-scroll');
  if (!container || !toggleBtn) return;

  const pauseIcon = document.getElementById('icon-leadership-pause');
  const playIcon = document.getElementById('icon-leadership-play');
  const toggleText = document.getElementById('text-leadership-toggle');
  let isPaused = false;

  toggleBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    container.classList.toggle('is-paused', isPaused);
    if (isPaused) {
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playIcon) playIcon.style.display = 'block';
      if (toggleText) toggleText.textContent = 'Play';
      toggleBtn.setAttribute('title', 'Resume Live Stream');
    } else {
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (playIcon) playIcon.style.display = 'none';
      if (toggleText) toggleText.textContent = 'Pause';
      toggleBtn.setAttribute('title', 'Pause Live Stream');
    }
  });
}

/* Departmental Hierarchy: Sequential Arrange Animation Controller */
function initHierarchyArrangeAnimation() {
  const grid = document.getElementById('org-hierarchy-grid');
  if (!grid) return;

  const replayBtn = document.getElementById('btn-replay-hierarchy');
  const cards = grid.querySelectorAll('.org-tier-card');
  let animationTimer = null;

  function triggerArrangeSequence() {
    if (animationTimer) clearTimeout(animationTimer);

    // Reset animation classes
    grid.classList.remove('is-animated');
    grid.classList.remove('arrange-complete');

    // Force reflow
    void grid.offsetWidth;

    // Trigger sequential arrange animation
    grid.classList.add('is-animated');

    // After all 4 cards settle (~1.95s), release constraints to enable smooth hover effects
    animationTimer = setTimeout(() => {
      grid.classList.add('arrange-complete');
    }, 1950);
  }

  // Trigger when grid enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerArrangeSequence();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  // Replay sequence button
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerArrangeSequence();
    });
  }
}

/* Citizen Charter: Shuffle & Arrange Animation Controller */
function initCharterShuffle() {
  const grid = document.getElementById('charter-shuffle-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.charter-sla-card');
  const replayBtn = document.getElementById('btn-replay-charter-shuffle');

  function triggerCharterShuffle() {
    cards.forEach(c => c.classList.remove('shuffle-done'));
    grid.classList.remove('visible');
    void grid.offsetWidth;
    grid.classList.add('visible');
  }

  // Once keyframe animation completes, release constraints
  cards.forEach(card => {
    card.addEventListener('animationend', () => {
      card.classList.add('shuffle-done');
    });
  });

  // IntersectionObserver to trigger on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerCharterShuffle();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  // Replay shuffle button
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerCharterShuffle();
    });
  }
}

/* Services Directory: 3-by-3 Row Scroll Arrange Animation */
function initServicesRowArrange() {
  const grid = document.getElementById('services-grid-container');
  if (!grid) return;

  const cards = grid.querySelectorAll('.service-dir-card');
  if (!cards.length) return;

  // Group cards into rows of 3 based on data-row
  const rows = {};
  cards.forEach(card => {
    const rowNum = card.getAttribute('data-row') || '1';
    if (!rows[rowNum]) rows[rowNum] = [];
    rows[rowNum].push(card);

    // Release animation locks once keyframe finishes
    card.addEventListener('animationend', () => {
      card.classList.add('arrange-done');
    });
  });

  // Observe each row's first card to trigger sequential arrange of its 3 cards
  Object.keys(rows).forEach(rowNum => {
    const rowCards = rows[rowNum];
    if (!rowCards.length) return;

    const triggerCard = rowCards[0];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          rowCards.forEach(c => {
            c.classList.add('is-arranged');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    observer.observe(triggerCard);
  });
}

/* Workflow Steps: Center-first then Left & Right Arrange Controller */
function initWorkflowArrangeAnimation() {
  const grid = document.getElementById('workflow-grid-container');
  if (!grid) return;

  const replayBtn = document.getElementById('btn-replay-workflow-arrange');
  let animationTimer = null;

  function triggerWorkflowArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    grid.classList.remove('is-animated');
    grid.classList.remove('arrange-complete');

    void grid.offsetWidth;

    grid.classList.add('is-animated');

    // After 1.95s, all 4 cards have fully settled; release animation locks for hover
    animationTimer = setTimeout(() => {
      grid.classList.add('arrange-complete');
    }, 1950);
  }

  // IntersectionObserver to trigger on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerWorkflowArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  // Replay steps button
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerWorkflowArrange();
    });
  }
}

/* District Scoreboard: One-by-one Arrange Animation Controller */
function initScoreboardArrangeAnimation() {
  const grid = document.getElementById('district-scoreboard-grid');
  if (!grid) return;

  const replayBtn = document.getElementById('btn-replay-scoreboard');
  let animationTimer = null;

  function triggerScoreboardArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    grid.classList.remove('is-animated');
    grid.classList.remove('arrange-complete');

    void grid.offsetWidth;

    grid.classList.add('is-animated');

    // After 1.35s, all 4 cards have completed sequential arrange
    animationTimer = setTimeout(() => {
      grid.classList.add('arrange-complete');
    }, 1350);
  }

  // IntersectionObserver to trigger on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerScoreboardArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  // Replay button
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerScoreboardArrange();
    });
  }
}

/* Featured News Banner: Diagonal Image Split & Content Slide Arrange Controller */
function initFeaturedBannerAnimation() {
  const banner = document.getElementById('featured-news-banner');
  if (!banner) return;

  const replayBtn = document.getElementById('btn-replay-featured-banner');
  let animationTimer = null;

  function triggerBannerArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    banner.classList.remove('is-animated');
    banner.classList.remove('arrange-complete');

    void banner.offsetWidth;

    banner.classList.add('is-animated');

    // After 1.6s, both the diagonal image slices and the content have completed arranging
    animationTimer = setTimeout(() => {
      banner.classList.add('arrange-complete');
    }, 1600);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerBannerArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(banner);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerBannerArrange();
    });
  }
}

/* Blog 6-Card Grid: Convergence and Arrange Animation Controller */
function initBlogGridArrangeAnimation() {
  const grid = document.getElementById('blog-news-grid');
  if (!grid) return;

  const replayBtn = document.getElementById('btn-replay-blog-grid');
  let animationTimer = null;

  function triggerBlogGridArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    grid.classList.remove('is-animated');
    grid.classList.remove('arrange-complete');

    void grid.offsetWidth;

    grid.classList.add('is-animated');

    // After 1.95s, all 6 cards have arrived from their directions and arranged
    animationTimer = setTimeout(() => {
      grid.classList.add('arrange-complete');
    }, 1950);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerBlogGridArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(grid);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerBlogGridArrange();
    });
  }
}

/* Newsletter Subscription: Input from Left & Button from Right Animation & Validation Controller */
function initNewsletterSubscription() {
  const card = document.getElementById('newsletter-subscribe-card');
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email-input');
  const errorMsg = document.getElementById('newsletter-error-msg');

  if (card) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          card.classList.remove('is-animated', 'arrange-complete');
          void card.offsetWidth;
          card.classList.add('is-animated');
          setTimeout(() => {
            card.classList.add('arrange-complete');
          }, 950);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(card);
  }

  if (form && input && errorMsg) {
    input.addEventListener('input', () => {
      input.classList.remove('has-error');
      errorMsg.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();

      // If no email entered, show red error line downside and do NOT go to 404
      if (!email) {
        input.classList.add('has-error');
        errorMsg.textContent = 'Please enter email';
        errorMsg.style.display = 'block';
        input.focus();
        return;
      }

      // Email format check
      if (!email.includes('@') || !email.includes('.')) {
        input.classList.add('has-error');
        errorMsg.textContent = 'Please enter email';
        errorMsg.style.display = 'block';
        input.focus();
        return;
      }

      // After entering email and clicking subscribe, navigate to 404 page
      input.classList.remove('has-error');
      errorMsg.style.display = 'none';
      window.location.href = '404.html';
    });
  }
}

/* Ministerial Briefings: Left, Right & Down Convergence Controller */
function initBriefingsArrangeAnimation() {
  const grid = document.getElementById('media-room-grid');
  if (!grid) return;

  const replayBtn = document.getElementById('btn-replay-briefings');
  let animationTimer = null;

  function triggerBriefingsArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    grid.classList.remove('is-animated');
    grid.classList.remove('arrange-complete');

    void grid.offsetWidth;

    grid.classList.add('is-animated');

    // After 1.45s, all 3 cards have completed arranging
    animationTimer = setTimeout(() => {
      grid.classList.add('arrange-complete');
    }, 1450);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerBriefingsArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerBriefingsArrange();
    });
  }
}

/* Citizen Policy Consultation Poll: Left, Right & Down Convergence Controller */
function initPolicyPollAnimation() {
  const optionsWrap = document.getElementById('policy-poll-options');
  if (!optionsWrap) return;

  const replayBtn = document.getElementById('btn-replay-poll');
  let animationTimer = null;

  function triggerPollArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    optionsWrap.classList.remove('is-animated');
    optionsWrap.classList.remove('arrange-complete');

    void optionsWrap.offsetWidth;

    optionsWrap.classList.add('is-animated');

    // After 1.45s, all 3 options have completed arranging
    animationTimer = setTimeout(() => {
      optionsWrap.classList.add('arrange-complete');
    }, 1450);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerPollArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(optionsWrap);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerPollArrange();
    });
  }
}

/* Emergency Helplines Continuous Horizontal Live Run Marquee Controller */
function initHelplineMarquee() {
  const container = document.getElementById('helpline-marquee-wrapper');
  const toggleBtn = document.getElementById('btn-helpline-marquee-toggle');
  const toggleText = document.getElementById('text-helpline-toggle');
  const toggleIcon = document.getElementById('icon-helpline-pause');

  if (!container || !toggleBtn) return;

  let isPaused = false;

  toggleBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    container.classList.toggle('is-paused', isPaused);
    if (toggleText) {
      toggleText.textContent = isPaused ? 'Resume Live Run' : 'Pause Live Run';
    }
    if (toggleIcon) {
      toggleIcon.innerHTML = isPaused
        ? '<polygon points="5 3 19 12 5 21 5 3"/>'
        : '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    }
  });
}

/* Contact Page: Left (Form) & Right (Collectorate Office) Directional Arrange Animation */
function initContactGridAnimation() {
  const grid = document.getElementById('contact-main-grid');
  if (!grid) return;

  const replayBtn = document.getElementById('btn-replay-contact-cards');
  let animationTimer = null;

  function triggerContactArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    grid.classList.remove('is-animated');
    grid.classList.remove('arrange-complete');

    void grid.offsetWidth;

    grid.classList.add('is-animated');

    // After 1.25s, both left and right cards complete arrange
    animationTimer = setTimeout(() => {
      grid.classList.add('arrange-complete');
    }, 1250);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerContactArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(grid);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerContactArrange();
    });
  }
}

/* Contact Form Validation: Red Color Line Below Invalid Box & 404 Navigation */
function initContactGrievanceForm() {
  const form = document.getElementById('contact-grievance-form');
  if (!form) return;

  const fields = [
    {
      input: document.getElementById('contact-name'),
      error: document.getElementById('err-contact-name'),
      validate: (val) => val.trim().length > 0,
      message: 'Please enter name'
    },
    {
      input: document.getElementById('contact-email'),
      error: document.getElementById('err-contact-email'),
      validate: (val) => val.trim().length > 0 && val.includes('@') && val.includes('.'),
      message: 'Please enter email'
    },
    {
      input: document.getElementById('contact-phone'),
      error: document.getElementById('err-contact-phone'),
      validate: (val) => val.trim().replace(/\D/g, '').length >= 10,
      message: 'Please enter phone number'
    },
    {
      input: document.getElementById('contact-dept'),
      error: document.getElementById('err-contact-dept'),
      validate: (val) => val.trim().length > 0,
      message: 'Please select department'
    },
    {
      input: document.getElementById('contact-message'),
      error: document.getElementById('err-contact-message'),
      validate: (val) => val.trim().length > 0,
      message: 'Please enter message'
    }
  ];

  // Dynamic clear on typing / selecting
  fields.forEach(field => {
    if (!field.input) return;
    const clearEvent = field.input.tagName.toLowerCase() === 'select' ? 'change' : 'input';
    field.input.addEventListener(clearEvent, () => {
      if (field.validate(field.input.value)) {
        field.input.classList.remove('has-error');
        if (field.error) {
          field.error.classList.remove('show');
        }
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;
    let firstInvalidInput = null;

    fields.forEach(field => {
      if (!field.input) return;
      const isValid = field.validate(field.input.value);
      if (!isValid) {
        hasError = true;
        field.input.classList.add('has-error');
        if (field.error) {
          field.error.textContent = field.message;
          field.error.classList.add('show');
        }
        if (!firstInvalidInput) {
          firstInvalidInput = field.input;
        }
      } else {
        field.input.classList.remove('has-error');
        if (field.error) {
          field.error.classList.remove('show');
        }
      }
    });

    if (hasError) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // All fields filled correctly -> navigate to 404 page
    window.location.href = '404.html';
  });
}

/* Dedicated Big Map Section: Clicking navigates to Chrome / Google Maps */
function initSalemMapInteraction() {
  const mapBanner = document.getElementById('salem-interactive-map');
  if (!mapBanner) return;

  mapBanner.addEventListener('click', (e) => {
    // Allows opening Google Maps / Chrome in a new tab or window
    e.preventDefault();
    window.open('https://www.google.com/maps/search/District+Collectorate+Salem+Tamil+Nadu', '_blank');
  });
}

/* Salem District Taluk Directory: 1-by-1 Sequential Arrange Animation Controller */
function initTalukDirectoryAnimation() {
  const list = document.getElementById('taluk-dir-list');
  if (!list) return;

  const replayBtn = document.getElementById('btn-replay-taluk-dir');
  let animationTimer = null;

  function triggerTalukArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    list.classList.remove('is-animated');
    list.classList.remove('arrange-complete');

    void list.offsetWidth;

    list.classList.add('is-animated');

    // After 1.65s, all 5 rows have completed their 1-by-1 sequential arrange
    animationTimer = setTimeout(() => {
      list.classList.add('arrange-complete');
    }, 1650);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerTalukArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(list);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerTalukArrange();
    });
  }
}

/* Appointment Booking: Fields from Down & Button from Right Controller */
function initAppointmentBookingAnimation() {
  const wrap = document.getElementById('appointment-booking-wrap');
  if (!wrap) return;

  const replayBtn = document.getElementById('btn-replay-appointment');
  let animationTimer = null;

  function triggerApptArrange() {
    if (animationTimer) clearTimeout(animationTimer);

    wrap.classList.remove('is-animated');
    wrap.classList.remove('arrange-complete');

    void wrap.offsetWidth;

    wrap.classList.add('is-animated');

    // After 1.35s, both fields and button complete arranging
    animationTimer = setTimeout(() => {
      wrap.classList.add('arrange-complete');
    }, 1350);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerApptArrange();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(wrap);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerApptArrange();
    });
  }
}

/* Appointment Booking Form: Validation with Red Error Lines & 404 Navigation */
function initAppointmentBookingForm() {
  const form = document.getElementById('appointment-booking-form');
  if (!form) return;

  const fields = [
    {
      input: document.getElementById('appt-name'),
      error: document.getElementById('err-appt-name'),
      validate: (val) => val.trim().length > 0,
      message: 'Please enter name'
    },
    {
      input: document.getElementById('appt-phone'),
      error: document.getElementById('err-appt-phone'),
      validate: (val) => val.trim().replace(/\D/g, '').length >= 10,
      message: 'Please enter mobile number'
    },
    {
      input: document.getElementById('appt-taluk'),
      error: document.getElementById('err-appt-taluk'),
      validate: (val) => val.trim().length > 0,
      message: 'Please select taluk'
    },
    {
      input: document.getElementById('appt-officer'),
      error: document.getElementById('err-appt-officer'),
      validate: (val) => val.trim().length > 0,
      message: 'Please select meeting officer'
    },
    {
      input: document.getElementById('appt-summary'),
      error: document.getElementById('err-appt-summary'),
      validate: (val) => val.trim().length > 0,
      message: 'Please enter petition summary'
    }
  ];

  // Dynamic clear on typing or selecting
  fields.forEach(field => {
    if (!field.input) return;
    const clearEvent = field.input.tagName.toLowerCase() === 'select' ? 'change' : 'input';
    field.input.addEventListener(clearEvent, () => {
      if (field.validate(field.input.value)) {
        field.input.classList.remove('has-error');
        if (field.error) {
          field.error.classList.remove('show');
        }
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;
    let firstInvalidInput = null;

    fields.forEach(field => {
      if (!field.input) return;
      const isValid = field.validate(field.input.value);
      if (!isValid) {
        hasError = true;
        field.input.classList.add('has-error');
        if (field.error) {
          field.error.textContent = field.message;
          field.error.classList.add('show');
        }
        if (!firstInvalidInput) {
          firstInvalidInput = field.input;
        }
      } else {
        field.input.classList.remove('has-error');
        if (field.error) {
          field.error.classList.remove('show');
        }
      }
    });

    if (hasError) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // All fields filled correctly -> navigate to 404 page
    window.location.href = '404.html';
  });
}

