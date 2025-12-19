// Elementos principais
const welcomeScreen = document.getElementById('welcomeScreen');
const creationScreen = document.getElementById('creationScreen');
const invitationContainer = document.getElementById('invitationContainer');
const downloadOnlyScreen = document.getElementById('downloadOnlyScreen');
const viewInviteBtn = document.getElementById('viewInviteBtn');
const createInviteBtn = document.getElementById('createInviteBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const generateInviteBtn = document.getElementById('generateInviteBtn');
const guestNameInput = document.getElementById('guestName');
const displayName = document.getElementById('displayName');
const downloadDisplayName = document.getElementById('downloadDisplayName');
const downloadInviteBtn = document.getElementById('downloadInviteBtn');
const downloadOnlyBtn = document.getElementById('downloadOnlyBtn');
const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
const backToHomeFromInviteBtn = document.getElementById('backToHomeFromInviteBtn');
const passwordModal = document.getElementById('passwordModal');
const closePasswordModal = document.getElementById('closePasswordModal');
const accessPasswordInput = document.getElementById('accessPassword');
const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
const passwordError = document.getElementById('passwordError');
const nameError = document.getElementById('nameError');
const exportContainer = document.getElementById('exportContainer');
const exportInvitationCard = document.getElementById('exportInvitationCard');

// Configurações
const adminPassword = "irm3022irm";
let currentGuestName = "";

// Formatar nome (primeira letra maiúscula)
function formatName(name) {
    return name.toLowerCase()
        .split(' ')
        .map(word => {
            const connectors = ['da', 'de', 'do', 'dos', 'das', 'e'];
            if (connectors.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

// Carregar logo da igreja
function loadChurchLogo() {
    const logoUrl = 'logo.png';
    const churchLogo = document.getElementById('churchLogo');
    const invitationLogos = document.querySelectorAll('.invitation-logo');
    
    // Tenta carregar a logo
    fetch(logoUrl)
        .then(response => {
            if (response.ok) {
                // Logo encontrada
                churchLogo.innerHTML = '';
                const img = document.createElement('img');
                img.src = logoUrl;
                img.alt = 'Logo Igreja Reformada';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                churchLogo.appendChild(img);
                
                // Copiar para os convites
                invitationLogos.forEach(logo => {
                    logo.innerHTML = '';
                    const imgClone = img.cloneNode(true);
                    logo.appendChild(imgClone);
                });
            }
        })
        .catch(error => {
            console.log('Usando placeholder para logo');
        });
}

// Preparar container de exportação
function prepareExportContainer() {
    if (!currentGuestName) return;
    
    // Criar versão otimizada para exportação
    const exportHTML = `
        <div style="width: 1000px; height: 1800px; background: white; padding: 60px; box-sizing: border-box; font-family: 'Montserrat', sans-serif;">
            <!-- Cabeçalho -->
            <div style="background: linear-gradient(135deg, #8B4513, #5D4037); padding: 50px 40px 30px; text-align: center; border-radius: 30px 30px 0 0; color: white;">
                <div style="width: 150px; height: 150px; background: white; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; border: 5px solid #FFD700;">
                    <div style="font-size: 48px; font-weight: 900; color: #8B4513;">IRM</div>
                </div>
                <h1 style="font-family: 'Playfair Display', serif; font-size: 72px; margin-bottom: 15px; color: #FFD700; text-shadow: 3px 3px 6px rgba(0,0,0,0.4);">GALA JUVENIL</h1>
                <div style="font-size: 40px; background: rgba(255,255,255,0.2); padding: 12px 40px; border-radius: 30px; display: inline-block; border: 3px solid rgba(255,215,0,0.4);">2025</div>
            </div>
            
            <!-- Corpo -->
            <div style="padding: 50px 60px; background: #FFFEF5; min-height: 1200px;">
                <p style="text-align: center; font-size: 36px; color: #795548; margin-bottom: 30px;">A Comissão Organizadora tem a honra de convidar</p>
                
                <!-- Nome do Convidado -->
                <div style="text-align: center; margin: 40px 0;">
                    <div style="font-family: 'Dancing Script', cursive; font-size: 96px; color: #5D4037; font-weight: 700; padding: 40px; background: rgba(255,255,255,0.95); border-radius: 30px; border: 5px solid #FFD700; box-shadow: 0 10px 40px rgba(0,0,0,0.1); display: inline-block;">
                        ${currentGuestName}
                    </div>
                </div>
                
                <!-- Versículo -->
                <div style="background: linear-gradient(135deg, #FFF9C4, #FFECB3); padding: 40px; border-radius: 25px; margin: 40px 0; border-left: 8px solid #FFD700; box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
                    <p style="font-family: 'Playfair Display', serif; font-size: 48px; color: #5D4037; text-align: center; font-style: italic; line-height: 1.4; margin-bottom: 20px;">
                        "Como é bom e agradável quando os irmãos convivem em união!"
                    </p>
                    <p style="text-align: center; color: #8B4513; font-size: 32px; font-weight: 700;">Salmos 133:1</p>
                </div>
                
                <!-- Detalhes do Evento -->
                <div style="display: flex; justify-content: center; gap: 40px; margin: 50px 0;">
                    <div style="text-align: center; flex: 1;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FFD700, #FFEC8B); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px;">📅</div>
                        <h3 style="color: #8B4513; font-size: 28px; margin-bottom: 10px;">Data</h3>
                        <p style="color: #795548; font-size: 26px;"><strong>26/12/2025</strong></p>
                        <p style="color: #795548; font-size: 22px;">Sexta-feira</p>
                    </div>
                    
                    <div style="text-align: center; flex: 1;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FFD700, #FFEC8B); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px;">⏰</div>
                        <h3 style="color: #8B4513; font-size: 28px; margin-bottom: 10px;">Horário</h3>
                        <p style="color: #795548; font-size: 26px;"><strong>22:00 - 04:00</strong></p>
                        <p style="color: #795548; font-size: 22px;">Noite de adoração</p>
                    </div>
                    
                    <div style="text-align: center; flex: 1;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FFD700, #FFEC8B); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px;">📍</div>
                        <h3 style="color: #8B4513; font-size: 28px; margin-bottom: 10px;">Local</h3>
                        <p style="color: #795548; font-size: 26px;"><strong>Congregação Tsakane</strong></p>
                        <p style="color: #795548; font-size: 22px;">Machava-Sede</p>
                    </div>
                </div>
                
                <!-- Contatos -->
                <div style="text-align: center; margin-top: 60px;">
                    <h4 style="color: #8B4513; font-size: 32px; margin-bottom: 25px;">Informações:</h4>
                    <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 30px;">
                        <div style="background: rgba(255,215,0,0.1); padding: 20px 30px; border-radius: 20px; font-size: 32px; color: #8B4513; font-weight: 700;">84 401 2254</div>
                        <div style="background: rgba(255,215,0,0.1); padding: 20px 30px; border-radius: 20px; font-size: 32px; color: #8B4513; font-weight: 700;">85 232 8379</div>
                    </div>
                    <p style="color: #795548; font-size: 24px; font-style: italic;">Para confirmações e esclarecimentos</p>
                </div>
            </div>
            
            <!-- Rodapé -->
            <div style="background: #FFF8DC; padding: 40px; text-align: center; border-top: 5px solid #FFD700;">
                <div style="font-weight: 700; font-size: 36px; color: #8B4513; margin-bottom: 15px;">Igreja Reformada de Moçambique</div>
                <div style="font-size: 30px; color: #795548; margin-bottom: 25px;">Gala Juvenil 2025</div>
                <div style="width: 300px; height: 3px; background: linear-gradient(90deg, transparent, #8B4513, transparent); margin: 0 auto 25px;"></div>
                <p style="color: #795548; font-size: 28px; font-style: italic; font-weight: 600;">Comissão Organizadora</p>
            </div>
        </div>
    `;
    
    exportInvitationCard.innerHTML = exportHTML;
    exportContainer.style.display = 'block';
}

// Event Listeners
createInviteBtn.addEventListener('click', function() {
    passwordModal.style.display = 'flex';
    accessPasswordInput.value = '';
    passwordError.style.display = 'none';
    accessPasswordInput.focus();
});

closePasswordModal.addEventListener('click', function() {
    passwordModal.style.display = 'none';
});

verifyPasswordBtn.addEventListener('click', function() {
    const password = accessPasswordInput.value.trim();
    
    if (password === adminPassword) {
        passwordModal.style.display = 'none';
        welcomeScreen.style.display = 'none';
        creationScreen.style.display = 'block';
        guestNameInput.value = currentGuestName || '';
        guestNameInput.focus();
    } else {
        passwordError.style.display = 'block';
        accessPasswordInput.focus();
    }
});

backToHomeBtn.addEventListener('click', function() {
    creationScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
});

viewInviteBtn.addEventListener('click', function() {
    if (!currentGuestName) {
        const savedName = localStorage.getItem('galaInviteName');
        if (savedName) {
            currentGuestName = savedName;
            displayName.textContent = currentGuestName;
        }
    }
    
    if (currentGuestName) {
        welcomeScreen.style.display = 'none';
        creationScreen.style.display = 'none';
        downloadOnlyScreen.style.display = 'none';
        invitationContainer.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

generateInviteBtn.addEventListener('click', function() {
    const name = guestNameInput.value.trim();
    
    if (!name || name.length < 3) {
        nameError.style.display = 'block';
        guestNameInput.focus();
        return;
    }
    
    nameError.style.display = 'none';
    currentGuestName = formatName(name);
    displayName.textContent = currentGuestName;
    
    // Salvar no localStorage
    localStorage.setItem('galaInviteName', currentGuestName);
    viewInviteBtn.style.display = 'block';
    
    // Mostrar convite
    creationScreen.style.display = 'none';
    invitationContainer.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

downloadInviteBtn.addEventListener('click', function() {
    if (!currentGuestName) {
        alert('Por favor, crie um convite primeiro.');
        return;
    }
    
    prepareExportContainer();
    
    // Aguardar um momento para renderização
    setTimeout(() => {
        html2canvas(exportInvitationCard.firstElementChild, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#FFFFFF',
            width: 1000,
            height: 1800,
            windowWidth: 1000,
            windowHeight: 1800,
            scrollX: 0,
            scrollY: 0
        }).then(canvas => {
            const link = document.createElement('a');
            const safeName = currentGuestName.replace(/\s+/g, '_');
            const fileName = `Convite_Gala_${safeName}.png`;
            link.download = fileName;
            link.href = canvas.toDataURL('image/png', 1.0);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Ocultar container de exportação
            exportContainer.style.display = 'none';
        }).catch(error => {
            console.error('Erro ao baixar:', error);
            alert('Erro ao baixar o convite. Tente novamente.');
            exportContainer.style.display = 'none';
        });
    }, 500);
});

downloadOnlyBtn.addEventListener('click', function() {
    downloadInviteBtn.click();
});

sendWhatsAppBtn.addEventListener('click', function() {
    if (!currentGuestName) {
        alert('Por favor, crie um convite primeiro.');
        return;
    }
    
    const message = `📱 *Convite para a Gala Juvenil 2025*\n\nOlá! ${currentGuestName}, você está convidado(a) para a Gala Juvenil da Igreja Reformada.\n\n*Data:* 26 de Dezembro de 2025\n*Horário:* 22:00 às 04:00\n*Local:* Congregação Tsakane, Machava-Sede\n\n"Como é bom e agradável quando os irmãos convivem em união!" (Salmos 133:1)\n\n_Comissão Organizadora da Gala Juvenil_`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
});

backToHomeFromInviteBtn.addEventListener('click', function() {
    invitationContainer.style.display = 'none';
    downloadOnlyScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Verificar parâmetros da URL (para links compartilhados)
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteName = urlParams.get('convite');
    
    if (inviteName) {
        const decodedName = decodeURIComponent(inviteName);
        currentGuestName = formatName(decodedName);
        downloadDisplayName.textContent = currentGuestName;
        
        welcomeScreen.style.display = 'none';
        creationScreen.style.display = 'none';
        invitationContainer.style.display = 'none';
        downloadOnlyScreen.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Verificar convite salvo
function checkSavedInvite() {
    const savedName = localStorage.getItem('galaInviteName');
    if (savedName) {
        currentGuestName = savedName;
        viewInviteBtn.style.display = 'block';
    }
}

// Eventos de teclado
guestNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateInviteBtn.click();
    }
});

accessPasswordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verifyPasswordBtn.click();
    }
});

// Fechar modal clicando fora
passwordModal.addEventListener('click', function(e) {
    if (e.target === passwordModal) {
        passwordModal.style.display = 'none';
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadChurchLogo();
    checkSavedInvite();
    checkUrlParams();
    
    // Prevenir zoom em dispositivos móveis
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
    
    // Prevenir comportamento padrão do touch
    document.addEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });
});

// Suporte para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}