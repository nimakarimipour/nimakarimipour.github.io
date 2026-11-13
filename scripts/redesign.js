(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // --- Reveal on scroll (staggered per batch) ---
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (e, i) {
        e.target.style.transitionDelay = (i * 90) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
        setTimeout(function () { e.target.style.transitionDelay = ''; }, 1200 + i * 90);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // --- Active nav section ---
  var navLinks = document.querySelectorAll('.side-nav a');
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.querySelector(a.getAttribute('href'));
  });

  // --- Scroll-linked: progress bar, timeline, active nav ---
  var bar = document.getElementById('scrollProgress');
  var timeline = document.getElementById('timeline');
  var tlItems = timeline ? timeline.querySelectorAll('.tl-item') : [];
  var ticking = false;

  function onScroll() {
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';

    if (timeline) {
      var r = timeline.getBoundingClientRect();
      var mark = vh * 0.6;
      var p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
      timeline.style.setProperty('--p', p.toFixed(4));
      tlItems.forEach(function (li) {
        li.classList.toggle('passed', li.getBoundingClientRect().top + 12 < mark);
      });
    }

    var current = 0;
    sections.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top < vh * 0.4) current = i;
    });
    if (window.scrollY + vh >= document.documentElement.scrollHeight - 4) current = sections.length - 1;
    navLinks.forEach(function (a, i) { a.classList.toggle('active', i === current); });

    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // --- Card spotlight ---
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--y', (e.clientY - r.top) + 'px');
    });
  });

  // --- Read more ---
  document.querySelectorAll('.more-btn').forEach(function (btn) {
    var target = document.getElementById(btn.dataset.target);
    var label = btn.querySelector('.more-label');
    btn.addEventListener('click', function () {
      var open = target.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      label.textContent = open ? 'Show less' : 'Read more';
    });
  });

  // --- Lazy talk embed ---
  var talkBtn = document.getElementById('talkBtn');
  if (talkBtn) {
    talkBtn.addEventListener('click', function () {
      var holder = document.getElementById('talkEmbed');
      holder.id = 'presentation-embed-39014105';
      holder.classList.add('loaded');
      talkBtn.remove();
      var s = document.createElement('script');
      s.src = 'https://slideslive.com/embed_presentation.js';
      s.onload = function () {
        new SlidesLiveEmbed('presentation-embed-39014105', {
          presentationId: '39014105', autoPlay: false, verticalEnabled: true
        });
      };
      document.body.appendChild(s);
    });
  }

  // --- Theme toggle with circular reveal ---
  var toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', function (e) {
    function apply() {
      var dark = root.getAttribute('data-theme') === 'dark';
      if (dark) root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', dark ? 'light' : 'dark');
    }
    if (!document.startViewTransition || reduced) return apply();

    var x = e.clientX, y = e.clientY;
    var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  });
})();
