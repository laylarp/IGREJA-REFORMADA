// Dados do aplicativo
const SENHA_VALIDA = "gala2025";
let nomeConvidado = "";
let isFromLink = false;
let isFromView = false;
let deferredPrompt;
let isInstalled = false;
let conviteGerado = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se veio de um link compartilhado
    checkUrlParameters();
    
    // Configurações da aplicação
    setupApp();
    
    // Configurar partículas
    setupParticles();
    
    // Verificar se já está instalado
    checkIfInstalled();
    
    // Mostrar prompt de instalação em mobile
    if (isMobile() && !isInstalled) {
        setTimeout(() => {
            showInstallPrompt();
        }, 2000);
    }
    
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
});

// Verificar parâmetros da URL
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const nomeParam = urlParams.get('nome');
    const shareParam = urlParams.get('share');
    
    if (nomeParam || shareParam === 'true') {
        isFromLink = true;
        
        if (nomeParam) {
            try {
                nomeConvidado = decodeURIComponent(nomeParam);
                document.getElementById('displayNome').textContent = nomeConvidado;
                conviteGerado = true;
                
                // Ir direto para tela do convite
                setTimeout(() => {
                    navegar('tela4');
                    ocultarBotaoEditar();
                    showNotification('Convite carregado!');
                }, 300);
            } catch (e) {
                console.error('Erro ao decodificar nome:', e);
                showNotification('Erro ao carregar convite.', 'error');
            }
        }
    }
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
    
    // Carrega nome salvo se existir
    const nomeSalvo = localStorage.getItem('conviteGalaNome');
    if (nomeSalvo && !isFromLink) {
        document.getElementById('nomeConvidado').value = nomeSalvo;
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
    if (!dismissed && !isInstalled) {
        const prompt = document.getElementById('installPrompt');
        prompt.style.display = 'flex';
    }
}

// Esconder prompt de instalação
function hideInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    prompt.style.display = 'none';
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

function checkIfInstalled() {
    // Verificar se já foi instalado como PWA
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone ||
        document.referrer.includes('android-app://')) {
        isInstalled = true;
        localStorage.setItem('appInstalled', 'true');
    }
    
    // Verificar se já foi instalado anteriormente
    const appInstalled = localStorage.getItem('appInstalled');
    if (appInstalled === 'true') {
        isInstalled = true;
    }
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
    conviteGerado = true;
    
    // Mostrar botão editar se não for de link
    if (!isFromLink) {
        const btnEditar = document.getElementById('btnEditarNome');
        if (btnEditar) {
            btnEditar.style.display = 'block';
        }
    }
    
    localStorage.setItem('conviteGalaNome', nomeConvidado);
    localStorage.setItem('conviteGerado', 'true');
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
        isFromView = true;
        nomeConvidado = nomeSalvo;
        document.getElementById('displayNome').textContent = nomeSalvo;
        conviteGerado = true;
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

// Download da imagem do convite - CORRIGIDO
function baixarImagem() {
    if (!conviteGerado) {
        showNotification('Primeiro gere um convite!', 'error');
        return;
    }
    
    const elemento = document.getElementById('areaConvite');
    
    if (!elemento) {
        showNotification('Erro: Elemento do convite não encontrado.', 'error');
        return;
    }
    
    const btnDownload = document.querySelector('.btn-download');
    if (!btnDownload) return;
    
    const originalHTML = btnDownload.innerHTML;
    btnDownload.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btnDownload.disabled = true;
    
    showNotification('Gerando imagem...');
    
    // Forçar reflow para garantir que tudo está renderizado
    elemento.style.display = 'block';
    elemento.offsetHeight;
    
    const options = {
        scale: 3, // Aumentado para melhor qualidade
        useCORS: true,
        backgroundColor: '#f5f1e9', // Cor de fundo do convite
        logging: false,
        width: elemento.offsetWidth,
        height: elemento.offsetHeight,
        onclone: function(clonedDoc) {
            const clonedElement = clonedDoc.getElementById('areaConvite');
            // Garantir que o elemento clone tenha estilos corretos
            clonedElement.style.width = elemento.offsetWidth + 'px';
            clonedElement.style.height = elemento.offsetHeight + 'px';
            clonedElement.style.transform = 'none';
            clonedElement.style.position = 'relative';
        }
    };
    
    html2canvas(elemento, options)
        .then(canvas => {
            try {
                // Criar link para download
                const link = document.createElement('a');
                const nomeArquivo = `Convite-Gala-Juvenil-${nomeConvidado.replace(/\s+/g, '-')}.png`;
                
                // Configurar link
                link.download = nomeArquivo;
                link.href = canvas.toDataURL('image/png');
                link.style.display = 'none';
                
                // Adicionar ao documento e clicar
                document.body.appendChild(link);
                link.click();
                
                // Limpar
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }, 100);
                
                showNotification('Convite baixado com sucesso!');
                
            } catch (error) {
                console.error("Erro ao criar download:", error);
                showNotification('Erro ao criar arquivo de download.', 'error');
            }
        })
        .catch(error => {
            console.error("Erro no html2canvas:", error);
            showNotification('Erro ao gerar imagem. Tente novamente.', 'error');
        })
        .finally(() => {
            // Restaurar botão
            btnDownload.innerHTML = originalHTML;
            btnDownload.disabled = false;
        });
}

