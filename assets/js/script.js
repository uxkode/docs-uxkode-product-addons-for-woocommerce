/**
 * DOM Utility Functions
 */
(function () {
  'use strict';

  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.prototype.slice.call((scope || document).querySelectorAll(selector));

  const html = document.documentElement;
  const body = document.body;

  function setYear() {
    const y = new Date().getFullYear();
    const el = $('#year');
    if (el) el.textContent = String(y);
  }

  function initThemeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      html.classList.toggle('dark');
      try {
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
      } catch (e) {}
    });
  }

  function initMobileDrawer() {
    const toggle = $('#menuToggle');
    const overlay = $('#overlay');
    if (!toggle || !overlay) return;

    function open() {
      body.classList.add('sidebar-open');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.hidden = false;
    }
    function close() {
      body.classList.remove('sidebar-open');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.hidden = true;
    }

    toggle.addEventListener('click', function () {
      if (body.classList.contains('sidebar-open')) close();
      else open();
    });
    overlay.addEventListener('click', close);
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function initLinkableHeadings() {
    const headings = $$('main h2, main h3');
    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent || 'section');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = 'anchor-link';
      a.setAttribute('aria-label', 'Link to this section');
      a.textContent = '#';
      h.appendChild(a);
    });
  }

  function initScrollSpy() {
    const sidebarLinks = $$('.sidebar a');
    const headings = $$('main h2');
    if (headings.length === 0 || sidebarLinks.length === 0) return;

    const map = {};
    sidebarLinks.forEach(function (lnk) {
      if (lnk.hash) map[lnk.hash.substring(1)] = lnk;
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          sidebarLinks.forEach(function (lnk) {
            lnk.classList.remove('is-active');
          });
          if (map[id]) map[id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-50% 0px -40% 0px', threshold: [0, 1] });

    headings.forEach(function (h) {
      observer.observe(h);
    });
  }

  function initSearch() {
    const input = $('#docSearch');
    const links = $$('.sidebar a');
    if (!input) return;
    input.addEventListener('input', function () {
      const q = input.value.trim().toLowerCase();
      links.forEach(function (lnk) {
        const text = (lnk.textContent || '').toLowerCase();
        const hit = !q || text.indexOf(q) !== -1;
        lnk.parentElement.style.display = hit ? '' : 'none';
      });
    });
  }

  function init() {
    setYear();
    initThemeToggle();
    initMobileDrawer();
    initLinkableHeadings();
    initScrollSpy();
    initSearch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();