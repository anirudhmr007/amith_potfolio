/* ============================================================
   AMITH KRISHNA — PORTFOLIO JS
   Animations, Interactions & Dynamic Effects
   ============================================================ */

(function () {
  'use strict';

  // ── PRELOADER ──────────────────────────────────────────────
  const preloader     = document.getElementById('preloader');
  const preloaderCount = document.getElementById('preloaderCount');
  const preloaderBar  = document.getElementById('preloaderBar');

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 12 + 3;
    if (loadProgress >= 100) loadProgress = 100;
    const val = Math.round(loadProgress);
    preloaderCount.textContent = val;
    preloaderBar.style.width = val + '%';
    if (val >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.style.overflow = '';
        initAll();
      }, 400);
    }
  }, 60);

  // Block scroll while loading
  document.body.style.overflow = 'hidden';

  // ── INIT ALL ───────────────────────────────────────────────
  function initAll() {
    initLenis();
    initCursor();
    initClock();
    initHeader();
    initMobileMenu();
    initHeroParallax();
    initScrollAnimations();
    initWorkFilter();
    initVideoCards();
    initLightbox();
    initQuoteBuilder();
    initCopyEmail();
    initContactForm();
    initBackToTop();
    initSoftwareCards();
    initCounters();
    initMagnetic();
  }

  // ── LENIS SMOOTH SCROLL ────────────────────────────────────
  let lenis;
  function initLenis() {
    lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Anchor links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -100 });
          // Close mobile menu if open
          const mm = document.getElementById('mobileMenu');
          if (mm.classList.contains('open')) toggleMobileMenu();
        }
      });
    });
  }

  // ── CUSTOM CURSOR ──────────────────────────────────────────
  function initCursor() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const label = ring.querySelector('.cursor-label');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Smooth lag for ring
    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    const interactives = document.querySelectorAll('a, button, .magnetic, input, textarea, select, .styled-range');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Work card cursor
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        document.body.classList.remove('cursor-hover');
        document.body.classList.add('cursor-work');
        label.textContent = card.dataset.cursor || 'VIEW';
      });
      card.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-work');
      });
    });
  }

  // ── LIVE CLOCK ─────────────────────────────────────────────
  function initClock() {
    const clockEl = document.getElementById('liveClock');
    function update() {
      const now = new Date();
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const h = String(ist.getHours()).padStart(2, '0');
      const m = String(ist.getMinutes()).padStart(2, '0');
      clockEl.textContent = `KERALA, IN: ${h}:${m} IST`;
    }
    update();
    setInterval(update, 30000);
  }

  // ── HEADER SCROLL BEHAVIOR ─────────────────────────────────
  function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      onUpdate: (self) => {
        const scroll = self.scroll();
        if (scroll > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        lastScroll = scroll;
      }
    });
  }

  // ── MOBILE MENU ────────────────────────────────────────────
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    toggle.addEventListener('click', toggleMobileMenu);
  }

  function toggleMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu   = document.getElementById('mobileMenu');
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
    if (menu.classList.contains('open')) {
      if (lenis) lenis.stop();
    } else {
      if (lenis) lenis.start();
    }
  }

  // ── HERO PARALLAX (MOUSE TILT) ────────────────────────────
  function initHeroParallax() {
    const hero = document.getElementById('hero');
    const nameWrap = document.getElementById('heroNameWrap');
    const portrait = document.getElementById('heroPortrait');
    const fgElements = document.querySelectorAll('.hero-foreground [data-parallax-factor]');

    if (window.matchMedia('(max-width: 768px)').matches) {
      // Mobile: use device orientation
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma == null) return;
        const x = e.gamma / 45; // -1 to 1
        const y = (e.beta - 45) / 45;
        applyParallax(x, y);
      });
    } else {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        applyParallax(x * 2, y * 2); // normalize to -1 to 1
      });
    }

    function applyParallax(x, y) {
      // Name moves opposite (behind)
      const nameFactor = -0.02;
      gsap.to(nameWrap, {
        x: x * nameFactor * window.innerWidth,
        y: y * nameFactor * window.innerHeight,
        duration: 0.8,
        ease: 'power2.out'
      });

      // Portrait moves forward
      const portraitFactor = 0.04;
      gsap.to(portrait, {
        x: x * portraitFactor * window.innerWidth,
        y: y * portraitFactor * window.innerHeight,
        duration: 0.8,
        ease: 'power2.out'
      });

      // Foreground elements
      fgElements.forEach(el => {
        const f = parseFloat(el.dataset.parallaxFactor) || 0.05;
        gsap.to(el, {
          x: x * f * window.innerWidth,
          y: y * f * window.innerHeight,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    }

    // Hero entrance animation
    gsap.timeline({ delay: 1.5 })
      .from('.hero-name', {
        y: 100, opacity: 0,
        duration: 1.2, ease: 'power3.out'
      })
      .from('.hero-portrait', {
        y: 80, opacity: 0, scale: 0.95,
        duration: 1, ease: 'power3.out'
      }, '-=0.8')
      .from('.hero-foreground > *', {
        y: 30, opacity: 0,
        duration: 0.8, ease: 'power3.out',
        stagger: 0.1
      }, '-=0.6')
      .from('.hero-label, .hero-bottom-left, .hero-bottom-right', {
        y: 20, opacity: 0,
        duration: 0.6, ease: 'power3.out',
        stagger: 0.1
      }, '-=0.4')
      .from('.scroll-indicator', {
        y: 10, opacity: 0,
        duration: 0.5, ease: 'power3.out'
      }, '-=0.2');
  }

  // ── SCROLL REVEAL ANIMATIONS ───────────────────────────────
  function initScrollAnimations() {
    // Reveal elements
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.to(el, {
        y: 0, opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.to(el, {
        x: 0, opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.to(el, {
        x: 0, opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Stagger work cards
    gsap.utils.toArray('.work-card').forEach((card, i) => {
      gsap.from(card, {
        y: 60, opacity: 0,
        duration: 0.7,
        delay: i * 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Marquee speed on scroll velocity
    ScrollTrigger.create({
      trigger: '.marquee-section',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity());
        const speed = Math.max(30 - vel * 0.01, 5);
        document.querySelectorAll('.marquee-track').forEach(track => {
          track.style.animationDuration = speed + 's';
        });
      }
    });

    // Velocity-based text skewing
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const vel = self.getVelocity();
        const skew = Math.max(-3, Math.min(3, vel * 0.003));
        gsap.to('.section-title, .about-headline, .vault-headline', {
          skewY: skew,
          duration: 0.3,
          ease: 'power2.out'
        });
        // Reset skew
        gsap.to('.section-title, .about-headline, .vault-headline', {
          skewY: 0,
          duration: 0.8,
          delay: 0.15,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    });
  }

  // ── WORKS FILTER ───────────────────────────────────────────
  function initWorkFilter() {
    const btns  = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.work-card');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden');
            gsap.fromTo(card,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ── VIDEO CARDS (HOVER PLAY) ───────────────────────────────
  function initVideoCards() {
    const videoCards = document.querySelectorAll('.work-card--video');
    videoCards.forEach(card => {
      const video = card.querySelector('video');
      if (!video) return;

      card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
        card.querySelector('.play-badge').textContent = '⏸ PLAYING';
      });

      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
        card.querySelector('.play-badge').textContent = '▶ PLAY';
      });
    });
  }

  // ── LIGHTBOX ───────────────────────────────────────────────
  function initLightbox() {
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lightboxImg');
    const lbVideo   = document.getElementById('lightboxVideo');
    const lbMeta    = document.getElementById('lightboxMeta');
    const lbClose   = document.getElementById('lightboxClose');

    // Click on image work cards
    document.querySelectorAll('.work-card:not(.work-card--video)').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('h3')?.textContent || '';
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbImg.style.display = 'block';
        lbVideo.style.display = 'none';
        lbVideo.pause();
        lbMeta.textContent = title;
        lightbox.classList.add('open');
        if (lenis) lenis.stop();
      });
    });

    // Click on video work cards
    document.querySelectorAll('.work-card--video').forEach(card => {
      card.addEventListener('click', () => {
        const video = card.querySelector('video');
        const title = card.querySelector('h3')?.textContent || '';
        lbVideo.src = video.src;
        lbImg.style.display = 'none';
        lbVideo.style.display = 'block';
        lbVideo.play();
        lbMeta.textContent = title;
        lightbox.classList.add('open');
        if (lenis) lenis.stop();
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lbVideo.pause();
      lbVideo.src = '';
      lbImg.src = '';
      if (lenis) lenis.start();
    }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === ' ') {
        e.preventDefault();
        if (lbVideo.style.display === 'block') {
          lbVideo.paused ? lbVideo.play() : lbVideo.pause();
        }
      }
      if (e.key.toLowerCase() === 'm' && lbVideo.style.display === 'block') {
        lbVideo.muted = !lbVideo.muted;
      }
    });
  }

  // ── PROJECT SCOPE PLANNER (TALENT SHOWCASE) ───────────────
  function initQuoteBuilder() {
    const posterSlider = document.getElementById('posterSlider');
    const reelSlider   = document.getElementById('reelSlider');
    const posterVal    = document.getElementById('posterVal');
    const reelVal      = document.getElementById('reelVal');
    const scopeSummary = document.getElementById('scopeSummary');
    const waBtn        = document.getElementById('quoteWhatsApp');
    const speedBtns    = document.querySelectorAll('.speed-btn');

    let currentSpeed = 'Standard';

    function updateScope() {
      const posters = parseInt(posterSlider.value);
      const reels   = parseInt(reelSlider.value);
      posterVal.textContent = posters;
      reelVal.textContent = reels;

      const summaryText = `${posters} Visual${posters !== 1 ? 's' : ''} + ${reels} Reel${reels !== 1 ? 's' : ''} (${currentSpeed} Timeline)`;
      if (scopeSummary) {
        scopeSummary.textContent = summaryText;
      }

      // Pre-fill WhatsApp message (focus on talent & collaboration, zero pricing)
      const msg = encodeURIComponent(
        `Hi Amith, I saw your portfolio and would like to discuss a project:\n• Visuals/Posters: ${posters}\n• Video Edits/Reels: ${reels}\n• Timeline Urgency: ${currentSpeed}\n\nLet's connect and discuss this collaboration!`
      );
      if (waBtn) {
        waBtn.href = `https://wa.me/919495528647?text=${msg}`;
      }
    }

    if (posterSlider && reelSlider) {
      posterSlider.addEventListener('input', updateScope);
      reelSlider.addEventListener('input', updateScope);

      speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          speedBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentSpeed = btn.dataset.speed || btn.textContent.trim();
          updateScope();
        });
      });

      updateScope();
    }
  }

  // ── COPY EMAIL ─────────────────────────────────────────────
  function initCopyEmail() {
    const copyBtn  = document.getElementById('copyEmail');
    const toast    = document.getElementById('toast');
    const emailTxt = document.getElementById('emailText');

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailTxt.textContent).then(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      });
    });
  }

  // ── CONTACT FORM → WHATSAPP ────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('formName').value;
      const email   = document.getElementById('formEmail').value;
      const type    = document.getElementById('formType').value;
      const message = document.getElementById('formMessage').value;

      const waMsg = encodeURIComponent(
        `Hi Amith,\n\nName: ${name}\nContact: ${email}\nProject Type: ${type}\n\nMessage:\n${message}\n\n— Sent from your portfolio`
      );
      window.open(`https://wa.me/919495528647?text=${waMsg}`, '_blank');
    });
  }

  // ── BACK TO TOP ────────────────────────────────────────────
  function initBackToTop() {
    document.getElementById('backToTop').addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.5 });
    });
  }

  // ── SOFTWARE CARDS (set accent color) ──────────────────────
  function initSoftwareCards() {
    document.querySelectorAll('.software-card').forEach(card => {
      const color = card.dataset.color;
      card.style.setProperty('--card-accent', color);

      card.addEventListener('mouseenter', () => {
        card.style.borderColor = color;
        card.style.boxShadow = `0 12px 40px ${color}22`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      });
    });

    // Animate proficiency bars on scroll
    document.querySelectorAll('.proficiency-fill').forEach(bar => {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          bar.style.width = bar.dataset.width + '%';
        }
      });
    });
  }

  // ── ANIMATED COUNTERS ──────────────────────────────────────
  function initCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.count);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val);
            }
          });
        }
      });
    });
  }

  // ── MAGNETIC HOVER EFFECT ──────────────────────────────────
  function initMagnetic() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        gsap.to(el, {
          x: dx * 0.3,
          y: dy * 0.3,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

})();
