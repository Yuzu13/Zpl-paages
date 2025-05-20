// Rolagem suave
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Envio do formulário
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
  this.reset();
});
