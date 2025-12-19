// Configurações
const ADMIN_PASSWORD = "irm3022irm";
let currentGuestName = "";
let savedInvites = [];

// Elementos da DOM
const screens = {
    welcome: document.getElementById('welcomeScreen'),
    registration: document.getElementById('registrationScreen'),
    invitation: document.getElementById('invitationScreen')
};

const elements = {
    // Botões principais
    enterBtn: document.getElementById('enterBtn'),
    backFromRegistrationBtn: document.getElementById('backFromRegistrationBtn'),
    backFromInviteBtn: document.getElementById('backFromInviteBtn'),
    
    // Modal de senha
    passwordModal: document.getElementById('passwordModal'),
    closePasswordModal: document.getElementById('closePasswordModal'),
    cancelPasswordBtn: document.getElementById('cancelPasswordBtn'),
    accessPassword: document.getElementById('accessPassword'),
    verifyPasswordBtn: document.getElementById('verifyPasswordBtn'),
    passwordError: document.getElementById('passwordError'),
    
    // Formulário
    guestName: document.getElementById('guestName'),
    generateInviteBtn: document.getElementById('generateInviteBtn'),
    nameError: document.getElementById('nameError'),
    previewName: document.getElementById('previewName'),
    
    // Convite
    finalGuestName: document.getElementById('finalGuestName'),
    invitationCard: document.getElementById('invitationCard'),
    
    // Ações
    downloadBtn: document.getElementById('downloadBtn'),
    shareWhatsAppBtn: document.getElementById('shareWhatsAppBtn'),
    newInviteBtn: document.getElementById('newInviteBtn')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadSavedData();
    checkUrlParams();
    setupEventListeners();
    setupPWA();
});

// Configurar PWA
function setupPWA() {
    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
            Notification.requestPermission();
        }, 3000);
    }
    
    // Detectar se está instalado como PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.body.classList.add('pwa-installed');
    }
}

// Inicializar aplicação
function initApp() {
    // Verificar se há convite salvo
    const savedName = localStorage.getItem('galaLastInvite');
    if (savedName) {
        currentGuestName = savedName;
        elements.finalGuestName.textContent = currentGuestName;
    }
    
    // Verificar se há lista de convites
    const savedList = localStorage.getItem('galaInvitesList');
    if (savedList) {
        try {
            savedInvites = JSON.parse(savedList);
        } catch (e) {
            savedInvites = [];
        }
    }
}

// Carregar dados salvos
function loadSavedData() {
    // Tentar carregar logo
    const logoUrl = 'logo.png';
    const logoImg = new Image();
    logoImg.onload = function() {
        // Logo carregado com sucesso
        document.querySelectorAll('.church-logo img, .invitation-logo img').forEach(img => {
            img.src = logoUrl;
        });
    };
    logoImg.onerror = function() {
        // Logo não encontrado, usar fallback
        document.getElementById('logoText').style.display = 'block';
    };
    logoImg.src = logoUrl;
}

// Verificar parâmetros da URL
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteName = urlParams.get('convite');
    
    if (inviteName) {
        const decodedName = decodeURIComponent(inviteName);
        showInvitation(decodedName, true);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Navegação principal
    elements.enterBtn.addEventListener('click', showPasswordModal);
    elements.backFromRegistrationBtn.addEventListener('click', () => showScreen('welcome'));
    elements.backFromInviteBtn.addEventListener('click', () => showScreen('registration'));
    elements.newInviteBtn.addEventListener('click', () => showScreen('registration'));
    
    // Modal de senha
    elements.closePasswordModal.addEventListener('click', hidePasswordModal);
    elements.cancelPasswordBtn.addEventListener('click', hidePasswordModal);
    elements.verifyPasswordBtn.addEventListener('click', verifyPassword);
    elements.accessPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyPassword();
    });
    
    // Formulário
    elements.guestName.addEventListener('input', updatePreview);
    elements.guestName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateInvite();
    });
    elements.generateInviteBtn.addEventListener('click', generateInvite);
    
    // Ações do convite
    elements.downloadBtn.addEventListener('click', downloadInvite);
    elements.shareWhatsAppBtn.addEventListener('click', shareViaWhatsApp);
    
    // Fechar modal ao clicar fora
    elements.passwordModal.addEventListener('click', (e) => {
        if (e.target === elements.passwordModal) {
            hidePasswordModal();
        }
    });
}

// Mostrar tela específica
function showScreen(screenName) {
    // Esconder todas as telas
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar tela solicitada
    screens[screenName].classList.add('active');
    
    // Ações específicas por tela
    if (screenName === 'registration') {
        elements.guestName.focus();
        updatePreview();
    } else if (screenName === 'invitation') {
        // Garantir que o nome esteja atualizado
        elements.finalGuestName.textContent = currentGuestName || '[NOME DO CONVIDADO]';
    }
}

// Modal de senha
function showPasswordModal() {
    elements.passwordModal.classList.add('active');
    elements.accessPassword.value = '';
    elements.passwordError.style.display = 'none';
    elements.accessPassword.focus();
}

