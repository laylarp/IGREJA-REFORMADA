// Dados do aplicativo
const SENHA_VALIDA = "gala2025";
let nomeConvidado = "";
let isFromLink = false;
let screenshotShown = false;

// Inicialização
(function() {
    // Verificar parâmetros da URL ANTES de qualquer coisa
    processUrlParametersImmediately();
    
    // Configurar app
    setupApp();
    
    // Configurar partículas
    setupParticles();
    
    // PWA - Mostrar mensagem de instalação
    setupPWA();
})();

// Configurar PWA
function setupPWA() {
    // Verificar se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App já está instalado como PWA');
        return;
    }
    
    // Verificar se navegador suporta PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar Service Worker:', error);
            });
    }
}

// Processar parâmetros da URL IMEDIATAMENTE
function processUrlParametersImmediately() {
    const urlParams = new URLSearchParams(window.location.search);
    const nomeParam = urlParams.get('nome');
    const shareParam = urlParams.get('share');
    
    if (nomeParam || shareParam === 'true') {
        isFromLink = true;
        
        if (nomeParam) {
            try {
                nomeConvidado = decodeURIComponent(nomeParam);
                console.log('Nome do convite via URL:', nomeConvidado);
                
                // Salvar no localStorage para persistência
                localStorage.setItem('conviteGalaNome', nomeConvidado);
                localStorage.setItem('conviteGerado', 'true');
                localStorage.setItem('isFromLink', 'true');
            } catch (e) {
                console.error('Erro ao decodificar nome:', e);
            }
        }
    }
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, processando convite...');
    
    // Verificar se tem convite para carregar
    const isFromLinkStorage = localStorage.getItem('isFromLink');
    const nomeSalvo = localStorage.getItem('conviteGalaNome');
    const conviteCriado = localStorage.getItem('conviteGerado');
    
    if ((isFromLink || isFromLinkStorage === 'true') && nomeSalvo && conviteCriado === 'true') {
        console.log('Carregando convite do localStorage...');
        nomeConvidado = nomeSalvo;
        document.getElementById('displayNome').textContent = nomeConvidado;
        
        // Navegar DIRETO para tela do convite
        setTimeout(() => {
            navegarParaConvite();
            ocultarBotaoEditar();
            showNotification('Convite carregado!');
            
            // Mostrar notificação de screenshot após 2 segundos
            setTimeout(() => {
                showScreenshotNotification();
            }, 2000);
        }, 300);
    } else {
        // Mostrar tela inicial normalmente
        document.getElementById('tela1').classList.add('active');
    }
});

// Navegar direto para convite
function navegarParaConvite() {
    document.querySelectorAll('.screen').forEach(tela => {
        tela.classList.remove('active');
    });
    document.getElementById('tela4').classList.add('active');
    window.scrollTo(0, 0);
}

// Configuração da aplicação
function setupApp() {
    // Enter na senha
    document.getElementById('inputSenha').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validarSenha();
        }
    });
    
    // Enter no nome
    document.getElementById('nomeConvidado').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            gerarConvite();
        }
    });
    
    // Carrega nome salvo se existir (apenas se não veio de link)
    if (!isFromLink) {
        const nomeSalvo = localStorage.getItem('conviteGalaNome');
        if (nomeSalvo) {
            document.getElementById('nomeConvidado').value = nomeSalvo;
        }
    }
}

// Configurar partículas
function setupParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: "#d4af37" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: false },
                move: { enable: true, speed: 1, direction: "none", random: true }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: false }, onclick: { enable: false } }
            }
        });
    }
}

// Ocultar botão editar
function ocultarBotaoEditar() {
    const btnEditar = document.getElementById('btnEditarNome');
    if (btnEditar) {
        btnEditar.style.display = 'none';
    }
}

// Mostrar notificação de screenshot
function showScreenshotNotification() {
    if (!screenshotShown) {
        const notification = document.getElementById('screenshotNotification');
        notification.style.display = 'block';
        screenshotShown = true;
        
        // Fechar automaticamente após 10 segundos
        setTimeout(() => {
            closeScreenshotNotification();
        }, 10000);
    }
}

// Fechar notificação de screenshot
function closeScreenshotNotification() {
    const notification = document.getElementById('screenshotNotification');
    notification.style.display = 'none';
}

// Navegação entre telas
function navegar(telaDestino) {
    document.querySelectorAll('.screen').forEach(tela => {
        tela.classList.remove('active');
    });
    document.getElementById(telaDestino).classList.add('active');
    window.scrollTo(0, 0);
}

// Validação de senha
function validarSenha() {
    const senhaDigitada = document.getElementById('inputSenha').value;
    
    if (senhaDigitada === SENHA_VALIDA) {
        navegar('tela3');
        document.getElementById('inputSenha').value = "";
        showNotification('Acesso permitido!');
    } else {
        showNotification('Senha incorreta. Tente novamente.', 'error');
        document.getElementById('inputSenha').value = "";
        document.getElementById('inputSenha').focus();
    }
}

