import '@/scss/style.scss';

document.addEventListener('DOMContentLoaded', () => {
  function auditSite() {
    const urlInput = document.getElementById('siteUrl');
    const url = urlInput.value.trim();

    if (!url) {
      return;
    }

    const message = `Olá Márcio! Acabei de solicitar uma auditoria express para o meu site: ${url}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '5533999486162';
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      '_blank'
    );
  }

  const adutiBtn = document.querySelector('#auditButton');
  adutiBtn.addEventListener('click', auditSite);

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

  const faqQuestions = document.querySelectorAll('.faq__question__titles');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', (event) => {
      const currentCard = event.currentTarget.closest('.faq__question');

      if (!currentCard) return;

      const openCards = document.querySelectorAll('.faq__question.active');

      openCards.forEach((card) => {
        if (card !== currentCard) {
          card.classList.remove('active');
        }
      });

      currentCard.classList.toggle('active');
    });
  });

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
  if (!faqContainer) return;

  function renderFaqs() {
    faqContainer.innerHTML = faqData
      .map(
        (item, index) => `
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
    const openCards = faqContainer.querySelectorAll('.faq__question.active');

    openCards.forEach((card) => {
      if (card !== currentCard) {
        card.classList.remove('active');
      }
    });

    currentCard.classList.toggle('active');
  });

  renderFaqs();

  const ctaOptions = document.querySelectorAll('.cta__form__item');
  ctaOptions.forEach((element) => {
    element.addEventListener('click', (event) => {
      ctaOptions.forEach((option) => {
        if (option.classList.contains('active')) {
          option.classList.remove('active');
        }
      });
      element.classList.add('active');
    });
  });
});
