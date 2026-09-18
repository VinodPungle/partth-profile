(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Section entry reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Active-section indicator in the nav */
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ el: target, link: link });
  });
  function setActive(link) {
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l === link);
      if (l === link) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var current = null;
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          current = entry.target;
          var match = sections.find(function (s) { return s.el === current; });
          if (match) setActive(match.link);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObserver.observe(s.el); });
  }

  /* Certificate thumbnail -> larger view (plain JS, no library) */
  var certButton = document.querySelector('[data-cert-open]');
  var certModal = document.getElementById('cert-modal');
  if (certButton && certModal) {
    var closeButton = certModal.querySelector('[data-cert-close]');
    var lastFocus = null;
    function openModal() {
      lastFocus = document.activeElement;
      certModal.hidden = false;
      document.body.classList.add('modal-open');
      closeButton.focus();
    }
    function closeModal() {
      certModal.hidden = true;
      document.body.classList.remove('modal-open');
      if (lastFocus) lastFocus.focus();
    }
    certButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    certModal.addEventListener('click', function (e) {
      if (e.target === certModal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !certModal.hidden) closeModal();
    });
  }
})();
