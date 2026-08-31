/* =========================================================================
   OKIAX — LANDING PAGE
   JavaScript puro: menu mobile, scroll suave, revelacao on-scroll,
   validacao de formulario e ano dinamico no rodape.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------------
     1. MENU MOBILE (hamburguer)
  ----------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
      });
    });
  }

  /* -----------------------------------------------------------------------
     2. ROLAGEM SUAVE PARA ANCORAS INTERNAS
  ----------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -----------------------------------------------------------------------
     3. REVELACAO DE ELEMENTOS AO ROLAR A PAGINA (IntersectionObserver)
     Cobre qualquer elemento marcado com a classe .reveal no HTML
     (cards, cabecalhos de secao, timeline, formulario etc.).
  ----------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------------------
     4. VALIDACAO DO FORMULARIO DE CONTATO
  ----------------------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (fieldName, message) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
      const row = field ? field.closest('.form-row') : null;

      if (row) row.classList.toggle('has-error', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
    };

    const validateField = (fieldName, value) => {
      switch (fieldName) {
        case 'nome':
          if (!value.trim()) return 'Informe seu nome completo.';
          return '';
        case 'email':
          if (!value.trim()) return 'Informe seu e-mail.';
          if (!emailPattern.test(value.trim())) return 'Informe um e-mail válido.';
          return '';
        case 'mensagem':
          if (!value.trim()) return 'Conte rapidamente como podemos ajudar.';
          return '';
        default:
          return '';
      }
    };

    ['nome', 'email', 'mensagem'].forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;
      field.addEventListener('blur', () => {
        setError(fieldName, validateField(fieldName, field.value));
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (feedback) feedback.textContent = '';

      const fields = ['nome', 'email', 'mensagem'];
      let isValid = true;

      fields.forEach((fieldName) => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorMsg = validateField(fieldName, field ? field.value : '');
        setError(fieldName, errorMsg);
        if (errorMsg) isValid = false;
      });

      if (!isValid) {
        const firstError = form.querySelector('.form-row.has-error input, .form-row.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Sem back-end conectado neste projeto: apenas confirma o envio
      // visualmente. Para producao, substitua este bloco pela chamada
      // real (fetch para uma API, servico de e-mail, webhook, etc).
      if (feedback) {
        feedback.textContent = 'Recebemos sua solicitação! Nossa equipe entrará em contato em breve.';
      }
      form.reset();
    });
  }

  /* -----------------------------------------------------------------------
     5. LIGHTBOX DO INFOGRAFICO "SOBRE A MARCA" (abrir, fechar, zoom)
  ----------------------------------------------------------------------- */
  const infographicTrigger = document.getElementById('infographic-trigger');
  const infographicLightbox = document.getElementById('infographic-lightbox');
  const infographicClose = document.getElementById('infographic-close');
  const infographicScroll = document.getElementById('infographic-scroll');
  const infographicLightboxImg = document.getElementById('infographic-lightbox-img');

  if (infographicTrigger && infographicLightbox && infographicClose && infographicScroll && infographicLightboxImg) {
    let lastFocusedElement = null;

    const openInfographic = () => {
      lastFocusedElement = document.activeElement;
      infographicLightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      infographicClose.focus();
    };

    const closeInfographic = () => {
      infographicLightbox.hidden = true;
      document.body.style.overflow = '';
      infographicLightboxImg.classList.remove('is-zoomed');
      infographicScroll.scrollTo(0, 0);
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    infographicTrigger.addEventListener('click', openInfographic);
    infographicClose.addEventListener('click', closeInfographic);

    // Fecha ao clicar fora da imagem (na área escura)
    infographicScroll.addEventListener('click', (event) => {
      if (event.target === infographicScroll) closeInfographic();
    });

    // Clique na imagem alterna entre zoom ampliado e tamanho normal
    infographicLightboxImg.addEventListener('click', () => {
      infographicLightboxImg.classList.toggle('is-zoomed');
    });

    // Fecha com a tecla Esc
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !infographicLightbox.hidden) closeInfographic();
    });
  }

  /* -----------------------------------------------------------------------
     6. ANO ATUAL NO RODAPE
  ----------------------------------------------------------------------- */
  const yearEl = document.getElementById('ano-atual');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
