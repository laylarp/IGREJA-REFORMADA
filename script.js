// Dados do aplicativo
const SENHA_VALIDA = "gala2025";
let nomeConvidado = "";
let isFromLink = false;
let deferredPrompt;
let isInstalled = false;

// Inicialização
(function() {
    // Verificar parâmetros da URL ANTES de qualquer coisa
    processUrlParametersImmediately();
    
    // Configurar app
    setupApp();
    
    // Configurar partículas
    setupParticles();
    
    // Evento para instalação PWA
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        isInstalled = false;
    });
    
    window.addEventListener('appinstalled', () => {
        isInstalled = true;
        hideInstallPrompt();
        showNotification('Aplicativo instalado com sucesso!');
        localStorage.setItem('appInstalled', 'true');
    });
})();

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
        }, 300);
    } else {
        // Mostrar tela inicial normalmente
        document.getElementById('tela1').classList.add('active');
    }
    
    // Mostrar prompt de instalação se for mobile
    if (isMobile() && !isInstalled) {
        setTimeout(() => {
            showInstallPrompt();
        }, 3000);
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

// Verificar se é mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Mostrar prompt de instalação
function showInstallPrompt() {
    const dismissed = localStorage.getItem('installPromptDismissed');
    const appInstalled = localStorage.getItem('appInstalled');
    
    if (!dismissed && (!isInstalled && appInstalled !== 'true')) {
        const prompt = document.getElementById('installPrompt');
        if (prompt) {
            prompt.style.display = 'flex';
        }
    }
}

// Esconder prompt de instalação
function hideInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.style.display = 'none';
    }
}

// Instalar aplicativo
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showNotification('Instalação iniciada!');
                localStorage.setItem('appInstalled', 'true');
            }
            deferredPrompt = null;
        });
    } else {
        showNotification('Use o menu do navegador para instalar (⋮ → Instalar app)');
    }
}