// Alternar visibilidade da senha
function togglePassword() {
    const input = document.getElementById('inputSenha');
    const button = document.querySelector('.show-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

// Geração do convite
function gerarConvite() {
    nomeConvidado = document.getElementById('nomeConvidado').value.trim();
    
    if (!nomeConvidado) {
        showNotification('Por favor, digite seu nome para gerar o convite.', 'error');
        return;
    }
    
    document.getElementById('displayNome').textContent = nomeConvidado;
    navegar('tela4');
    
    // Mostrar botão editar se não for de link
    if (!isFromLink) {
        const btnEditar = document.getElementById('btnEditarNome');
        if (btnEditar) {
            btnEditar.style.display = 'block';
        }
    }
    
    // Salvar dados
    localStorage.setItem('conviteGalaNome', nomeConvidado);
    localStorage.setItem('conviteGerado', 'true');
    localStorage.removeItem('isFromLink'); // Remover marcação de link
    
    // Resetar flag de screenshot
    screenshotShown = false;
    
    // Mostrar notificação de screenshot após 1 segundo
    setTimeout(() => {
        showScreenshotNotification();
    }, 1000);
    
    // Efeito visual no nome
    const nomeElement = document.getElementById('displayNome');
    nomeElement.classList.add('animate__animated', 'animate__tada');
    setTimeout(() => {
        nomeElement.classList.remove('animate__animated', 'animate__tada');
    }, 1000);
}

// Ver convite existente
function verConviteExistente() {
    const nomeSalvo = localStorage.getItem('conviteGalaNome');
    const conviteCriado = localStorage.getItem('conviteGerado');
    
    if (nomeSalvo && conviteCriado === 'true') {
        nomeConvidado = nomeSalvo;
        document.getElementById('displayNome').textContent = nomeSalvo;
        navegar('tela4');
        
        // Ocultar botão editar quando vem do "Ver Convite"
        ocultarBotaoEditar();
        
        // Resetar flag de screenshot
        screenshotShown = false;
        
        // Mostrar notificação de screenshot após 1 segundo
        setTimeout(() => {
            showScreenshotNotification();
        }, 1000);
    } else {
        showNotification('Nenhum convite encontrado. Crie um novo primeiro.', 'error');
    }
}

// Editar nome
function editarNome() {
    navegar('tela3');
    document.getElementById('nomeConvidado').value = nomeConvidado;
    document.getElementById('nomeConvidado').focus();
}

// Gerar link compartilhável
function gerarLinkCompartilhavel() {
    if (!nomeConvidado) {
        showNotification('Primeiro gere um convite com seu nome!', 'error');
        return;
    }
    
    const nomeCodificado = encodeURIComponent(nomeConvidado);
    const baseUrl = window.location.origin + window.location.pathname;
    const linkCompleto = `${baseUrl}?nome=${nomeCodificado}&share=true`;
    
    // Usar API moderna de clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(linkCompleto)
            .then(() => {
                showNotification('✅ Link copiado! Cole no WhatsApp.');
            })
            .catch(err => {
                console.error('Erro ao copiar:', err);
                fallbackCopy(linkCompleto);
            });
    } else {
        fallbackCopy(linkCompleto);
    }
}

// Função fallback para copiar texto
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showNotification('✅ Link copiado! Cole no WhatsApp.');
        } else {
            showNotification('❌ Não foi possível copiar.', 'error');
        }
    } catch (err) {
        document.body.removeChild(textArea);
        showNotification('❌ Erro ao copiar.', 'error');
    }
}

// Compartilhar no WhatsApp
function compartilharWhatsApp() {
    if (!nomeConvidado) {
        showNotification('Primeiro gere um convite!', 'error');
        return;
    }
    
    const nomeCodificado = encodeURIComponent(nomeConvidado);
    const baseUrl = window.location.origin + window.location.pathname;
    const linkConvite = `${baseUrl}?nome=${nomeCodificado}&share=true`;
    
    const textoConvite = `*🎉 Convite para a Gala Juvenil 2025 🎉*\n\nOlá! Recebi um convite especial para a *Gala Juvenil da Igreja Reformada*.\n\nClique no link abaixo para ver o convite personalizado:\n\n🔗 ${linkConvite}\n\n*Para salvar: Use o método comum do seu celular para tirar screenshot!*`;
    
    const textoCodificado = encodeURIComponent(textoConvite);
    const urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
    
    // Abrir em nova janela
    window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
    showNotification('Abrindo WhatsApp...');
}

// Compartilhar convite
function compartilharConvite() {
    if (!nomeConvidado) {
        showNotification('Primeiro gere um convite!', 'error');
        return;
    }
    
    if (navigator.share) {
        const nomeCodificado = encodeURIComponent(nomeConvidado);
        const baseUrl = window.location.origin + window.location.pathname;
        const linkConvite = `${baseUrl}?nome=${nomeCodificado}&share=true`;
        
        navigator.share({
            title: 'Convite Gala Juvenil 2025',
            text: `${nomeConvidado} convida você para a Gala Juvenil! Clique no link para ver o convite:`,
            url: linkConvite,
        })
        .then(() => showNotification('Convite compartilhado!'))
        .catch((error) => {
            console.log('Erro ao compartilhar:', error);
            compartilharWhatsApp();
        });
    } else {
        compartilharWhatsApp();
    }
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    
    // Definir cor baseada no tipo
    if (type === 'error') {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Limpar estado quando sair do modo link
window.addEventListener('pageshow', function(event) {
    // Se não tem parâmetros na URL, limpar marcação de link
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('nome') && !urlParams.has('share')) {
        localStorage.removeItem('isFromLink');
    }
});