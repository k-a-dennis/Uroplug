/* ============================================
   MEDVANCE — Site JavaScript
   Navigation, Scroll Animations, Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initHeroSummary();
  initAccordions();
  initCountUp();
  highlightActiveNav();
  initScrollVideo();
  initRoadmap();
  initFundsChart();
});

/* --- NAVIGATION --- */
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');

  const onScroll = () => {
    if (window.innerWidth > 768) {
      nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    } else {
      nav.classList.remove('nav--scrolled'); // strip it if viewport shrinks
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('nav__toggle--active');
      mobileMenu.classList.toggle('nav__mobile--open');
      document.body.style.overflow = mobileMenu.classList.contains('nav__mobile--open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('nav__toggle--active');
        mobileMenu.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --- HIGHLIGHT ACTIVE NAV LINK --- */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });
}

/* --- SCROLL REVEAL ANIMATIONS --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .stagger-children');

  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('stagger-children')) {
          entry.target.classList.add('stagger-children--visible');
        } else {
          entry.target.classList.add('reveal--visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- HERO SUMMARY REVEAL --- */
/* Targets the inner content elements (label, text, link) inside each segment.
   The segment backgrounds are always visible; only the content fades in. */
function initHeroSummary() {
  const els = document.querySelectorAll('.hero-summary .reveal');
  if (!els.length) return;

  els.forEach(el => {
    const existingDelay = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
    setTimeout(() => el.classList.add('reveal--visible'), 50 + existingDelay);
  });
}

/* --- ACCORDION --- */
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const isOpen = trigger.classList.contains('accordion__trigger--open');

      // Close all others in same accordion
      const accordion = trigger.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion__trigger--open').forEach(t => {
          t.classList.remove('accordion__trigger--open');
          t.nextElementSibling.classList.remove('accordion__content--open');
        });
      }

      if (!isOpen) {
        trigger.classList.add('accordion__trigger--open');
        content.classList.add('accordion__content--open');
      }
    });
  });
}

/* --- COUNT-UP ANIMATION --- */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* --- SMOOTH SCROLL FOR ANCHOR LINKS --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: 'smooth' });
});

/* --- PARALLAX (subtle, on hero backgrounds) --- */
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

// Initialize parallax if elements exist
initParallax();


/* --- SCROLL-TRIGGERED VIDEO PLAYBACK --- */
function initScrollVideo() {
  const videos = document.querySelectorAll('[data-play-on-scroll]');

  if (!videos.length) return;

  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.load();
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(video => observer.observe(video));
}

