var EMAILJS_SERVICE_ID = 'service_xzkeqr3';
var EMAILJS_TEMPLATE_ID = 'template_dfqyhfa';
var EMAILJS_PUBLIC_KEY = 'zt5ttb5ckZI8HQ9LN';

document.addEventListener('DOMContentLoaded', function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 70 + 'ms';
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
        closeModal(m.id);
      });
    }
  });
});

function openModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.add('open');
}

function closeModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

function formatDate(value) {
  if (!value) return 'TBC';
  var parts = value.split('-');
  if (parts.length !== 3) return value;
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function confirmBooking(destination, redirectUrl, button) {
  var fromEl = document.getElementById('date-from');
  var toEl = document.getElementById('date-to');
  var emailEl = document.getElementById('date-email');

  var email = emailEl && emailEl.value ? emailEl.value.trim() : '';
  var from = formatDate(fromEl ? fromEl.value : '');
  var to = formatDate(toEl ? toEl.value : '');

  function goToRedirect() {
    window.location.href = redirectUrl;
  }

  if (email && typeof emailjs !== 'undefined') {
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending...';
    }
    var websiteLink = window.location.href.replace(/[^/]*$/, 'front.html');
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      destination: destination,
      date_from: from,
      date_to: to,
      email: email,
      website_link: websiteLink
    }).then(goToRedirect, function (err) {
      console.error('EmailJS error:', err);
      goToRedirect();
    });
  } else {
    goToRedirect();
  }
}
