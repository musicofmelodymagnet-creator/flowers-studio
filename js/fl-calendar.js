/* FLORINSKY custom date picker — matches site design */
(function(global) {
  'use strict';

  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  function pad(n) { return String(n).padStart(2,'0'); }

  function initDatePicker(inputId, wrapperId, iconId) {
    var inp  = document.getElementById(inputId);
    var wrap = document.getElementById(wrapperId);
    var icon = iconId ? document.getElementById(iconId) : null;
    if (!inp || !wrap) return;

    var today = new Date(); today.setHours(0,0,0,0);
    var viewY = today.getFullYear();
    var viewM = today.getMonth();
    var selDate = null;
    var isOpen  = false;

    /* ── build calendar DOM ─────────────────────────────── */
    var cal = document.createElement('div');
    cal.className = 'fl-cal';
    wrap.appendChild(cal);

    function render() {
      var startDow    = new Date(viewY, viewM, 1).getDay();
      var daysInMonth = new Date(viewY, viewM + 1, 0).getDate();

      var rows = '<div class="fl-cal-nav">'
        + '<button class="fl-cal-nav-btn fl-cal-prev" type="button">&#8249;</button>'
        + '<span class="fl-cal-month">' + MONTHS[viewM] + ' ' + viewY + '</span>'
        + '<button class="fl-cal-nav-btn fl-cal-next" type="button">&#8250;</button>'
        + '</div>'
        + '<div class="fl-cal-grid">';

      DAYS.forEach(function(d) { rows += '<span class="fl-cal-dow">' + d + '</span>'; });
      for (var e = 0; e < startDow; e++) rows += '<span></span>';

      for (var d = 1; d <= daysInMonth; d++) {
        var dt     = new Date(viewY, viewM, d);
        var past   = dt < today;
        var todayD = dt.getTime() === today.getTime();
        var selD   = selDate && dt.getTime() === selDate.getTime();
        var cls    = 'fl-cal-day'
                   + (past   ? ' fl-cal-past'  : '')
                   + (todayD ? ' fl-cal-today' : '')
                   + (selD   ? ' fl-cal-sel'   : '');
        var ds = viewY + '-' + pad(viewM + 1) + '-' + pad(d);
        rows += '<button class="' + cls + '" data-d="' + ds + '" type="button"'
              + (past ? ' disabled' : '') + '>' + d + '</button>';
      }
      rows += '</div>';
      cal.innerHTML = rows;

      cal.querySelector('.fl-cal-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        viewM--;
        if (viewM < 0) { viewM = 11; viewY--; }
        render();
      });
      cal.querySelector('.fl-cal-next').addEventListener('click', function(e) {
        e.stopPropagation();
        viewM++;
        if (viewM > 11) { viewM = 0; viewY++; }
        render();
      });

      cal.querySelectorAll('.fl-cal-day:not([disabled])').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var p = this.getAttribute('data-d').split('-');
          selDate = new Date(+p[0], +p[1] - 1, +p[2]);
          inp.value = pad(+p[1]) + '/' + pad(+p[2]) + '/' + p[0];
          inp.dispatchEvent(new Event('change', { bubbles: true }));
          closeC();
        });
      });
    }

    function openC() {
      if (isOpen) return;
      isOpen = true;
      render();
      cal.classList.add('fl-cal-open');
    }

    function closeC() {
      if (!isOpen) return;
      isOpen = false;
      cal.classList.remove('fl-cal-open');
    }

    /* ── triggers ──────────────────────────────────────── */
    inp.setAttribute('readonly', '');
    inp.style.cursor = 'pointer';

    inp.addEventListener('click', function(e) {
      e.stopPropagation();
      isOpen ? closeC() : openC();
    });

    if (icon) {
      icon.style.cursor = 'pointer';
      icon.style.pointerEvents = 'auto';
      icon.addEventListener('click', function(e) {
        e.stopPropagation();
        isOpen ? closeC() : openC();
      });
    }

    cal.addEventListener('click', function(e) { e.stopPropagation(); });

    document.addEventListener('click', closeC);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeC();
    });
  }

  global.FlCalendar = { init: initDatePicker };

})(window);
