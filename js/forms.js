/* Student Text Hub - form validation, AJAX enquiry and email compilation */
(function () {
  'use strict';

  var FALLBACK_BOOKS = [
    {title:'Accounting 101',isbn:'9780000000011',option:'buy',price:350,available:true},
    {title:'Biology Essentials',isbn:'9780000000028',option:'rent',price:90,available:true},
    {title:'Engineering Maths',isbn:'9780000000035',option:'borrow',price:0,available:true},
    {title:'Introduction to Law',isbn:'9780000000042',option:'buy',price:420,available:false},
    {title:'Programming Basics',isbn:'9780000000059',option:'rent',price:75,available:true},
    {title:'Economics Today',isbn:'9780000000066',option:'buy',price:280,available:true}
  ];

  /* ---------- Validation helpers ---------- */
  function errorEl(field) { return document.getElementById(field.id + '-error'); }

  function validateField(f) {
    var v = f.value.trim();
    var msg = '';
    if (f.required && !v) {
      msg = f.dataset.requiredMsg || 'This field is required.';
    } else if (v) {
      if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        msg = f.dataset.typeMsg || 'Enter a valid email address.';
      } else if (f.minLength > 0 && v.length < f.minLength) {
        msg = f.dataset.shortMsg || ('Enter at least ' + f.minLength + ' characters.');
      } else if (f.dataset.kind === 'phone') {
        /* South African numbers: 0821234567 or +27821234567 (spaces/dashes ignored) */
        var digits = v.replace(/[\s\-()]/g, '');
        if (!/^(\+27|0)[1-9][0-9]{8}$/.test(digits)) msg = 'Enter a valid South African phone number, e.g. 082 123 4567 or +27 82 123 4567.';
      } else if (f.dataset.kind === 'future-date') {
        var d = new Date(v + 'T00:00:00');
        var today = new Date(); today.setHours(0, 0, 0, 0);
        if (isNaN(d.getTime()) || d < today) msg = 'Please choose today\u2019s date or a future date.';
      }
    }
    var out = errorEl(f);
    if (out) out.textContent = msg;
    f.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (out) { if (msg) f.setAttribute('aria-describedby', out.id); else f.removeAttribute('aria-describedby'); }
    return !msg;
  }

  function setupForm(form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validateField(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') validateField(f); });
    });
    var ta = form.querySelector('textarea');
    var counter = ta && document.getElementById(ta.id + '-count');
    if (ta && counter) {
      ta.addEventListener('input', function () { counter.textContent = ta.value.length + ' / ' + ta.maxLength; });
    }
    var date = form.querySelector('input[type="date"]');
    if (date) date.min = new Date().toISOString().slice(0, 10);
    return fields;
  }

  function validateAll(fields) {
    var firstBad = null;
    fields.forEach(function (f) { if (!validateField(f) && !firstBad) firstBad = f; });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  /* ---------- ENQUIRY FORM (AJAX) ---------- */
  var enq = document.getElementById('enquiry-form');
  if (enq) {
    var enqFields = setupForm(enq);
    var box = document.getElementById('enquiry-response');
    var bookField = document.getElementById('enq_book');
    var qp = new URLSearchParams(window.location.search).get('book');
    if (qp) bookField.value = qp.slice(0, 80);

    enq.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateAll(enqFields)) return;
      var name = document.getElementById('enq_name').value.trim();
      var term = bookField.value.trim().toLowerCase();
      var option = document.getElementById('enq_option').value;
      var needBy = document.getElementById('enq_date').value;

      box.hidden = false; box.className = 'response-box';
      box.textContent = 'Checking cost and availability\u2026';

      fetch('data/books.json')
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .catch(function () { return FALLBACK_BOOKS; })
        .then(function (books) {
          var match = books.filter(function (b) {
            return b.title.toLowerCase().indexOf(term) !== -1 || b.isbn.indexOf(term) !== -1;
          })[0];
          box.textContent = '';
          box.appendChild(el('h2', '', 'Thank you, ' + name + '!'));
          if (!match) {
            box.appendChild(el('p', '', 'We could not find \u201c' + bookField.value.trim() + '\u201d in our current listings, but we have noted your request and will alert you when a matching book is posted.'));
            box.appendChild(el('p', '', 'Typical prices: buying from R150, renting from R50 per month, and borrowing is free for up to 14 days.'));
          } else {
            var cost;
            if (match.option === 'borrow') cost = 'This book is free to borrow for up to 14 days.';
            else if (match.option === 'rent') cost = 'This book is available to rent for R' + match.price + ' per month.';
            else cost = 'This book is listed for sale at R' + match.price + '.';
            if (match.option !== option) cost += ' Note: the owner listed it to ' + match.option + ', so please confirm if ' + option + ' is possible.';
            box.appendChild(el('p', '', '\u201c' + match.title + '\u201d is ' + (match.available ? 'currently available.' : 'currently reserved by another student. We will notify you if it becomes available.')));
            if (match.available) {
              box.appendChild(el('p', '', cost));
              box.appendChild(el('p', '', 'You asked for it by ' + needBy + '. The owner will arrange a campus meeting point with you by email.'));
            }
          }
          box.appendChild(el('p', 'small', 'A confirmation has been noted against the email you provided.'));
          enq.reset();
          enq.querySelectorAll('textarea').forEach(function (t) {
            var c = document.getElementById(t.id + '-count');
            if (c) c.textContent = '0 / ' + t.maxLength;
            t.setAttribute('aria-invalid', 'false');
          });
          box.focus();
        });
    });
  }

  /* ---------- CONTACT FORM (compile email) ---------- */
  var contact = document.getElementById('contact-form');
  if (contact) {
    var cFields = setupForm(contact);
    var preview = document.getElementById('email-preview');
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateAll(cFields)) return;
      var get = function (id) { return document.getElementById(id).value.trim(); };
      var to = contact.dataset.recipient;
      var subject = 'Student Text Hub \u2013 ' + get('msg_type') + ' from ' + get('student_name');
      var body = 'Name: ' + get('student_name') + '\n' +
                 'Email: ' + get('student_email') + '\n' +
                 'Phone: ' + (get('student_phone') || 'Not provided') + '\n' +
                 'University / College: ' + (get('student_school') || 'Not provided') + '\n' +
                 'Message type: ' + get('msg_type') + '\n\n' +
                 'Message:\n' + get('message');
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      preview.hidden = false; preview.className = 'response-box';
      preview.textContent = '';
      preview.appendChild(el('h2', '', 'Your email is ready'));
      preview.appendChild(el('p', '', 'Check the details below, then press the button to send it from your email app.'));
      var dl = el('dl', 'details');
      [['To', to], ['Subject', subject]].forEach(function (r) { dl.appendChild(el('dt', '', r[0])); dl.appendChild(el('dd', '', r[1])); });
      preview.appendChild(dl);
      preview.appendChild(el('pre', 'email-body', body));
      var a = el('a', 'btn', 'Send email to ' + to);
      a.href = href;
      preview.appendChild(a);
      preview.focus();
    });
  }
})();