function initRoadmap() {
  var root = document.getElementById('roadmap');
  if (!root) return;   // ← failsafe: exits silently on pages without the roadmap div

  /* ── DATA ─────────────────────────────────────────────────────
     STAGES and MILESTONES edits here to update the roadmap.
     Add a new stage by pushing to STAGES and adding a color to COLORS.
     Add a milestone by pushing to MILESTONES with the matching stage id.
  ──────────────────────────────────────────────────────────────── */

  var STAGES = [
    { id: 'pre',  label: 'Pre-seed', time: 'Complete',            done: false },
    { id: 'seed', label: 'Seed',     time: 'Q3 2026 → Q2 2027',   done: false },
    { id: 'a',    label: 'Series A', time: 'Q2 2027 → Q1 2028',   done: false },
    { id: 'b',    label: 'Series B', time: 'Q1 2028 → Q1 2029',   done: false },
  ];

  // position: 'above' | 'below'
  // status:   'done' | 'active' | 'upcoming' | 'future'
  var MILESTONES = [
    { stage: 'pre',  position: 'above', label: 'Operations',               title: 'Secure Manufacturing',     sub: 'Final Materials + Assembly',                    status: 'done'     },
    { stage: 'pre',  position: 'above', label: 'Operations',               title: 'CRO Partnership',          sub: 'Yale Medicine Onboarded',                       status: 'done'     },
    { stage: 'pre',  position: 'below', label: 'Regulatory',               title: 'FDA / IRB Engagement',     sub: 'Pre-submission Meeting Secured',                status: 'done'     },
    { stage: 'pre',  position: 'below', label: 'Intellectual Property',    title: 'Patents Issued',           sub: '3 Awarded, 2 Pending',                          status: 'done'     },

    { stage: 'seed', position: 'above', label: 'Regulatory',               title: 'Biocompatibility + IDE',   sub: 'Secure Investigational Device Exemption',       status: 'active'   },
    { stage: 'seed', position: 'above', label: 'Regulatory',               title: 'FDA Engagement',           sub: 'Supplements & Q-subs',                          status: 'active'   },
    { stage: 'seed', position: 'below', label: 'Operations',               title: '1st Manufacturing Run',    sub: 'For Feasibility Study',                         status: 'active'   },
    { stage: 'seed', position: 'below', label: 'Clinical',                 title: 'Early Feasibility Study',  sub: 'Conducted Through Yale Med',                    status: 'active'   },


    { stage: 'a',    position: 'above', label: 'Clinical',                title: 'Feasibility Study',         sub: 'At Yale Med',                                   status: 'upcoming' },
    { stage: 'a',    position: 'above', label: 'Regulatory',              title: 'FDA Submission Prep',       sub: 'Anticipated Class II Pathway',                  status: 'upcoming' },
    { stage: 'a',    position: 'below', label: 'Operations',              title: '2nd Manufacturing Run',     sub: 'For Pivotal Study',                             status: 'upcoming' },
    { stage: 'a',    position: 'below', label: 'Intellectual Property',   title: 'Continuation Filings',      sub: 'International Expansion',                       status: 'upcoming' },

    { stage: 'b',    position: 'above', label: 'Clinical',                title: 'Pivotal Study Launch',      sub: 'Multi-Site Enrollment',                         status: 'future'   },
    { stage: 'b',    position: 'above', label: 'Regulatory',              title: 'FDA Submission Filed',      sub: 'Class II 510(k) or De Novo',                    status: 'future'   },
    { stage: 'b',    position: 'below', label: 'Operations',              title: 'Commercial Scale-up',       sub: 'Manufacturing Partnerships',                    status: 'future'   },
    { stage: 'b',    position: 'below', label: 'Market',                  title: 'Market Preparation',        sub: 'KOL Network, Payor Strategy',                   status: 'future'   },
  ];

  var COLORS = ['#0E4A5C', '#0A6E72', '#0D8C84', '#12A896'];

  var LEGEND = [
    { color: '#99eeb3', border: false,  label: 'Completed'          },
    { color: '#B0DCE5', border: false,  label: 'In progress'        },
    { color: '#7FC5BB', border: false,  label: 'Upcoming'           },
    { color: '#B8D8D5', border: true,   label: 'Future'             },
  ];

  /* ── HELPERS ── */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function makeCard(m) {
    var card = el('div', 'rm-card rm-card--' + m.status);
    card.innerHTML =
      '<div class="rm-card__label">' + m.label + '</div>' +
      '<div class="rm-card__title">' + m.title + '</div>' +
      (m.sub ? '<div class="rm-card__sub">' + m.sub + '</div>' : '');
    return card;
  }

  function makeChevronInner(stage) {
    return '<div class="rm-ch-label">Stage</div>' +
      '<div class="rm-ch-title">' + stage.label + '</div>' +
      '<div class="rm-ch-time">' + stage.time + '</div>' +
      (stage.done ? '<div class="rm-done-badge">Complete</div>' : '');
  }

  /* ── BUILD ── */
  var root = document.getElementById('roadmap');
  var spine = el('div', 'rm-spine');

  STAGES.forEach(function (stage, i) {
    var color = COLORS[i] || COLORS[COLORS.length - 1];
    var mAbove = MILESTONES.filter(function(m){ return m.stage === stage.id && m.position === 'above'; });
    var mBelow = MILESTONES.filter(function(m){ return m.stage === stage.id && m.position === 'below'; });
    var allM   = mAbove.concat(mBelow);

    var col = el('div', 'rm-col');
    col.style.setProperty('--rm-col-color', color);

    /* Above */
    var above = el('div', 'rm-col__above');
    mAbove.forEach(function(m){ above.appendChild(makeCard(m)); });

    /* Chevron */
    var chev = el('div', 'rm-chevron');
    var bg   = el('div', 'rm-chevron__bg');
    bg.style.background = color;
    var inner = el('div', 'rm-chevron__inner', makeChevronInner(stage));
    chev.appendChild(bg);
    chev.appendChild(inner);

    /* Below */
    var below = el('div', 'rm-col__below');
    mBelow.forEach(function(m){ below.appendChild(makeCard(m)); });

    /* Mobile header */
    var mobileHeader = el('div', 'rm-col__mobile-header');
    mobileHeader.style.background = color;
    mobileHeader.innerHTML = makeChevronInner(stage);

    /* Mobile card block */
    var mobileCards = el('div', 'rm-col__mobile');
    allM.forEach(function(m){ mobileCards.appendChild(makeCard(m)); });

    col.appendChild(above);
    col.appendChild(chev);
    col.appendChild(below);
    col.appendChild(mobileHeader);
    col.appendChild(mobileCards);
    spine.appendChild(col);
  });

  /* Legend */
  var legend = el('div', 'rm-legend');
  LEGEND.forEach(function(l){
    var item = el('div', 'rm-legend__item');
    var swatch = el('div', 'rm-legend__swatch');
    swatch.style.background = l.color;
    if (l.border) swatch.style.border = '1.5px dashed #6BB5AB';
    item.appendChild(swatch);
    item.appendChild(document.createTextNode(l.label));
    legend.appendChild(item);
  });

  root.appendChild(spine);
  root.appendChild(legend);
}

