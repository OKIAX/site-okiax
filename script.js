/* =========================================================================
   OKIAX — LANDING PAGE
   JavaScript puro: menu mobile, scroll suave, revelacao on-scroll,
   validacao e envio do formulario de contato e ano dinamico no rodape.
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
     4. FORMULARIO DE CONTATO: validacao + envio para contato@okiax.com.br
     O envio usa o servico FormSubmit (formsubmit.co), que repassa os dados
     por e-mail sem precisar de servidor proprio (o site e 100% estatico).
     Na PRIMEIRA mensagem enviada, o FormSubmit manda um e-mail de ativacao
     para contato@okiax.com.br; basta clicar em "Activate Form" uma unica vez.
  ----------------------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('form-submit');
  const successOverlay = document.getElementById('form-success');
  const successBtn = document.getElementById('form-success-btn');

  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/contato@okiax.com.br';
  const REQUIRED_FIELDS = ['nome', 'empresa', 'email', 'telefone', 'mensagem'];

  if (form) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const submitLabel = submitBtn ? submitBtn.textContent : 'Enviar mensagem';

    const getField = (fieldName) => form.querySelector(`[name="${fieldName}"]`);

    const setError = (fieldName, message) => {
      const field = getField(fieldName);
      const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
      const row = field ? field.closest('.form-row') : null;

      if (row) row.classList.toggle('has-error', Boolean(message));
      if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorEl) errorEl.textContent = message || '';
    };

    const validateField = (fieldName, value) => {
      const v = (value || '').trim();
      switch (fieldName) {
        case 'nome':
          return v ? '' : 'Informe seu nome completo.';
        case 'empresa':
          return v ? '' : 'Informe o nome da empresa.';
        case 'email':
          if (!v) return 'Informe seu e-mail.';
          return emailPattern.test(v) ? '' : 'Informe um e-mail válido.';
        case 'telefone': {
          if (!v) return 'Informe seu telefone.';
          const digits = v.replace(/\D/g, '');
          return digits.length >= 10 && digits.length <= 13 ? '' : 'Informe um telefone válido, com DDD.';
        }
        case 'mensagem':
          return v ? '' : 'Conte rapidamente como podemos ajudar.';
        default:
          return '';
      }
    };

    // Mascara simples de telefone brasileiro: (11) 92113-4056
    const phoneField = getField('telefone');
    if (phoneField) {
      phoneField.addEventListener('input', () => {
        const d = phoneField.value.replace(/\D/g, '').slice(0, 11);
        let out = d;
        if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
        if (d.length > 6) {
          const split = d.length === 11 ? 7 : 6;
          out = `(${d.slice(0, 2)}) ${d.slice(2, split)}-${d.slice(split)}`;
        }
        phoneField.value = out;
      });
    }

    // Valida ao sair do campo e remove o destaque assim que o campo e corrigido
    REQUIRED_FIELDS.forEach((fieldName) => {
      const field = getField(fieldName);
      if (!field) return;
      field.addEventListener('blur', () => {
        setError(fieldName, validateField(fieldName, field.value));
      });
      field.addEventListener('input', () => {
        const row = field.closest('.form-row');
        if (row && row.classList.contains('has-error') && !validateField(fieldName, field.value)) {
          setError(fieldName, '');
        }
      });
    });

    const clearAllErrors = () => {
      REQUIRED_FIELDS.forEach((fieldName) => setError(fieldName, ''));
      if (feedback) {
        feedback.textContent = '';
        feedback.classList.remove('is-error');
      }
    };

    const showFeedbackError = (message) => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.classList.add('is-error');
    };

    const setSending = (isSending) => {
      if (!submitBtn) return;
      submitBtn.disabled = isSending;
      submitBtn.textContent = isSending ? 'Enviando...' : submitLabel;
    };

    // Confirmacao centralizada (botao). Ao clicar, volta para o inicio do site.
    const openSuccess = () => {
      if (!successOverlay) return;
      successOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
      if (successBtn) successBtn.focus();
    };

    const closeSuccessAndGoHome = () => {
      if (!successOverlay) return;
      successOverlay.hidden = true;
      document.body.style.overflow = '';
      form.reset();
      clearAllErrors();
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (successBtn) successBtn.addEventListener('click', closeSuccessAndGoHome);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && successOverlay && !successOverlay.hidden) closeSuccessAndGoHome();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (feedback) {
        feedback.textContent = '';
        feedback.classList.remove('is-error');
      }

      // 1) Verifica TODOS os campos obrigatorios e destaca os que faltam
      let isValid = true;
      REQUIRED_FIELDS.forEach((fieldName) => {
        const field = getField(fieldName);
        const errorMsg = validateField(fieldName, field ? field.value : '');
        setError(fieldName, errorMsg);
        if (errorMsg) isValid = false;
      });

      if (!isValid) {
        showFeedbackError('Preencha corretamente os campos destacados para enviar sua mensagem.');
        const firstError = form.querySelector('.form-row.has-error input, .form-row.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Anti-spam: se o campo invisivel foi preenchido, e um robo
      const honey = getField('_honey');
      if (honey && honey.value) return;

      // 2) Monta o e-mail exatamente na estrutura definida pela OKIAX
      const dataEnvio = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const valor = (name) => getField(name).value.trim();

      const payload = {
        'FORMULÁRIO RECEBIDO PELO SITE - Data': dataEnvio,
        'Nome completo': valor('nome'),
        'Empresa': valor('empresa'),
        'E-mail': valor('email'),
        'Telefone': valor('telefone'),
        'Solicitação': valor('mensagem'),
        _subject: `FORMULÁRIO RECEBIDO PELO SITE - Data: ${dataEnvio}`,
        _replyto: valor('email'),
        _template: 'basic',
        _captcha: 'false'
      };

      // 3) Envia para contato@okiax.com.br
      setSending(true);
      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        const ok = response.ok && String(result.success) !== 'false';
        if (!ok) throw new Error(result.message || 'Falha no envio');

        openSuccess();
      } catch (error) {
        showFeedbackError('Não foi possível enviar agora. Tente novamente em instantes ou escreva para contato@okiax.com.br.');
      } finally {
        setSending(false);
      }
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
