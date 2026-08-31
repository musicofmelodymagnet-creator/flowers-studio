/* ── Shared inquiry form initialiser ─────────────────────────────────────────
   Called after the form HTML is fetched and injected into #inquiry-root.
   Handles: calendar, "not sure yet" checkbox, tabs, submit (with wallColor fix).
   ─────────────────────────────────────────────────────────────────────────── */
function initInquiryForm() {
  var form      = document.getElementById('inquiryForm');
  var submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  /* ── Calendar ── */
  if (window.FlCalendar) FlCalendar.init('field-date', 'fieldDateWrap', 'fieldDateIcon');

  /* ── Pre-select wall color from data-wall attribute on #inquiry-root ── */
  var root     = document.getElementById('inquiry-root');
  var preWall  = root && root.getAttribute('data-wall');
  if (preWall) {
    var wallSel = document.getElementById('field-wall-color');
    if (wallSel) {
      for (var i = 0; i < wallSel.options.length; i++) {
        if (wallSel.options[i].value === preWall) { wallSel.selectedIndex = i; break; }
      }
    }
  }

  /* ── "Not sure yet" checkbox ── */
  var dateUnsureCb = document.getElementById('field-date-unsure');
  if (dateUnsureCb) {
    dateUnsureCb.addEventListener('change', function () {
      var wrap = document.getElementById('fieldDateWrap');
      if (this.checked) {
        document.getElementById('field-date').value = '';
        wrap.classList.add('form-date-wrap--disabled');
      } else {
        wrap.classList.remove('form-date-wrap--disabled');
      }
    });
  }

  /* ── Tabs ── */
  var TAB_DATA = {
    inquiry: {
      title:   'Send an Inquiry',
      btn:     'Send Inquiry',
      desc:    'We’ll review your request and contact you to confirm availability and go over your event details.<span class="inq-tab-desc-note">Perfect if you need pricing, availability, or have any questions.</span>',
      consent: 'By submitting this request, you agree to our <a href="/privacy-policy.html" class="form-consent-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.'
    },
    reserve: {
      title:   'Reserve Your Wall',
      btn:     'Request Reservation',
      desc:    'We’ll review your request and contact you to confirm availability and go over your event details.<span class="inq-tab-desc-note">Share your event details to begin your reservation.</span>',
      consent: 'By submitting this request, you agree to our <a href="/privacy-policy.html" class="form-consent-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.'
    }
  };
  document.querySelectorAll('.inq-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.inq-tab').forEach(function (t) {
        t.classList.remove('inq-tab--active'); t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('inq-tab--active'); this.setAttribute('aria-selected', 'true');
      var d       = TAB_DATA[this.getAttribute('data-tab')];
      var title   = document.getElementById('inqTitle');
      var btn     = document.getElementById('submitBtn');
      var desc    = document.getElementById('inqDesc');
      var consent = document.getElementById('inqConsent');
      var panel   = document.getElementById('contact');
      if (title)   title.textContent = d.title;
      if (btn && btn.textContent.indexOf('…') === -1) btn.textContent = d.btn;
      if (desc)    desc.innerHTML    = d.desc;
      if (consent) consent.innerHTML = d.consent;
      if (panel)   panel.classList.toggle('inquiry--reserve', this.getAttribute('data-tab') === 'reserve');
    });
  });

  /* ── Submit handler (wallColor fix: field-wall-color now included in payload) ── */
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var name      = (document.getElementById('field-name')       || {value:''}).value.trim();
    var lastName  = (document.getElementById('field-lastname')   || {value:''}).value.trim();
    var email     = (document.getElementById('field-email')      || {value:''}).value.trim();
    var phone     = (document.getElementById('field-phone')      || {value:''}).value.trim();
    var date      = (document.getElementById('field-date')       || {value:''}).value.trim();
    var location  = (document.getElementById('field-location')   || {value:''}).value.trim();
    var eventType = (document.getElementById('field-event-type') || {value:''}).value;
    var wallColor = (document.getElementById('field-wall-color') || {value:''}).value;
    var message   = (document.getElementById('field-message')    || {value:''}).value.trim();
    var hp        = (document.getElementById('hp-website')       || {value:''}).value;

    if (hp) return;

    submitBtn.textContent   = 'Sending…';
    submitBtn.disabled      = true;
    submitBtn.style.opacity = '0.7';

    var recaptchaToken = '';
    try {
      recaptchaToken = await new Promise(function (resolve) {
        var timer = setTimeout(function () { resolve(''); }, 3000);
        if (typeof grecaptcha === 'undefined') { clearTimeout(timer); resolve(''); return; }
        grecaptcha.enterprise.ready(async function () {
          try {
            var t = await grecaptcha.enterprise.execute('6Lf9vD0tAAAAB3fST62rTS4cMwmPL-Lg-BeasUY', { action: 'submit' });
            clearTimeout(timer); resolve(t);
          } catch (err) { clearTimeout(timer); resolve(''); }
        });
      });
    } catch (err) { recaptchaToken = ''; }

    try {
      var res  = await fetch('/api/contact.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, lastName, email, phone, date, location, eventType, wallColor, message, recaptchaToken, hp })
      });
      var data = await res.json();
      if (data.success) {
        submitBtn.textContent = 'Sent ✓';
        var note = document.createElement('p');
        note.style.cssText = 'margin-top:16px;font-size:14px;color:var(--ink-soft);text-align:center;line-height:1.6';
        note.textContent = data.message;
        form.appendChild(note);
      } else {
        submitBtn.textContent   = 'Try again';
        submitBtn.disabled      = false;
        submitBtn.style.opacity = '1';
      }
    } catch (err) {
      submitBtn.textContent   = 'Try again';
      submitBtn.disabled      = false;
      submitBtn.style.opacity = '1';
    }
  });
}