// Investors Page UoF Pie Chart //
function initFundsChart() {
  var canvas = document.getElementById('fundsChart');
  if (!canvas) return;

  var isDark = matchMedia('(prefers-color-scheme: dark)').matches;

  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: ['Manufacturing', 'Regulatory', 'Operations', 'Study Ops', 'Legal'],
      datasets: [{
        data: [40, 22, 19, 15, 4],
        backgroundColor: ['#0A6E72', '#0D8C84', '#12A896', '#0E4A5C', '#1DC5A8'],
        borderColor: isDark ? '#1a1a1a' : '#ffffff',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return '  ' + ctx.label + ': ' + ctx.parsed + '%';
            }
          }
        }
      },
      animation: { animateRotate: true, duration: 900 }
    },
    plugins: [{
      id: 'sliceLabels',
      afterDatasetDraw: function (chart) {
        var ctx  = chart.ctx;
        var data = chart.data;
        var meta = chart.getDatasetMeta(0);
        meta.data.forEach(function (arc, i) {
          var pct   = data.datasets[0].data[i];
          var label = data.labels[i];
          if (pct < 5) return;
          var cx   = chart.getDatasetMeta(0).data[i].x;
          var cy   = chart.getDatasetMeta(0).data[i].y;
          var pos  = arc.tooltipPosition();
          var pos  = {
            x: cx + (arc.tooltipPosition().x - cx) * 1.2,
            y: cy + (arc.tooltipPosition().y - cy) * 1.2
          };
          ctx.save();
          ctx.font         = '600 16px Outfit, sans-serif';
          ctx.fillStyle    = '#ffffff';
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, pos.x, pos.y - 7);
          ctx.font      = '500 15px Outfit, sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillText(pct + '%', pos.x, pos.y + 8);
          ctx.restore();
        });
      }
    }]
  });
}