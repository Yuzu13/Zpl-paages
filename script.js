document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const form = document.getElementById('formularioContato');
    const formMessage = document.getElementById('mensagem');
    const telInput = document.getElementById('telefone'); // Input do telefone
    const emailInput = document.getElementById('E-mail'); // Input do e-mail

    const modal = document.getElementById('modalPrivacidade');
    const cookieBanner = document.getElementById('cookieBanner');
    const aceitarCookiesBtn = document.getElementById('aceitarCookies');
    const politicaLink = document.getElementById('politicaLink');

    const scrollThreshold = 50; // Quantidade de pixels para rolar antes de mudar a cor do header

    // --- Funcionalidade do Header Scrolled ---
    function checkScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Adiciona o evento de rolagem e chama a função uma vez no carregamento
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Executa ao carregar a página

    // --- Funcionalidade do Menu Hambúrguer ---
    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('active'); // Para animação do ícone
        });

       // Smooth scroll, ajuste para header fixo e fechar menu ao clicar em um item de navegação interna
        mainNav.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault(); // Previne o comportamento padrão de salto

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const header = document.querySelector('header');
                    let headerOffset = 0;

                    // Verifica se o header existe, está visível e é fixo para pegar sua altura
                    if (header && getComputedStyle(header).position === 'fixed') {
                        headerOffset = header.offsetHeight;
                    }

                    // Calcula a posição correta para rolar
                    // targetElement.getBoundingClientRect().top nos dá a posição relativa à viewport
                    // window.scrollY nos dá o quanto já rolamos a página
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth' // A mágica da rolagem suave!
                    });
                }

                // Fecha o menu hambúrguer (se estiver ativo e visível)
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (hamburgerMenu) { // Garante que hamburgerMenu foi encontrado
                        hamburgerMenu.classList.remove('active');
                    }
                }
            });
        });

    // --- Máscara de Telefone (Escolha UMA das opções abaixo) ---

    // OPÇÃO 1: Usando jQuery + Inputmask (recomendado para maior robustez)
    // Certifique-se de que as tags <script> do jQuery e Inputmask foram carregadas corretamente no HTML!
    // $(document).ready(function() {
    //     if (telInput) {
    //         $('#telefone').inputmask({
    //             mask: '(99) 99999-9999',
    //             placeholder: '_',
    //             showMaskOnFocus: true,
    //             showMaskOnHover: false,
    //             clearIncomplete: true
    //         });
    //     }
    // });


    // OPÇÃO 2: Máscara de Telefone com JavaScript puro (se não quiser usar jQuery/Inputmask)
    if (telInput) {
        telInput.addEventListener('focus', () => {
            if (!telInput.value) telInput.value = '(';
        });

        telInput.addEventListener('blur', () => {
            if (telInput.value === '(' || telInput.value === '') telInput.value = '';
        });

        telInput.addEventListener('input', () => {
            let nums = telInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito

            if (nums.length <= 2) {
                telInput.value = '(' + nums;
            } else if (nums.length <= 7) { // (DD) XXXX-X
                telInput.value = '(' + nums.substring(0,2) + ') ' + nums.substring(2);
            } else if (nums.length <= 10) { // (DD) XXXX-XXXX
                telInput.value = '(' + nums.substring(0,2) + ') ' + nums.substring(2,6) + '-' + nums.substring(6);
            } else { // (DD) XXXXX-XXXX (celular)
                telInput.value = '(' + nums.substring(0,2) + ') ' + nums.substring(2,7) + '-' + nums.substring(7,11);
            }
        });
    }


    // --- Lógica do Formulário de Contato ---
    if (form) {
        form.addEventListener('submit', function (e) {
            // Se você optou pela Opção 2 (JS puro) para a máscara de telefone, adicione a validação aqui:
            // Validação de telefone (se não usar inputmask)
            if (telInput) {
                const telefoneLimpo = telInput.value.replace(/\D/g, ''); // Apenas números
                const fixoValido = telefoneLimpo.length === 10; // DD + 8 dígitos
                const celularValido = telefoneLimpo.length === 11; // DD + 9 dígitos

                if (!(fixoValido || celularValido)) {
                    formMessage.textContent = 'Telefone inválido. Use (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX.';
                    formMessage.style.color = '#dc3545'; // Cor vermelha para erro
                    e.preventDefault(); // Impede o envio do formulário
                    return;
                }
            }

            // Validação de e-mail (básica)
            if (emailInput) {
                const email = emailInput.value.trim();
                const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!mailRegex.test(email)) {
                    formMessage.textContent = 'E-mail inválido. Digite um e-mail válido (ex: exemplo@dominio.com).';
                    formMessage.style.color = '#dc3545';
                    e.preventDefault();
                    return;
                }
            }

            // Se a validação passou, exibe mensagem de sucesso antes de enviar
            if (formMessage) {
                formMessage.textContent = 'Solicitação enviada com sucesso! Em breve entraremos em contato.';
                formMessage.style.color = '#25d366'; // Verde para sucesso
            }
            // Não chame e.preventDefault() aqui, deixe o formsubmit.co cuidar do envio e redirecionamento.
            // O formulário será enviado após a execução deste script.
        });
    }

    // --- Lógica do Banner de Cookies ---
    // Mostrar o aviso de cookies se ainda não aceitou
    if (!localStorage.getItem('cookiesAceitos') && cookieBanner) {
        cookieBanner.style.display = 'flex'; // Usamos flex para centralizar os itens
    }

    // Aceitar cookies
    if (aceitarCookiesBtn) {
        aceitarCookiesBtn.addEventListener('click', function () {
            localStorage.setItem('cookiesAceitos', 'true'); // Armazena como string 'true'
            if (cookieBanner) {
                cookieBanner.style.display = 'none';
            }
        });
    }

    // --- Lógica do Modal de Política de Privacidade ---
    // Abrir Modal
    // Tornamos openModal uma função global para que possa ser chamada pelo onclick no HTML
    window.openModal = function () {
        if (modal) {
            modal.style.display = 'flex'; // Usamos flex para centralizar o modal
            document.body.style.overflow = 'hidden'; // desativa scroll do body
        }
    };

    // Fechar Modal
    // Tornamos closeModal uma função global
    window.closeModal = function () {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // reativa scroll do body
        }
    };

    // Evento para abrir o modal ao clicar em "Saiba mais"
    if (politicaLink) {
        politicaLink.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link (ir para âncora)
            openModal();
        });
    }

    // Fechar o modal clicando fora do conteúdo
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) { // Verifica se o clique foi diretamente no fundo do modal
                closeModal();
            }
        });
    }
});
