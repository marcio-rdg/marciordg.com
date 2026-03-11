import '@/scss/style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const whatsappNumber = '5533999486162';

  function auditSite() {
    const urlInput = document.getElementById('siteUrl');
    const url = urlInput.value.trim();
    if (!url) return;

    trackWhatsAppContact('Hero - Auditoria Express', 50.0);

    const message = `Olá, Márcio! Acabei de solicitar uma auditoria express para o meu site: ${url}`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  }

  const adutiBtn = document.querySelector('#auditButton');
  if (adutiBtn) adutiBtn.addEventListener('click', auditSite);

  function stopBleeding() {
    trackWhatsAppContact('Calculadora - Estancar Sangria', 75.0);

    const message = `Olá, Márcio! Não quero mais deixar dinheiro na mesa!`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  }
  function trackWhatsAppContact(contentName, value) {
    const eventId =
      'wpp_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();

    if (typeof fbq === 'function') {
      fbq(
        'track',
        'Contact',
        {
          content_name: contentName,
          content_category: 'WhatsApp',
          value: value,
          currency: 'BRL',
        },
        { eventID: eventId }
      );
    }

    fetch('./api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_id: eventId,
        url: window.location.href,
        content_name: contentName,
        value: value,
      }),
    }).catch(() => {});
  }

  const stopBleedingBtn = document.querySelector('#stopBleeding');
  if (stopBleedingBtn) stopBleedingBtn.addEventListener('click', stopBleeding);

  const ranges = document.querySelectorAll('input[type="range"]');

  ranges.forEach((range) => {
    const updateProgress = () => {
      const min = range.min ? parseFloat(range.min) : 0;
      const max = range.max ? parseFloat(range.max) : 100;
      const val = parseFloat(range.value);
      const percentage = ((val - min) / (max - min)) * 100;
      range.style.setProperty('--range-progress', `${percentage}%`);
    };

    range.addEventListener('input', updateProgress);
    updateProgress();
  });

  if (window.pvEventId) {
    const dispararPageView = () => {
      fetch('./api/pageview.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        priority: 'low', // <--- Adiciona esta linha
        body: JSON.stringify({
          event_id: window.pvEventId,
          url: window.location.href,
        }),
      }).catch(() => {});
    };

    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(dispararPageView);
      } else {
        setTimeout(dispararPageView, 1000);
      }
    });
  }

  const btnWhatsappNav = document.getElementById('cta-whatsapp-nav');
  if (btnWhatsappNav) {
    btnWhatsappNav.addEventListener('click', () => {
      trackWhatsAppContact('Navbar - Solicitar Analise', 50.0);
    });
  }

  const faqData = [
    {
      question: 'Por que não usar plataformas prontas como Wix ou WordPress?',
      answer:
        "Plataformas alugadas e construtores visuais (como Elementor) são 'âncoras' para o seu tráfego. Eles injetam scripts genéricos que destroem seu tempo de carregamento e o seu Índice de Qualidade no Google Ads. Eu construo infraestrutura proprietária (HTML/Next.js) focada em uma única métrica: velocidade extrema para maximizar seu ROI.",
    },
    {
      question:
        'Meu site já é bonito e foi feito por uma agência. Por que refazê-lo?',
      answer:
        'Design sem engenharia de conversão (CRO) é apenas arte decorativa. Se o seu site é esteticamente lindo, mas leva 4 segundos para carregar no 4G, você está pagando para o lead ver uma tela branca e fechar a aba. Eu uno estética premium com arquitetura de alta performance. O site precisa ser bonito para o cliente e impecável para o robô do Google.',
    },
    {
      question:
        'O que é esse rastreamento Server-Side (CAPI) e por que eu preciso disso?',
      answer:
        'Com as atualizações do iOS14 e adblockers, o pixel tradicional perde até 40% das suas vendas. Você fica cego. O rastreamento via servidor envia os dados de conversão direto do back-end. Isso alimenta o algoritmo corretamente, permitindo que a inteligência do Meta/Google encontre seus compradores reais com um Custo Por Aquisição (CPA) muito menor.',
    },
    {
      question:
        'Eu já tenho uma agência de tráfego. Você faz apenas a parte técnica (Site/Tracking)?',
      answer:
        "Sim. Atuo frequentemente como o 'braço armado de engenharia' para operações que já rodam. Forneço a infraestrutura de rastreamento avançado (Data Layer, GTM) e páginas ultrarrápidas para que o seu gestor de tráfego atual tenha os melhores dados e converta mais com o mesmo orçamento.",
    },
    {
      question: 'Você garante o aumento nas minhas vendas?',
      answer:
        'Eu garanto a eliminação de todos os gargalos técnicos. Venda online depende de 3 pilares: Oferta, Tráfego e Estrutura. Eu construo o pilar da Estrutura com nível de elite. Se a sua oferta for ruim, nem o melhor código do mundo a salvará. Mas se a oferta for validada, minha engenharia garante que você não deixe nenhum dinheiro na mesa.',
    },
    {
      question: 'O seu serviço é caro? Qual o investimento mínimo?',
      answer:
        "'Caro' é injetar R$ 10.000 em anúncios num site lento e perder R$ 4.000 em leads que não esperaram carregar. Meu serviço não é um custo, é um investimento de infraestrutura focado em estancar sangrias. Não compito por preço com freelancers de templates prontos. O valor exato é definido na nossa Auditoria Forense.",
    },
    {
      question: 'Quanto tempo leva para entregar a infraestrutura pronta?',
      answer:
        'Depende da complexidade do escopo, mas o Protocolo RDG não é uma esteira de fábrica genérica. Uma landing page de alta conversão com tracking server-side leva, em média, de 10 a 15 dias úteis. Eu não sacrifico qualidade técnica por velocidade de entrega.',
    },
    {
      question: 'E depois que o projeto estiver no ar? Você dá suporte?',
      answer:
        'Eu não entrego o código e sumo. Operações de alto nível exigem refinamento contínuo. Ofereço modelos de acompanhamento onde atuo na Otimização de Conversão (CRO), analisando mapas de calor, e testes A/B para ajustar a máquina de vendas com base em dados reais dos usuários.',
    },
  ];

  const faqContainer = document.querySelector('.faq__content');
  if (faqContainer) {
    const perguntasRastreadas = new Set();
    function renderFaqs() {
      faqContainer.innerHTML = faqData
        .map(
          (item) => `
        <div class="faq__question"> <div class="faq__question__titles">
            <h3 class="faq__question__title">"${item.question}"</h3>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
          </div>
          <div class="faq__answer-wrapper">
            <p class="faq__question__response">${item.answer}</p>
          </div>
        </div>
      `
        )
        .join('');
    }

    faqContainer.addEventListener('click', (event) => {
      const titleSection = event.target.closest('.faq__question__titles');
      if (!titleSection) return;

      const currentCard = titleSection.closest('.faq__question');

      const isOpening = !currentCard.classList.contains('active');

      if (isOpening) {
        const questionTitleEl = currentCard.querySelector(
          '.faq__question__title'
        );
        const questionText = questionTitleEl
          ? questionTitleEl.innerText.replace(/"/g, '')
          : 'Pergunta Desconhecida';

        if (!perguntasRastreadas.has(questionText)) {
          if (typeof fbq === 'function') {
            fbq('trackCustom', 'FAQ_Interact', {
              content_name: 'Mapa de Objecoes',
              content_category: 'FAQ',
              action: 'Leu a pergunta',
              question_text: questionText,
            });
            console.debug(
              `Meta Pixel: Evento 'FAQ_Interact' disparado para a objeção: ${questionText}`
            );
          }
          perguntasRastreadas.add(questionText);
        }
      }

      const openCards = faqContainer.querySelectorAll('.faq__question.active');
      openCards.forEach((card) => {
        if (card !== currentCard) {
          card.classList.remove('active');
        }
      });

      currentCard.classList.toggle('active');
    });

    renderFaqs();
  }

  const ctaOptions = document.querySelectorAll('.cta__form__item');
  ctaOptions.forEach((element) => {
    element.addEventListener('click', () => {
      ctaOptions.forEach((option) => {
        if (option.classList.contains('active')) {
          option.classList.remove('active');
        }
      });
      element.classList.add('active');
    });
  });

  function updateCalculator() {
    const visitors = parseInt(document.getElementById('visitors').value) || 0;
    const ticket = parseFloat(document.getElementById('ticket').value) || 0;
    const convRate = parseFloat(document.getElementById('conversion').value);
    const speed = parseFloat(document.getElementById('speed').value);

    document.getElementById('conv-display').innerText = convRate + '%';
    document.getElementById('speed-display').innerText = speed + 's';

    const optimalSpeed = 1.0;
    let conversionBoostFactor = 0;

    if (speed > optimalSpeed) {
      const speedDiff = speed - optimalSpeed;
      conversionBoostFactor = speedDiff * 0.15;
    }

    if (conversionBoostFactor > 1.0) conversionBoostFactor = 1.0;

    const currentMonthlyRevenue = visitors * (convRate / 100) * ticket;

    const potentialMonthlyRevenue =
      currentMonthlyRevenue * (1 + conversionBoostFactor);

    const lostMonthlyRevenue = potentialMonthlyRevenue - currentMonthlyRevenue;
    const lostAnnualRevenue = lostMonthlyRevenue * 12;

    document.getElementById('monthly-loss').innerText =
      lostMonthlyRevenue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    document.getElementById('annual-loss').innerText =
      lostAnnualRevenue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
  }

  let calculadoraRastreada = false;
  function trackCalculadoraIntencao() {
    if (!calculadoraRastreada && typeof fbq === 'function') {
      fbq('trackCustom', 'Calculator_Interact', {
        content_name: 'Calculadora de Prejuizo',
        action: 'Interagiu com os sliders',
      });
      calculadoraRastreada = true;
    }
  }

  ['visitors', 'ticket', 'conversion', 'speed'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateCalculator);
      el.addEventListener('change', trackCalculadoraIntencao);
    }
  });

  if (document.getElementById('visitors')) {
    updateCalculator();
  }

  const ctaSubmitButton = document.getElementById('form-captura');

  if (ctaSubmitButton) {
    ctaSubmitButton.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      const form = evento.target;
      const formData = new FormData(form);

      const desafioAtivo = document.querySelector(
        '.cta__form__item.active'
      )?.id;
      if (desafioAtivo) {
        formData.append('desafio', desafioAtivo);
      }

      const data = Object.fromEntries(formData.entries());
      const errorBox = document.getElementById('formError');
      const submitBtn = form.querySelector('button[type="submit"]');

      let errors = [];
      if (!data.ctaNome || data.ctaNome.trim().length < 3)
        errors.push('Nome muito curto.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ctaEmail))
        errors.push('E-mail inválido.');

      const telefoneLimpo = data.ctaTel?.replace(/\D/g, '');
      if (!telefoneLimpo || telefoneLimpo.length < 10)
        errors.push('Telefone inválido.');
      if (!desafioAtivo) errors.push('Selecione um desafio.');

      if (errors.length > 0) {
        errorBox.innerHTML = errors.join('<br>');
        return;
      }

      try {
        errorBox.innerHTML = 'Enviando...';
        submitBtn.disabled = true;

        const response = await fetch('./api/form-lead.php', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          errorBox.style.color = '#00ff88';
          errorBox.innerHTML = 'Sucesso!';

          if (typeof fbq === 'function') {
            fbq(
              'track',
              'Lead',
              {
                value: result.dados_lead.valor,
                currency: 'BRL',
                content_category: result.dados_lead.desafio,
              },
              {
                eventID: result.dados_lead.transaction_id,
              }
            );
          }

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'lead_gerado_sucesso',
            lead_value: result.dados_lead.valor,
            lead_type: result.dados_lead.desafio,
            transaction_id: result.dados_lead.transaction_id,
          });
        } else {
          throw new Error(result.message || 'Erro no processamento dos dados.');
        }
      } catch (err) {
        errorBox.innerHTML = 'Falha técnica: ' + err.message;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  let alturaTotalCache = 0;
  const marcosAlcancados = new Set();
  const marcosParaRastrear = [50, 75, 90];

  function atualizarDimensoes() {
    alturaTotalCache =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
  }

  function calcularERastrearScroll() {
    if (alturaTotalCache <= 0) return;

    const scrollAtual = window.scrollY || document.documentElement.scrollTop;
    const porcentagemRolada = (scrollAtual / alturaTotalCache) * 100;

    marcosParaRastrear.forEach((marco) => {
      if (porcentagemRolada >= marco && !marcosAlcancados.has(marco)) {
        marcosAlcancados.add(marco);
        if (typeof fbq === 'function') {
          fbq('trackCustom', 'Scroll_Depth', {
            porcentagem: `${marco}%`,
            action: `Rolou ${marco}% da pagina`,
          });
        }
      }
    });

    if (marcosAlcancados.size === marcosParaRastrear.length) {
      window.removeEventListener('scroll', otimizarScroll);
    }
  }

  window.addEventListener('load', atualizarDimensoes);
  window.addEventListener('resize', atualizarDimensoes);

  let ticking = false;
  function otimizarScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        calcularERastrearScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', otimizarScroll, { passive: true });
});
