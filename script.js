// Dados do aplicativo
const SENHA_VALIDA = "gala2025";
let nomeConvidado = "";
let deferredPrompt;
let isInstalled = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurações da aplicação
    setupApp();
    
    // Configurar partículas
    setupParticles();
    
    // Verificar se já está instalado
    checkIfInstalled();
    
    // Mostrar prompt de instalação em mobile
    if (isMobile()) {
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
    });
});

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
    if (nomeSalvo) {
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

// Verificar se é mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Mostrar prompt de instalação
function showInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    prompt.style.display = 'flex';
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
            }
            deferredPrompt = null;
        });
    } else {
        showNotification('Use o menu do navegador para instalar (3 pontos → Instalar app)');
    }
}

function dismissPrompt() {
    hideInstallPrompt();
    localStorage.setItem('installPromptDismissed', 'true');
}

function checkIfInstalled() {
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone ||
        document.referrer.includes('android-app://')) {
        isInstalled = true;
    }
    
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
        hideInstallPrompt();
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
    localStorage.setItem('conviteGalaNome', nomeConvidado);
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
    
    if (nomeSalvo) {
        nomeConvidado = nomeSalvo;
        document.getElementById('displayNome').textContent = nomeSalvo;
        navegar('tela4');
        showNotification('Convite carregado!');
    } else {
        showNotification('Nenhum convite encontrado. Crie um novo primeiro.', 'error');
    }
}

// Download da imagem do convite
function baixarImagem() {
    const elemento = document.getElementById('areaConvite');
    
    elemento.style.userSelect = 'auto';
    elemento.style.webkitUserSelect = 'auto';
    
    const btnDownload = document.querySelector('.btn-download');
    const originalHTML = btnDownload.innerHTML;
    btnDownload.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btnDownload.disabled = true;
    
    showNotification('Gerando imagem...');
    
    html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        onclone: function(clonedDoc) {
            const clonedElement = clonedDoc.getElementById('areaConvite');
            clonedElement.style.width = elemento.offsetWidth + 'px';
            clonedElement.style.height = elemento.offsetHeight + 'px';
            clonedElement.style.transform = 'none';
        }
    }).then(canvas => {
        elemento.style.userSelect = 'none';
        elemento.style.webkitUserSelect = 'none';
        
        const link = document.createElement('a');
        link.download = `Convite-Gala-Juvenil-${nomeConvidado.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        btnDownload.innerHTML = originalHTML;
        btnDownload.disabled = false;
        
        showNotification('Convite baixado com sucesso!');
    }).catch(error => {
        console.error("Erro ao gerar imagem:", error);
        showNotification('Erro ao baixar a imagem. Tente novamente.', 'error');
        
        btnDownload.innerHTML = originalHTML;
        btnDownload.disabled = false;
        elemento.style.userSelect = 'none';
        elemento.style.webkitUserSelect = 'none';
    });
}

// Compartilhar no WhatsApp
function compartilharWhatsApp() {
    const textoConvite = `*🎉 Convite para a Gala Juvenil 2025 🎉*\n\nOlá! ${nomeConvidado} está convidando você para a *Gala Juvenil da Igreja Reformada*.\n\n📅 *Data:* 26 de Dezembro de 2025\n🕙 *Hora:* 22:00 às 04:00\n📍 *Local:* Congregação Tsakane, Machava-Sede\n\n🌟 *Lema:* "Como é bom e agradável quando os irmãos convivem em união." (Salmos 133:1)\n\n🙏 Será uma ocasião especial de comunhão, louvores e confraternização.\n\n*Contamos com sua presença para glorificarmos juntos ao Senhor!*\n\n📞 Contato: 85 232 8379 | 84 401 2254`;
    
    const textoCodificado = encodeURIComponent(textoConvite);
    const urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    showNotification('Compartilhando no WhatsApp...');
}

// Compartilhar convite
function compartilharConvite() {
    if (navigator.share) {
        navigator.share({
            title: 'Convite Gala Juvenil 2025',
            text: `${nomeConvidado} convida você para a Gala Juvenil!`,
            url: window.location.href,
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
    
    notificationText.textContent = message;
    
    // Definir cor baseada no tipo
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, var(--error) 0%, #c62828 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, var(--success) 0%, #2e7d32 100%)';
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