function dismissPrompt() {
    hideInstallPrompt();
    localStorage.setItem('installPromptDismissed', 'true');
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
    
    showNotification('Convite gerado com sucesso!');
    
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
        
        showNotification('Convite carregado!');
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

// FUNÇÃO PRINCIPAL DE DOWNLOAD - VERSÃO OTIMIZADA
function baixarImagem() {
    if (!nomeConvidado) {
        showNotification('Primeiro gere um convite!', 'error');
        return;
    }
    
    const btnDownload = document.querySelector('.btn-download');
    const originalHTML = btnDownload.innerHTML;
    btnDownload.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btnDownload.disabled = true;
    
    showNotification('🖼️ Gerando imagem em alta qualidade...');
    
    // Salvar estilos originais
    const elemento = document.getElementById('areaConvite');
    const estilosOriginais = {
        width: elemento.style.width,
        height: elemento.style.height,
        position: elemento.style.position,
        left: elemento.style.left,
        top: elemento.style.top,
        transform: elemento.style.transform,
        margin: elemento.style.margin,
        padding: elemento.style.padding,
        backgroundColor: elemento.style.backgroundColor
    };
    
    // Criar um container de captura
    const captureContainer = document.createElement('div');
    captureContainer.className = 'capture-container';
    captureContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #f5f1e9;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
        overflow: hidden;
    `;
    
    // Clonar o convite
    const conviteClone = elemento.cloneNode(true);
    conviteClone.id = 'convite-capture';
    
    // Aplicar estilos otimizados para captura
    conviteClone.style.cssText = `
        width: 900px !important;
        max-width: 90vw !important;
        height: 1600px !important;
        max-height: 90vh !important;
        margin: 0 !important;
        padding: 40px !important;
        background: #f5f1e9 !important;
        border-radius: 20px !important;
        transform: none !important;
        position: relative !important;
        overflow: visible !important;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
    `;
    
    // Ajustar elementos internos
    setTimeout(() => {
        // Ajustar borda do convite
        const border = conviteClone.querySelector('.convite-border');
        if (border) {
            border.style.cssText = `
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 50px !important;
                border: 4px solid #d4af37 !important;
                border-radius: 15px !important;
                background: white !important;
                box-sizing: border-box !important;
            `;
        }
        
        // Aumentar tamanho do texto
        const aumentarTexto = (elemento, multiplicador) => {
            const estilo = window.getComputedStyle(elemento);
            if (estilo.fontSize) {
                const tamanho = parseFloat(estilo.fontSize);
                if (!isNaN(tamanho)) {
                    elemento.style.fontSize = (tamanho * multiplicador) + 'px';
                }
            }
        };
        
        // Aplicar a todos os textos importantes
        const titulos = conviteClone.querySelectorAll('h1, h2, h3');
        titulos.forEach(titulo => aumentarTexto(titulo, 1.8));
        
        const paragrafos = conviteClone.querySelectorAll('p');
        paragrafos.forEach(p => aumentarTexto(p, 1.5));
        
        const spans = conviteClone.querySelectorAll('span');
        spans.forEach(span => aumentarTexto(span, 1.3));
        
        // Ajustar ícones
        const icones = conviteClone.querySelectorAll('i');
        icones.forEach(icone => {
            const estilo = window.getComputedStyle(icone);
            if (estilo.fontSize) {
                const tamanho = parseFloat(estilo.fontSize);
                if (!isNaN(tamanho)) {
                    icone.style.fontSize = (tamanho * 1.8) + 'px';
                }
            }
        });
        
        // Adicionar ao container
        captureContainer.appendChild(conviteClone);
        document.body.appendChild(captureContainer);
        
        // Capturar após um breve delay para renderização
        setTimeout(() => {
            html2canvas(conviteClone, {
                scale: 3, // Alta qualidade
                useCORS: true,
                backgroundColor: '#f5f1e9',
                width: conviteClone.offsetWidth,
                height: conviteClone.offsetHeight,
                logging: false,
                allowTaint: true,
                useCORS: true,
                onclone: function(clonedDoc, element) {
                    // Garantir que todos os estilos sejam aplicados
                    element.style.width = conviteClone.offsetWidth + 'px';
                    element.style.height = conviteClone.offsetHeight + 'px';
                    element.style.overflow = 'visible';
                }
            }).then(canvas => {
                // Remover container de captura
                document.body.removeChild(captureContainer);
                
                // Criar link para download
                const link = document.createElement('a');
                const nomeArquivo = `Convite_Gala_Juvenil_${nomeConvidado.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                
                // Otimizar canvas final
                const canvasFinal = document.createElement('canvas');
                canvasFinal.width = canvas.width;
                canvasFinal.height = canvas.height;
                const ctx = canvasFinal.getContext('2d');
                
                // Adicionar fundo branco
                ctx.fillStyle = '#f5f1e9';
                ctx.fillRect(0, 0, canvasFinal.width, canvasFinal.height);
                
                // Desenhar o convite
                ctx.drawImage(canvas, 0, 0);
                
                link.download = nomeArquivo;
                link.href = canvasFinal.toDataURL('image/png', 1.0);
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }, 100);
                
                showNotification('✅ Convite baixado com sucesso!');
            }).catch(error => {
                console.error('Erro no html2canvas:', error);
                document.body.removeChild(captureContainer);
                showNotification('❌ Erro ao gerar imagem. Tente novamente.', 'error');
            }).finally(() => {
                btnDownload.innerHTML = originalHTML;
                btnDownload.disabled = false;
            });
        }, 800);
        
    }, 100);
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
    
    const textoConvite = `*🎉 Convite para a Gala Juvenil 2025 🎉*\n\nOlá! Recebi um convite especial para a *Gala Juvenil da Igreja Reformada*.\n\nClique no link abaixo para ver o convite personalizado:\n\n🔗 ${linkConvite}\n\n*Baixe o convite e participe desta celebração especial!*`;
    
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
        notification.style.background = 'linear-gradient(135deg, #f44336 0%, #c62828 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%)';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registrado:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}

// Limpar estado quando sair do modo link
window.addEventListener('pageshow', function(event) {
    // Se não tem parâmetros na URL, limpar marcação de link
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('nome') && !urlParams.has('share')) {
        localStorage.removeItem('isFromLink');
    }
});