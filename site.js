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

  // Chat de n8n (solo si hay URL)
  if (C.chatUrl) {
    var l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat@0.50.0/dist/style.css';
    document.head.appendChild(l);
    import('https://cdn.jsdelivr.net/npm/@n8n/chat@0.50.0/dist/chat.bundle.es.js').then(function (m) {
      m.createChat({ webhookUrl: C.chatUrl, initialMessages: ['¡Hola! Soy el asistente de Castle International. ¿En qué te puedo ayudar?'], i18n: { en: { title: 'Castle International', subtitle: 'Pregúntanos lo que quieras', footer: '', getStarted: 'Nueva conversación', inputPlaceholder: 'Escribe tu pregunta…' } } });
    });
  }
})();
