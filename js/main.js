/* Student Text Hub - shared interactions (vanilla JS, no external libraries) */
(function () {
  'use strict';

  /* ---------- Mobile navigation toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Scroll reveal animation ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.querySelector('.accordion-icon').textContent = expanded ? '+' : '\u2212';
      panel.hidden = expanded;
    });
  });

  /* ---------- Tabs (with arrow-key support) ---------- */
  document.querySelectorAll('.tabs').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select(tabs[(i + 1) % tabs.length]); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length]); }
      });
    });
  });

  /* ---------- Lightbox gallery (native <dialog>) ---------- */
  var gallery = document.getElementById('gallery');
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.gallery-item'));
    var current = 0;
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Image viewer');
    var fig = document.createElement('figure');
    var img = document.createElement('img');
    var cap = document.createElement('figcaption');
    fig.appendChild(img); fig.appendChild(cap);
    function mkBtn(cls, label, text) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = cls; b.setAttribute('aria-label', label); b.textContent = text;
      return b;
    }
    var closeBtn = mkBtn('lightbox-close', 'Close image', '\u00d7');
    var prevBtn = mkBtn('lightbox-nav lightbox-prev', 'Previous image', '\u2039');
    var nextBtn = mkBtn('lightbox-nav lightbox-next', 'Next image', '\u203a');
    [closeBtn, prevBtn, nextBtn, fig].forEach(function (n) { dlg.appendChild(n); });
    document.body.appendChild(dlg);

    function show(i) {
      current = (i + items.length) % items.length;
      var it = items[current];
      img.src = it.getAttribute('data-full');
      img.alt = it.querySelector('img').alt;
      cap.textContent = it.getAttribute('data-caption');
    }
    items.forEach(function (it, i) {
      it.addEventListener('click', function () { show(i); dlg.showModal(); });
    });
    closeBtn.addEventListener('click', function () { dlg.close(); });
    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Campus map selector (embedded map, no map library) ---------- */
  var campus = document.getElementById('campus-select');
  var frame = document.getElementById('campus-map');
  var mapLink = document.getElementById('map-link');
  if (campus && frame) {
    campus.addEventListener('change', function () {
      var q = encodeURIComponent(campus.value);
      frame.src = 'https://www.google.com/maps?q=' + q + '&output=embed';
      if (mapLink) mapLink.href = 'https://www.google.com/maps/search/?api=1&query=' + q;
    });
  }
})();
