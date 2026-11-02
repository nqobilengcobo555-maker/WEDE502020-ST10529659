/* Student Text Hub - dynamic textbook listings with search, filter and sort */
(function () {
  'use strict';
  var grid = document.getElementById('book-grid');
  if (!grid) return;

  var searchEl = document.getElementById('search');
  var optionEl = document.getElementById('filter-option');
  var sortEl = document.getElementById('sort');
  var availEl = document.getElementById('only-available');
  var countEl = document.getElementById('result-count');
  var modal = document.getElementById('book-modal');
  var modalContent = document.getElementById('modal-content');
  var books = [];

  /* Used only if data/books.json cannot be fetched (e.g. opening the file locally) */
  var FALLBACK = [
    {id:1,title:'Accounting 101',author:'T. Mokoena',isbn:'9780000000011',course:'Accounting',category:'Commerce',option:'buy',price:350,available:true,image:'images/accounting-textbook.svg',description:'First-year financial accounting with worked examples. Light highlighting only.'},
    {id:2,title:'Biology Essentials',author:'L. van der Merwe',isbn:'9780000000028',course:'Biology',category:'Science',option:'rent',price:90,available:true,image:'images/biology-textbook.svg',description:'Core cell biology and genetics. Rental price is per month.'},
    {id:3,title:'Engineering Maths',author:'S. Naidoo',isbn:'9780000000035',course:'Engineering',category:'Engineering',option:'borrow',price:0,available:true,image:'images/engineering-textbook.svg',description:'Calculus and linear algebra for engineers. Free to borrow for up to 14 days.'},
    {id:4,title:'Introduction to Law',author:'P. Dlamini',isbn:'9780000000042',course:'Law',category:'Law',option:'buy',price:420,available:false,image:'images/law-textbook.svg',description:'South African legal system overview. Currently reserved by another student.'},
    {id:5,title:'Programming Basics',author:'K. Pillay',isbn:'9780000000059',course:'Information Technology',category:'IT',option:'rent',price:75,available:true,image:'images/it-textbook.svg',description:'Beginner programming concepts. Rental price is per month.'},
    {id:6,title:'Economics Today',author:'R. Khumalo',isbn:'9780000000066',course:'Economics',category:'Commerce',option:'buy',price:280,available:true,image:'images/economics-textbook.svg',description:'Micro and macroeconomics with South African case studies.'}
  ];

  function priceText(b) {
    if (b.option === 'borrow') return 'Free to borrow';
    return 'R' + b.price + (b.option === 'rent' ? ' / month' : '');
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function render(list) {
    grid.textContent = '';
    countEl.textContent = list.length + (list.length === 1 ? ' textbook found' : ' textbooks found');
    if (!list.length) {
      grid.appendChild(el('li', 'empty', 'No textbooks match your search. Try different keywords or clear the filters.'));
      return;
    }
    list.forEach(function (b) {
      var li = el('li', 'book-card');
      var img = el('img');
      img.src = b.image; img.alt = b.title + ' textbook cover'; img.width = 300; img.height = 400; img.loading = 'lazy';
      li.appendChild(img);
      li.appendChild(el('h3', '', b.title));
      li.appendChild(el('p', 'book-meta', b.author + ' \u2022 ' + b.course));
      var tags = el('p', 'book-tags');
      tags.appendChild(el('span', 'tag tag-' + b.option, b.option.charAt(0).toUpperCase() + b.option.slice(1)));
      tags.appendChild(el('span', 'tag ' + (b.available ? 'tag-yes' : 'tag-no'), b.available ? 'Available' : 'Reserved'));
      li.appendChild(tags);
      li.appendChild(el('p', 'book-price', priceText(b)));
      var btn = el('button', 'btn btn-small', 'View details');
      btn.type = 'button';
      btn.addEventListener('click', function () { openDetails(b, btn); });
      li.appendChild(btn);
      grid.appendChild(li);
    });
  }

  function apply() {
    var q = searchEl.value.trim().toLowerCase();
    var opt = optionEl.value;
    var list = books.filter(function (b) {
      var hay = (b.title + ' ' + b.author + ' ' + b.isbn + ' ' + b.course + ' ' + b.category).toLowerCase();
      return (!q || hay.indexOf(q) !== -1) &&
             (opt === 'all' || b.option === opt) &&
             (!availEl.checked || b.available);
    });
    var s = sortEl.value;
    list.sort(function (a, b) {
      if (s === 'price-asc') return a.price - b.price;
      if (s === 'price-desc') return b.price - a.price;
      return a.title.localeCompare(b.title);
    });
    render(list);
  }

  function openDetails(b, trigger) {
    modalContent.textContent = '';
    var img = el('img', 'modal-img'); img.src = b.image; img.alt = b.title + ' textbook cover'; img.width = 300; img.height = 400;
    var h = el('h2', '', b.title); h.id = 'modal-title';
    modalContent.appendChild(img);
    modalContent.appendChild(h);
    modalContent.appendChild(el('p', '', b.description));
    var dl = el('dl', 'details');
    [['Author', b.author], ['ISBN', b.isbn], ['Course', b.course], ['Option', b.option], ['Price', priceText(b)], ['Status', b.available ? 'Available now' : 'Currently reserved']].forEach(function (r) {
      dl.appendChild(el('dt', '', r[0])); dl.appendChild(el('dd', '', r[1]));
    });
    modalContent.appendChild(dl);
    var link = el('a', 'btn', 'Enquire about this book');
    link.href = 'enquiry.html?book=' + encodeURIComponent(b.title);
    modalContent.appendChild(link);
    modal.showModal();
    modal.addEventListener('close', function () { trigger.focus(); }, { once: true });
  }

  modal.querySelector('.modal-close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });

  [searchEl, optionEl, sortEl, availEl].forEach(function (c) {
    c.addEventListener('input', apply);
    c.addEventListener('change', apply);
  });
  document.getElementById('filter-form').addEventListener('submit', function (e) { e.preventDefault(); });

  /* Pre-fill from the home page Quick Book Search (?q=...&option=...) */
  var params = new URLSearchParams(window.location.search);
  if (params.get('q')) searchEl.value = params.get('q').slice(0, 80);
  if (['buy', 'rent', 'borrow'].indexOf(params.get('option')) !== -1) optionEl.value = params.get('option');

  /* Dynamically load the listings (AJAX) */
  fetch('data/books.json')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .catch(function () { return FALLBACK; })
    .then(function (data) { books = data; apply(); });
})();