// Gerar link compartilhável - CORRIGIDO
function gerarLinkCompartilhavel() {
    if (!conviteGerado || !nomeConvidado) {
        showNotification('Primeiro gere um convite com seu nome!', 'error');
        return;
    }
    
    const nomeCodificado = encodeURIComponent(nomeConvidado);
    // Criar URL completa com protocolo, domínio e parâmetros
    const linkCompleto = `${window.location.origin}${window.location.pathname}?nome=${nomeCodificado}&share=true`;
    
    // Usar a API moderna de clipboard
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
        // Fallback para navegadores mais antigos
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
        if (successful) {
            showNotification('✅ Link copiado! Cole no WhatsApp.');
        } else {
            showNotification('❌ Não foi possível copiar o link.', 'error');
        }
    } catch (err) {
        console.error('Erro fallback copy:', err);
        showNotification('❌ Erro ao copiar o link.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Compartilhar no WhatsApp - CORRIGIDO
function compartilharWhatsApp() {
    if (!conviteGerado || !nomeConvidado) {
        showNotification('Primeiro gere um convite com seu nome!', 'error');
        return;
    }
    
    const nomeCodificado = encodeURIComponent(nomeConvidado);
    const linkConvite = `${window.location.origin}${window.location.pathname}?nome=${nomeCodificado}&share=true`;
    
       const textoConvite = `🎉✨ *Convite Especial – Gala Juvenil 2025* ✨🎉

      🙌 *Glória a Deus!*  
       É com grande alegria que te convido para participares da  
       *Gala Juvenil da Igreja Reformada*.

       Um momento especial de comunhão, louvor, alegria e edificação espiritual, preparado com muito carinho para ti.

     👉 *Clique no link abaixo para ver o convite personalizado:*  
     🔗 ${window.location.origin}${window.location.pathname}?nome=${encodeURIComponent(nomeConvidado)}&share=true

      ⬇️ *Baixe o convite e junte-se a nós nesse grande encontro para a glória do Senhor!*  🙏✨`;

    
    const textoCodificado = encodeURIComponent(textoConvite);
    const urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
    
    // Abrir em nova janela
    window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
    showNotification('Abrindo WhatsApp...');
}

// Compartilhar convite
function compartilharConvite() {
    if (!conviteGerado || !nomeConvidado) {
        showNotification('Primeiro gere um convite com seu nome!', 'error');
        return;
    }
    
    if (navigator.share) {
        const nomeCodificado = encodeURIComponent(nomeConvidado);
        const linkConvite = `${window.location.origin}${window.location.pathname}?nome=${nomeCodificado}&share=true`;
        
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

// Instalação PWA
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

// Verificar se tem convite gerado ao carregar a página
window.addEventListener('pageshow', function() {
    const conviteCriado = localStorage.getItem('conviteGerado');
    const nomeSalvo = localStorage.getItem('conviteGalaNome');
    
    if (conviteCriado === 'true' && nomeSalvo && !isFromLink) {
        conviteGerado = true;
        nomeConvidado = nomeSalvo;
    }
});