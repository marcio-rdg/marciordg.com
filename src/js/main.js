import '@/scss/style.scss';

function auditSite() {
  const urlInput = document.getElementById('siteUrl');
  const url = urlInput.value.trim();

  if (!url) {
    // Um feedback visual rápido é melhor que um alert,
    // mas para o MVP, o alert resolve.
    alert('Por favor, insira a URL do seu site.');
    return;
  }

  // Higienização básica da string para o link do WhatsApp
  const message = `Olá Márcio! Acabei de solicitar uma auditoria express para o meu site: ${url}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = '5533000000000'; // Seu número real aqui

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
    '_blank'
  );
}
