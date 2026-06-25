(function () {
  'use strict';

  /* ── CSS injection ──────────────────────────────────────────── */
  var st = document.createElement('style');
  st.textContent = [
    '@property --cw-rot{syntax:"<angle>";inherits:true;initial-value:0deg;}',
    '@keyframes cw-spin{to{--cw-rot:360deg;}}',
    '@keyframes cw-ava-pulse{0%,100%{box-shadow:0 0 0 0 rgba(76,175,80,.55)}50%{box-shadow:0 0 0 3px rgba(76,175,80,0)}}',
    '@keyframes cw-pulse{0%,100%{opacity:1}50%{opacity:.55}}',
    '@keyframes cw-dot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}',
    '@keyframes cw-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes cw-pop-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}',

    '.cw-popup{position:fixed;bottom:104px;right:32px;width:345px;z-index:298;opacity:0;pointer-events:none;transform:translateY(14px) scale(.97);transition:opacity 220ms ease-out,transform 220ms ease-out;}',
    '.cw-popup.cw-open{opacity:1;pointer-events:auto;transform:translateY(0) scale(1);}',

    '.cw-chat{border-radius:22px;overflow:hidden;box-shadow:-12px -12px 24px rgba(255,255,255,.72),12px 12px 24px rgba(112,96,110,.30);display:flex;flex-direction:column;height:430px;background:#EADCDB;}',

    '.cw-hdr{background:#685b5b;padding:12px 14px;display:flex;align-items:center;gap:11px;flex-shrink:0;}',
    '.cw-hdr-avatar{position:relative;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.20);border:2px solid rgba(255,255,255,.32);display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
    '.cw-hdr-letter{font:600 16px/1 var(--font-display,"Cormorant Garamond",serif);color:#fff;}',
    '.cw-hdr-dot{position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;background:#4caf50;border:2px solid #685b5b;box-shadow:0 0 0 0 rgba(76,175,80,.55);opacity:0;transition:opacity 400ms ease;animation:cw-ava-pulse 2.2s ease-in-out infinite;}',
    '.cw-hdr-dot.cw-dot-on{opacity:1;}',
    '.cw-hdr-info{flex:1;}',
    '.cw-hdr-name{font:700 14px/1.2 var(--font-sans,"Inter",sans-serif);color:#fff;display:block;}',
    '.cw-hdr-status{display:flex;align-items:center;font:400 13px/1.35 var(--font-sans,"Inter",sans-serif);color:rgba(255,255,255,.85);}',
    '.cw-hdr-status-text{display:flex;flex-direction:column;align-items:flex-end;gap:1px;}',
    '.cw-online-line{display:flex;align-items:center;gap:5px;}',
    '.cw-status-dot{width:10px;height:10px;border-radius:50%;background:#4caf50;box-shadow:0 0 5px #4caf50;flex-shrink:0;opacity:0;transition:opacity 400ms ease;animation:cw-pulse 2.2s ease-in-out infinite;}',
    '.cw-status-dot.cw-dot-on{opacity:1;}',
    '.cw-close{background:none;border:none;color:rgba(255,255,255,.65);font-size:15px;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;border-radius:50%;width:26px;height:26px;flex-shrink:0;transition:background 150ms,color 150ms;}',
    '.cw-close:hover{background:rgba(255,255,255,.15);color:#fff;}',

    '.cw-msgs{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain;}',
    '.cw-msgs::-webkit-scrollbar{width:3px;}.cw-msgs::-webkit-scrollbar-track{background:transparent;}.cw-msgs::-webkit-scrollbar-thumb{background:rgba(168,120,208,.28);border-radius:2px;}',
    '.cw-msg{display:flex;align-items:flex-end;gap:8px;animation:cw-in 240ms ease-out;}',
    '.cw-msg--user{justify-content:flex-end;}.cw-msg--mgr{justify-content:flex-start;}',
    '.cw-msg-ava{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#cca8e4 0%,#A878D0 100%);display:flex;align-items:center;justify-content:center;font:600 12px/1 var(--font-display,"Cormorant Garamond",serif);color:#fff;flex-shrink:0;}',
    '.cw-msg-bubble{max-width:80%;padding:9px 12px;border-radius:14px;font:400 13px/1.5 var(--font-sans,"Inter",sans-serif);word-break:break-word;}',
    '.cw-msg--mgr .cw-msg-bubble{background:#F9F4F0;box-shadow:-5px -5px 12px rgba(255,255,255,.72),5px 5px 12px rgba(112,96,110,.30);color:#2a2020;border-bottom-left-radius:4px;}',
    '.cw-msg--user .cw-msg-bubble{background:#EDEAE8;box-shadow:-4px -4px 10px rgba(255,255,255,.68),4px 4px 10px rgba(112,96,110,.22);color:#2a2020;border-bottom-right-radius:4px;}',
    '.cw-msg-time{display:block;font:400 10px/1 var(--font-sans,"Inter",sans-serif);margin-top:4px;}',
    '.cw-msg--mgr .cw-msg-time{color:#9e8e8e;}.cw-msg--user .cw-msg-time{color:#9e8e8e;text-align:right;}',

    '.cw-typing{display:flex;align-items:flex-end;gap:8px;animation:cw-in 240ms ease-out;}',
    '.cw-typing-bubble{background:#F9F4F0;border:1px solid rgba(255,255,255,.80);box-shadow:-5px -5px 12px rgba(255,255,255,.72),5px 5px 12px rgba(112,96,110,.30);border-radius:14px;border-bottom-left-radius:4px;padding:10px 14px;display:flex;gap:4px;align-items:center;}',
    '.cw-typing-dot{width:5px;height:5px;border-radius:50%;background:#9e8e8e;animation:cw-dot 1.2s ease-in-out infinite;}',
    '.cw-typing-dot:nth-child(2){animation-delay:.2s;}.cw-typing-dot:nth-child(3){animation-delay:.4s;}',

    '.cw-quick{padding:8px 10px 4px;display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0;background:#F8F4F2;}',
    '.cw-quick-btn{border:1px solid rgba(168,120,208,.30);border-radius:20px;background:transparent;padding:5px 11px;font:400 11.5px/1.3 var(--font-sans,"Inter",sans-serif);color:#A878D0;cursor:pointer;transition:background 150ms,border-color 150ms;white-space:nowrap;}',
    '.cw-quick-btn:hover{background:rgba(168,120,208,.08);border-color:rgba(168,120,208,.55);}',

    '.cw-input-row{padding:10px 12px 13px;display:flex;gap:8px;align-items:center;flex-shrink:0;background:#685b5b;border-top:1px solid rgba(168,120,208,.12);}',
    '.cw-input-wrap{--cw-grad:conic-gradient(from var(--cw-rot) at 50% 50%,#ff3355 0deg,#ff7700 42deg,#ffdd00 84deg,#33cc55 126deg,#00bbff 168deg,#3366ff 210deg,#9933ff 252deg,#ff33cc 294deg,#ff3355 360deg);animation:cw-spin 9s infinite linear;flex:1;position:relative;border-radius:20px;display:flex;align-items:center;border:1.5px solid transparent;background:linear-gradient(#F9F4F0,#F9F4F0) padding-box,var(--cw-grad) border-box;min-width:0;height:38px;}',
    '.cw-input{flex:1;height:100%;border-radius:20px;border:none;background:transparent;padding:0 14px;font:400 13px/1 var(--font-sans,"Inter",sans-serif);color:#2a2020;outline:none;}',
    '.cw-input::placeholder{color:#9e8e8e;}',
    '.cw-send{width:38px;height:38px;border-radius:50%;border:none;background:linear-gradient(135deg,#cca8e4 0%,#A878D0 100%);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 3px 10px rgba(168,120,208,.35);transition:transform 150ms,box-shadow 150ms;}',
    '.cw-send:hover{transform:scale(1.07);box-shadow:0 5px 18px rgba(168,120,208,.55);}',
    '.cw-send svg{width:16px;height:16px;stroke:#fff;stroke-width:2;fill:none;}'
  ].join('');
  document.head.appendChild(st);

  /* ── Conversation history ───────────────────────────────────── */
  var cwHistory   = [];
  var cwIsSending = false;

  /* ── Popup HTML ─────────────────────────────────────────────── */
  var popup = document.createElement('div');
  popup.className = 'cw-popup';
  popup.id = 'cwPopup';
  popup.innerHTML =
    '<div class="cw-chat">' +
      '<div class="cw-hdr">' +
        '<div class="cw-hdr-avatar">' +
          '<span class="cw-hdr-letter">O</span>' +
          '<span class="cw-hdr-dot" id="cwAvaDot"></span>' +
        '</div>' +
        '<div class="cw-hdr-info"><span class="cw-hdr-name">Olivia</span></div>' +
        '<div class="cw-hdr-status">' +
          '<div class="cw-hdr-status-text">' +
            '<div class="cw-online-line"><span>Online</span><span class="cw-status-dot" id="cwStDot"></span></div>' +
            '<span>responds within minute</span>' +
          '</div>' +
        '</div>' +
        '<button class="cw-close" id="cwClose" aria-label="Close chat">✕</button>' +
      '</div>' +
      '<div class="cw-msgs" id="cwMsgs"></div>' +
      '<div class="cw-quick" id="cwQuick">' +
        '<button class="cw-quick-btn" data-msg="What colors are available?">What colors are available?</button>' +
        '<button class="cw-quick-btn" data-msg="What sizes do you offer?">What sizes do you offer?</button>' +
        '<button class="cw-quick-btn" data-msg="How much does it cost?">Pricing info</button>' +
        '<button class="cw-quick-btn" data-msg="How do I book?">How do I book?</button>' +
      '</div>' +
      '<div class="cw-input-row">' +
        '<div class="cw-input-wrap">' +
          '<input class="cw-input" id="cwInput" type="text" placeholder="Type your message…" autocomplete="off" maxlength="300" />' +
        '</div>' +
        '<button class="cw-send" id="cwSend" aria-label="Send">' +
          '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(popup);

  /* ── Refs ───────────────────────────────────────────────────── */
  var msgs    = document.getElementById('cwMsgs');
  var input   = document.getElementById('cwInput');
  var sendBtn = document.getElementById('cwSend');
  var quick   = document.getElementById('cwQuick');

  /* ── Chat helpers ───────────────────────────────────────────── */
  function getTime() {
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    return (h % 12 || 12) + ':' + String(m).padStart(2,'0') + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  function scrollBottom() { msgs.scrollTop = msgs.scrollHeight; }

  function fmtBot(s) {
    return s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function addMsg(text, type) {
    var row = document.createElement('div');
    row.className = 'cw-msg cw-msg--' + type;
    if (type === 'mgr') {
      row.innerHTML = '<div class="cw-msg-ava">O</div><div class="cw-msg-bubble">' + fmtBot(text) + '<span class="cw-msg-time">' + getTime() + '</span></div>';
    } else {
      row.innerHTML = '<div class="cw-msg-bubble">' + escHtml(text) + '<span class="cw-msg-time">' + getTime() + '</span></div>';
    }
    msgs.appendChild(row);
    scrollBottom();
  }

  function showTyping() {
    var t = document.createElement('div');
    t.className = 'cw-typing'; t.id = 'cwTyping';
    t.innerHTML = '<div class="cw-msg-ava">O</div><div class="cw-typing-bubble"><span class="cw-typing-dot"></span><span class="cw-typing-dot"></span><span class="cw-typing-dot"></span></div>';
    msgs.appendChild(t); scrollBottom();
  }
  function removeTyping() { var t = document.getElementById('cwTyping'); if (t) t.remove(); }

  async function send(text) {
    text = text.trim();
    if (!text || cwIsSending) return;
    cwIsSending = true;

    addMsg(text, 'user');
    input.value = '';
    quick.innerHTML = '';
    cwHistory.push({ role: 'user', content: text });

    var t0 = Date.now();
    var typingTimer = setTimeout(showTyping, 2000);

    var reply = '';
    try {
      var res = await fetch('/api/chat.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: cwHistory.slice(-12) })
      });
      if (res.ok) {
        var data = await res.json();
        reply = (data.reply || '').trim();
      }
    } catch (e) { /* network error */ }

    if (!reply) reply = "Give me just a sec — let me check that for you.";

    clearTimeout(typingTimer);
    var elapsed   = Date.now() - t0;
    var wordCount = reply.trim().split(/\s+/).length;
    var typeMs    = Math.max(1000, Math.round(wordCount / 2) * 1000);
    var waitMs    = Math.max(0, 2000 - elapsed);

    setTimeout(function() {
      showTyping();
      setTimeout(function() {
        removeTyping();
        cwHistory.push({ role: 'assistant', content: reply });
        addMsg(reply, 'mgr');
        cwIsSending = false;
      }, typeMs);
    }, waitMs);
  }

  /* ── Event listeners ────────────────────────────────────────── */
  sendBtn.addEventListener('click', function() { send(input.value); });
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); }
  });
  quick.addEventListener('click', function(e) {
    var btn = e.target.closest('.cw-quick-btn');
    if (btn) send(btn.dataset.msg || btn.textContent);
  });
  document.getElementById('cwClose').addEventListener('click', function() { closePopup(); });

  /* ── Toggle / open / close ──────────────────────────────────── */
  var isOpen   = false;
  var greeted  = false;

  function openPopup() {
    isOpen = true;
    popup.classList.add('cw-open');
    if (!greeted) {
      greeted = true;
      var GREETINGS = [
        "Hi! I'm Olivia. Let me know if you have any questions.",
        "Hi! I'm Olivia. Happy to help with any questions.",
        "Hi! I'm Olivia. I'm here to help if you need anything."
      ];
      setTimeout(function() {
        var g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        showTyping();
        setTimeout(function() { removeTyping(); addMsg(g, 'mgr'); }, g.split(/\s+/).length * 500);
      }, 3000);
    }
    /* Activate online dots */
    setTimeout(function() {
      var a = document.getElementById('cwAvaDot');
      var s = document.getElementById('cwStDot');
      if (a) a.classList.add('cw-dot-on');
      if (s) s.classList.add('cw-dot-on');
    }, 3000);
  }

  function closePopup() {
    isOpen = false;
    popup.classList.remove('cw-open');
  }

  /* ── Wire the widget button on every page ───────────────────── */
  var widgetBtn = document.querySelector('.contact-widget-btn');
  if (widgetBtn) {
    widgetBtn.onclick = function(e) {
      e.preventDefault();
      isOpen ? closePopup() : openPopup();
    };
  }

})();
