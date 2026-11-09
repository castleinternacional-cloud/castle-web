(function () {
  var C = window.CASTLE || {};
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  // Enlaces de WhatsApp / correo desde config.js
  var waOk = /^\d{8,15}$/.test(C.whatsapp || '');
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    if (waOk) {
      a.href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(C.whatsappText || '');
      a.target = '_blank'; a.rel = 'noopener';
    } else if (a.id === 'wa-main') {
      a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.textContent = 'WhatsApp próximamente';
    }
  });
  var mailWrap = document.querySelector('[data-mail-wrap]');
  var mail = document.querySelector('[data-mail]');
  if (mail) {
    if (C.email) { mail.href = 'mailto:' + C.email; mail.textContent = C.email; }
    else if (mailWrap) { mailWrap.style.display = 'none'; }
  }

  // Aparición suave al hacer scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // Cierra el menú móvil al pulsar un enlace
  var t = document.getElementById('menu-toggle');
  document.querySelectorAll('.main-nav a').forEach(function (a) { a.addEventListener('click', function () { if (t) t.checked = false; }); });


  // Formulario de contacto -> n8n -> Telegram
  var form = document.getElementById('contact-form');
  if (form) {
    var msg = document.getElementById('contact-msg');
    var btn = document.getElementById('contact-send');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.className = 'form-msg';
      var d = new FormData(form);
      if (d.get('web')) { return; } // anti-spam (campo oculto)
      var nombre = (d.get('nombre') || '').trim(), wa = (d.get('whatsapp') || '').trim(), texto = (d.get('mensaje') || '').trim();
      if (!nombre || !texto || wa.replace(/\D/g, '').length < 8) {
        msg.textContent = 'Revisa tu nombre, tu WhatsApp (con prefijo) y el mensaje.'; msg.className = 'form-msg err'; return;
      }
      if (!C.contactUrl) { msg.textContent = 'El formulario aún no está disponible. Escríbenos por WhatsApp.'; msg.className = 'form-msg err'; return; }
      btn.disabled = true; btn.textContent = 'Enviando…';
      var body = new URLSearchParams({ nombre: nombre, whatsapp: wa, empresa: (d.get('empresa') || '').trim(), mensaje: texto });
      fetch(C.contactUrl, { method: 'POST', mode: 'no-cors', body: body }).then(function () {
        form.reset(); msg.textContent = '¡Gracias! Hemos recibido tu mensaje y te escribiremos por WhatsApp.'; msg.className = 'form-msg ok';
        btn.textContent = 'Enviado';
        setTimeout(function () { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }, 4000);
      }).catch(function () {
        btn.disabled = false; btn.textContent = 'Enviar mensaje';
        msg.textContent = 'No se pudo enviar. Inténtalo otra vez o escríbenos por WhatsApp.'; msg.className = 'form-msg err';
      });
    });
  }

  // Chat de n8n (solo si hay URL)
  if (C.chatUrl) {
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat@0.50.0/dist/style.css';
    document.head.appendChild(l);
    import('https://cdn.jsdelivr.net/npm/@n8n/chat@0.50.0/dist/chat.bundle.es.js').then(function (m) {
      m.createChat({ webhookUrl: C.chatUrl, loadPreviousSession: false, showWelcomeScreen: false, initialMessages: ['¡Hola! Soy el asistente de Castle International. ¿En qué te puedo ayudar?'], i18n: { en: { title: 'Castle International', subtitle: 'Pregúntanos lo que quieras', footer: '', getStarted: 'Nueva conversación', inputPlaceholder: 'Escribe tu pregunta…' } } });
      addTeaser();
    });
  }

  // Mensaje llamativo junto al botón del chat
  function addTeaser() {
    var t = document.createElement('div');
    t.className = 'chat-teaser';
    t.innerHTML = '<b>Pruébalo tú mismo.</b> Pregúntale al asistente lo que quieras.<button type="button" aria-label="Cerrar">×</button>';
    document.body.appendChild(t);
    function hide() { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }
    t.querySelector('button').addEventListener('click', function (e) { e.stopPropagation(); hide(); });
    t.addEventListener('click', function () { var tg = document.querySelector('.chat-window-toggle'); if (tg) tg.click(); hide(); });
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.chat-window-toggle')) hide(); });
    setTimeout(function () { t.classList.add('show'); }, 1800);
    setTimeout(hide, 20000);
  }
})();
