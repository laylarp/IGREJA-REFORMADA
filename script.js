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
    const img = new Image();
    img.onload = function() {
        // Logo encontrada - atualizar todas as logos
        churchLogo.innerHTML = '';
        const imgElement = document.createElement('img');
        imgElement.src = logoUrl;
        imgElement.alt = 'Logo Igreja Reformada';
        imgElement.style.width = '100%';
        imgElement.style.height = '100%';
        imgElement.style.objectFit = 'contain';
        churchLogo.appendChild(imgElement);
        
        // Copiar para os convites
        invitationLogos.forEach(logo => {
            logo.innerHTML = '';
            const imgClone = imgElement.cloneNode(true);
            logo.appendChild(imgClone);
        });
    };
    
    img.onerror = function() {
        console.log('Usando placeholder para logo');
    };
    
    img.src = logoUrl;
}

// Função para baixar convite
function downloadInvite() {
    if (!currentGuestName) {
        alert('Por favor, crie um convite primeiro.');
        return;
    }
    
    // Criar HTML para exportação com tamanhos adequados
    const exportHTML = `
        <div style="width: 800px; height: 1400px; background: white; padding: 30px; box-sizing: border-box; font-family: 'Montserrat', sans-serif; position: relative; color: #5D4037;">
            <!-- Cabeçalho -->
            <div style="background: linear-gradient(135deg, #8B4513, #5D4037); padding: 25px 20px 15px; text-align: center; border-radius: 15px 15px 0 0; color: white;">
                <div style="width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; border: 3px solid #FFD700; overflow: hidden;">
                    <div style="font-size: 20px; font-weight: 900; color: #8B4513; text-align: center;">IRM</div>
                </div>
                <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; margin-bottom: 8px; color: #FFD700;">GALA JUVENIL</h1>
                <div style="font-size: 20px; background: rgba(255,255,255,0.2); padding: 6px 20px; border-radius: 15px; display: inline-block; border: 2px solid rgba(255,215,0,0.4);">2025</div>
            </div>
            
            <!-- Corpo -->
            <div style="padding: 25px 30px; background: #FFFEF5; min-height: 1000px;">
                <p style="text-align: center; font-size: 18px; color: #795548; margin-bottom: 15px;">A Comissão Organizadora tem a honra de convidar</p>
                
                <!-- Nome do Convidado -->
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-family: 'Dancing Script', cursive; font-size: 40px; color: #5D4037; font-weight: 700; padding: 20px; background: rgba(255,255,255,0.95); border-radius: 15px; border: 3px solid #FFD700; box-shadow: 0 5px 15px rgba(0,0,0,0.1); display: inline-block; max-width: 90%;">
                        ${currentGuestName}
                    </div>
                </div>
                
                <!-- Versículo -->
                <div style="background: linear-gradient(135deg, #FFF9C4, #FFECB3); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #FFD700;">
                    <p style="font-family: 'Playfair Display', serif; font-size: 20px; color: #5D4037; text-align: center; font-style: italic; line-height: 1.4; margin-bottom: 12px;">
                        "Como é bom e agradável quando os irmãos convivem em união!"
                    </p>
                    <p style="text-align: center; color: #8B4513; font-size: 16px; font-weight: 700;">Salmos 133:1</p>
                </div>
                
                <p style="text-align: center; font-size: 16px; color: #795548; margin: 20px 0; line-height: 1.5;">
                    para participar da <strong>Gala Juvenil 2025</strong>, um momento especial de união e comunhão na presença de Deus.
                </p>
                
                <!-- Detalhes do Evento -->
                <div style="display: flex; justify-content: center; gap: 15px; margin: 25px 0; flex-wrap: nowrap;">
                    <div style="text-align: center; flex: 1; min-width: 180px;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #FFD700, #FFEC8B); border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h3 style="color: #8B4513; font-size: 16px; margin-bottom: 6px; font-weight: 700;">Data</h3>
                        <p style="color: #795548; font-size: 14px; font-weight: 600;">26/12/2025</p>
                        <p style="color: #795548; font-size: 12px;">Sexta-feira</p>
                    </div>
                    
                    <div style="text-align: center; flex: 1; min-width: 180px;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #FFD700, #FFEC8B); border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3 style="color: #8B4513; font-size: 16px; margin-bottom: 6px; font-weight: 700;">Horário</h3>
                        <p style="color: #795548; font-size: 14px; font-weight: 600;">22:00 - 04:00</p>
                        <p style="color: #795548; font-size: 12px;">Noite de adoração</p>
                    </div>
                    
                    <div style="text-align: center; flex: 1; min-width: 180px;">
                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #FFD700, #FFEC8B); border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <h3 style="color: #8B4513; font-size: 16px; margin-bottom: 6px; font-weight: 700;">Local</h3>
                        <p style="color: #795548; font-size: 14px; font-weight: 600;">Congregação Tsakane</p>
                        <p style="color: #795548; font-size: 12px;">Machava-Sede</p>
                    </div>
                </div>
                
                <!-- Contatos -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid rgba(139, 69, 19, 0.2);">
                    <h4 style="color: #8B4513; font-size: 18px; margin-bottom: 15px; font-weight: 700;">Para mais informações:</h4>
                    <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 15px;">
                        <div style="background: rgba(255,215,0,0.1); padding: 10px 15px; border-radius: 8px; font-size: 16px; color: #8B4513; font-weight: 700;">
                            <i class="fas fa-phone-alt"></i> 84 401 2254
                        </div>
                        <div style="background: rgba(255,215,0,0.1); padding: 10px 15px; border-radius: 8px; font-size: 16px; color: #8B4513; font-weight: 700;">
                            <i class="fas fa-phone-alt"></i> 85 232 8379
                        </div>
                    </div>
                    <p style="color: #795548; font-size: 13px; font-style: italic;">Para confirmações e esclarecimentos</p>
                </div>
            </div>
            
            <!-- Rodapé -->
            <div style="background: #FFF8DC; padding: 20px; text-align: center; border-top: 3px solid #FFD700;">
                <div style="font-weight: 700; font-size: 18px; color: #8B4513; margin-bottom: 8px;">Igreja Reformada de Moçambique</div>
                <div style="font-size: 16px; color: #795548; margin-bottom: 12px;">Gala Juvenil 2025</div>
                <div style="width: 150px; height: 2px; background: linear-gradient(90deg, transparent, #8B4513, transparent); margin: 0 auto 12px;"></div>
                <p style="color: #795548; font-size: 14px; font-style: italic; font-weight: 600;">Comissão Organizadora da Gala Juvenil</p>
            </div>
        </div>
    `;
    
    // Criar elemento temporário para exportação
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.innerHTML = exportHTML;
    document.body.appendChild(tempDiv);
    
    // Adicionar Font Awesome para os ícones
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
    
    // Aguardar carregamento dos ícones
    setTimeout(() => {
        html2canvas(tempDiv.firstElementChild, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#FFFFFF',
            width: 800,
            height: 1400,
            windowWidth: 800,
            windowHeight: 1400,
            scrollX: 0,
            scrollY: 0,
            onclone: function(clonedDoc) {
                // Garantir que os ícones sejam renderizados
                const icons = clonedDoc.querySelectorAll('.fas, .fab');
                icons.forEach(icon => {
                    icon.style.fontFamily = "'Font Awesome 6 Free', 'Font Awesome 6 Brands'";
                    icon.style.fontWeight = '900';
                });
            }
        }).then(canvas => {
            // Criar link de download
            const link = document.createElement('a');
            const safeName = currentGuestName.replace(/\s+/g, '_');
            const fileName = `Convite_Gala_Juvenil_${safeName}.png`;
            link.download = fileName;
            link.href = canvas.toDataURL('image/png', 1.0);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpar elementos temporários
            document.body.removeChild(tempDiv);
            document.head.removeChild(fontAwesome);
            
        }).catch(error => {
            console.error('Erro ao baixar:', error);
            alert('Erro ao baixar o convite. Tente novamente.');
            
            // Limpar elementos temporários mesmo em caso de erro
            document.body.removeChild(tempDiv);
            document.head.removeChild(fontAwesome);
        });
    }, 500);
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

downloadInviteBtn.addEventListener('click', downloadInvite);
downloadOnlyBtn.addEventListener('click', downloadInvite);

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