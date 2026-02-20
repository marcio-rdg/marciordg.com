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
});