function hidePasswordModal() {
    elements.passwordModal.classList.remove('active');
}

function verifyPassword() {
    const password = elements.accessPassword.value.trim();
    
    if (password === ADMIN_PASSWORD) {
        hidePasswordModal();
        showScreen('registration');
    } else {
        elements.passwordError.style.display = 'flex';
        elements.accessPassword.focus();
        elements.accessPassword.select();
    }
}

// Formatar nome
function formatName(name) {
    if (!name) return '';
    
    return name.toLowerCase()
        .split(' ')
        .map(word => {
            // Palavras de conexão mantidas em minúsculo
            const connectors = ['da', 'de', 'do', 'dos', 'das', 'e', '&'];
            if (connectors.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ')
        .trim();
}

// Atualizar pré-visualização
function updatePreview() {
    const name = elements.guestName.value.trim();
    if (name.length >= 2) {
        elements.previewName.textContent = formatName(name);
    } else {
        elements.previewName.textContent = '[NOME DO CONVIDADO]';
    }
}

// Gerar convite
function generateInvite() {
    const rawName = elements.guestName.value.trim();
    
    // Validação
    if (!rawName || rawName.length < 3) {
        elements.nameError.style.display = 'flex';
        elements.guestName.focus();
        return;
    }
    
    // Esconder erro
    elements.nameError.style.display = 'none';
    
    // Formatar nome
    currentGuestName = formatName(rawName);
    
    // Salvar no histórico
    saveInviteToHistory(currentGuestName);
    
    // Atualizar visualização
    elements.finalGuestName.textContent = currentGuestName;
    
    // Mostrar tela do convite
    showScreen('invitation');
    
    // Salvar último convite
    localStorage.setItem('galaLastInvite', currentGuestName);
    
    // Scroll para topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Salvar convite no histórico
function saveInviteToHistory(name) {
    const timestamp = new Date().toISOString();
    const invite = {
        name: name,
        date: timestamp,
        id: Date.now()
    };
    
    // Adicionar no início da lista
    savedInvites.unshift(invite);
    
    // Manter apenas os últimos 50 convites
    if (savedInvites.length > 50) {
        savedInvites = savedInvites.slice(0, 50);
    }
    
    // Salvar no localStorage
    localStorage.setItem('galaInvitesList', JSON.stringify(savedInvites));
}

// Mostrar convite (para links diretos)
function showInvitation(name, fromUrl = false) {
    currentGuestName = formatName(name);
    elements.finalGuestName.textContent = currentGuestName;
    
    if (fromUrl) {
        // Se veio da URL, mostrar apenas o convite
        screens.welcome.classList.remove('active');
        screens.registration.classList.remove('active');
        screens.invitation.classList.add('active');
    } else {
        showScreen('invitation');
    }
}

// Baixar convite como imagem
function downloadInvite() {
    if (!currentGuestName) {
        alert('Por favor, gere um convite primeiro.');
        return;
    }
    
    // Mostrar mensagem de processamento
    const originalText = elements.downloadBtn.innerHTML;
    elements.downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    elements.downloadBtn.disabled = true;
    
    // Temporariamente ajustar o cartão para captura
    const card = elements.invitationCard;
    const originalWidth = card.style.width;
    const originalHeight = card.style.height;
    const originalTransform = card.style.transform;
    const originalMargin = card.style.margin;
    
    // Configurar para captura em alta resolução
    card.style.width = '1200px';
    card.style.height = '1680px'; // Mantém proporção 5:7
    card.style.transform = 'scale(1)';
    card.style.margin = '0 auto';
    card.style.position = 'absolute';
    card.style.left = '-9999px';
    
    // Scroll para garantir renderização completa
    window.scrollTo(0, 0);
    
    // Aguardar renderização
    setTimeout(() => {
        // Capturar com html2canvas
        html2canvas(card, {
            scale: 3, // Alta resolução
            useCORS: true,
            logging: false,
            backgroundColor: '#FFFFFF',
            allowTaint: true,
            width: 1200,
            height: 1680,
            scrollX: 0,
            scrollY: 0,
            onclone: function(clonedDoc) {
                // Garantir que elementos estejam visíveis no clone
                const clonedCard = clonedDoc.getElementById('invitationCard');
                if (clonedCard) {
                    clonedCard.style.width = '1200px';
                    clonedCard.style.height = '1680px';
                    clonedCard.style.transform = 'scale(1)';
                    clonedCard.style.margin = '0 auto';
                }
            }
        }).then(canvas => {
            // Restaurar estilo original
            card.style.width = originalWidth;
            card.style.height = originalHeight;
            card.style.transform = originalTransform;
            card.style.margin = originalMargin;
            card.style.position = '';
            card.style.left = '';
            
            // Criar link de download
            const link = document.createElement('a');
            const safeName = currentGuestName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `Convite_Gala_Juvenil_${safeName}.png`;
            
            link.download = fileName;
            link.href = canvas.toDataURL('image/png', 1.0);
            
            // Disparar download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Restaurar botão
            elements.downloadBtn.innerHTML = originalText;
            elements.downloadBtn.disabled = false;
            
            // Mostrar confirmação
            showNotification('Convite baixado com sucesso!', 'success');
            
        }).catch(error => {
            console.error('Erro ao baixar convite:', error);
            
            // Restaurar estilo original em caso de erro
            card.style.width = originalWidth;
            card.style.height = originalHeight;
            card.style.transform = originalTransform;
            card.style.margin = originalMargin;
            card.style.position = '';
            card.style.left = '';
            
            // Restaurar botão
            elements.downloadBtn.innerHTML = originalText;
            elements.downloadBtn.disabled = false;
            
            showNotification('Erro ao baixar convite. Tente novamente.', 'error');
        });
    }, 500);
}

// Compartilhar via WhatsApp
function shareViaWhatsApp() {
    if (!currentGuestName) {
        alert('Por favor, gere um convite primeiro.');
        return;
    }
    
    // Criar mensagem personalizada
    const eventDate = '26 de Dezembro de 2025';
    const eventTime = '22:00 às 04:00';
    const eventLocation = 'Congregação Tsakane, Machava-Sede';
    
    const message = `🎟️ *CONVITE PARA A GALA JUVENIL 2025*
    
*${currentGuestName}*

Você está convidado(a) para a Gala Juvenil da Igreja Reformada de Moçambique.

📅 *Data:* ${eventDate}
⏰ *Horário:* ${eventTime}
📍 *Local:* ${eventLocation}

"Como é bom e agradável quando os irmãos convivem em união!" - Salmos 133:1

Para mais informações: 84 401 2254 | 85 232 8379

*Comissão Organizadora da Gala Juvenil 2025*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Configurar botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Adicionar estilos para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    max-width: 400px;
    transform: translateX(150%);
    transition: transform 0.3s ease;
    z-index: 10000;
    border-left: 4px solid #4CAF50;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left-color: #4CAF50;
}

.notification-error {
    border-left-color: #F44336;
}

.notification-info {
    border-left-color: #2196F3;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.notification-content i {
    font-size: 1.2rem;
}

.notification-success .notification-content i {
    color: #4CAF50;
}

.notification-error .notification-content i {
    color: #F44336;
}

.notification-info .notification-content i {
    color: #2196F3;
}

.notification-close {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.3s;
}

.notification-close:hover {
    background: rgba(0,0,0,0.1);
}
`;

document.head.appendChild(notificationStyles);

// Suporte offline
window.addEventListener('online', function() {
    showNotification('Conexão restabelecida', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Você está offline. Algumas funcionalidades podem estar limitadas.', 'info');
});

// Instalação do PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar prompt de instalação após 10 segundos
    setTimeout(() => {
        showInstallPrompt();
    }, 10000);
});

function showInstallPrompt() {
    // Verificar se já foi mostrado hoje
    const lastPrompt = localStorage.getItem('installPromptDate');
    const today = new Date().toDateString();
    
    if (lastPrompt === today) return;
    
    const installPrompt = document.createElement('div');
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = `
        <div class="install-content">
            <i class="fas fa-download"></i>
            <div class="install-text">
                <strong>Instalar App</strong>
                <span>Acesso rápido à Gala Juvenil</span>
            </div>
        </div>
        <div class="install-actions">
            <button id="installNowBtn" class="btn-install">Instalar</button>
            <button id="closeInstallBtn" class="btn-close">×</button>
        </div>
    `;
    
    // Adicionar estilos
    const promptStyles = document.createElement('style');
    promptStyles.textContent = `
    .install-prompt {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--navy-blue), #283593);
        color: white;
        border-radius: 12px;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideUp 0.3s ease;
        border: 1px solid var(--primary-gold);
    }
    
    @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .install-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .install-content i {
        font-size: 1.5rem;
        color: var(--primary-gold);
    }
    
    .install-text {
        display: flex;
        flex-direction: column;
    }
    
    .install-text strong {
        font-weight: 600;
    }
    
    .install-text span {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .install-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-install {
        background: var(--primary-gold);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .btn-install:hover {
        background: var(--dark-gold);
    }
    
    .btn-close {
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
    }
    
    .btn-close:hover {
        background: rgba(255,255,255,0.2);
    }
    `;
    
    document.head.appendChild(promptStyles);
    document.body.appendChild(installPrompt);
    
    // Configurar botões
    document.getElementById('installNowBtn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showNotification('App instalado com sucesso!', 'success');
            }
            deferredPrompt = null;
        }
        installPrompt.remove();
        localStorage.setItem('installPromptDate', today);
    });
    
    document.getElementById('closeInstallBtn').addEventListener('click', () => {
        installPrompt.remove();
        localStorage.setItem('installPromptDate', today);
    });
}

// Suporte a teclado
document.addEventListener('keydown', function(e) {
    // Esc fecha modais
    if (e.key === 'Escape') {
        if (elements.passwordModal.classList.contains('active')) {
            hidePasswordModal();
        }
    }
    
    // Ctrl+S salva/baixa convite
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentGuestName) {
            downloadInvite();
        }
    }
});