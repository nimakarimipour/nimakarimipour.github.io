// Navbar show/hide on scroll
(function () {
  var navbar = document.getElementById('navbar');
  var hero = document.getElementById('hero');

  function onScroll() {
    var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 200;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > heroBottom - 20) {
      navbar.classList.add('visible');
    } else {
      navbar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
