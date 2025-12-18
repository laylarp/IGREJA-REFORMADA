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

const welcomeScreen = document.getElementById('welcomeScreen');
const creationScreen = document.getElementById('creationScreen');
const invitationContainer = document.getElementById('invitationContainer');
const actionButtons = document.getElementById('actionButtons');
const viewInviteBtn = document.getElementById('viewInviteBtn');
const createInviteBtn = document.getElementById('createInviteBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');
const generateInviteBtn = document.getElementById('generateInviteBtn');
const guestNameInput = document.getElementById('guestName');
const displayName = document.getElementById('displayName');
const downloadInviteBtn = document.getElementById('downloadInviteBtn');
const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
const sendSMSBtn = document.getElementById('sendSMSBtn');
const editInviteBtn = document.getElementById('editInviteBtn');
const backToHomeFromInviteBtn = document.getElementById('backToHomeFromInviteBtn');
const passwordModal = document.getElementById('passwordModal');
const closePasswordModal = document.getElementById('closePasswordModal');
const accessPasswordInput = document.getElementById('accessPassword');
const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
const passwordError = document.getElementById('passwordError');

let currentGuestName = "";

function loadChurchLogo() {
    const logoUrl = 'logo.png';
    const churchLogo = document.getElementById('churchLogo');
    const invitationLogo = document.getElementById('invitationLogo');
    
    const img = new Image();
    img.onload = function() {
        churchLogo.innerHTML = '';
        const logoImg1 = document.createElement('img');
        logoImg1.src = logoUrl;
        logoImg1.alt = 'Logo Igreja Reformada';
        churchLogo.appendChild(logoImg1);
        
        invitationLogo.innerHTML = '';
        const logoImg2 = document.createElement('img');
        logoImg2.src = logoUrl;
        logoImg2.alt = 'Logo Igreja Reformada';
        invitationLogo.appendChild(logoImg2);
    };
    
    img.onerror = function() {
        console.log('Logo não encontrada. Usando placeholder.');
    };
    
    img.src = logoUrl;
}

createInviteBtn.addEventListener('click', function() {
    passwordModal.style.display = 'flex';
    accessPasswordInput.value = '';
    passwordError.style.display = 'none';
});

closePasswordModal.addEventListener('click', function() {
    passwordModal.style.display = 'none';
});

verifyPasswordBtn.addEventListener('click', function() {
    const password = accessPasswordInput.value.trim();
    
    if (typeof adminPassword !== 'undefined' && password === adminPassword) {
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
    invitationContainer.style.display = 'none';
    actionButtons.style.display = 'none';
    viewInviteBtn.style.display = currentGuestName ? 'block' : 'none';
});

viewInviteBtn.addEventListener('click', function() {
    welcomeScreen.style.display = 'none';
    creationScreen.style.display = 'none';
    invitationContainer.style.display = 'block';
    actionButtons.style.display = 'grid';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

generateInviteBtn.addEventListener('click', function() {
    const name = guestNameInput.value.trim();
    
    if (!name || name.length < 3) {
        document.getElementById('nameError').style.display = 'block';
        guestNameInput.focus();
        return;
    }
    
    document.getElementById('nameError').style.display = 'none';
    currentGuestName = formatName(name);
    displayName.textContent = currentGuestName;
    
    localStorage.setItem('galaInviteName', currentGuestName);
    
    creationScreen.style.display = 'none';
    invitationContainer.style.display = 'block';
    actionButtons.style.display = 'grid';
    viewInviteBtn.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

editInviteBtn.addEventListener('click', function() {
    invitationContainer.style.display = 'none';
    actionButtons.style.display = 'none';
    creationScreen.style.display = 'block';
    guestNameInput.value = currentGuestName;
    guestNameInput.focus();
});

downloadInviteBtn.addEventListener('click', function() {
    const invitationCard = document.getElementById('invitationCard');
    
    const originalText = downloadInviteBtn.innerHTML;
    downloadInviteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    downloadInviteBtn.disabled = true;
    
    html2canvas(invitationCard, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        removeContainer: true
    }).then(canvas => {
        const link = document.createElement('a');
        const fileName = `Convite_Gala_Juvenil_${currentGuestName.replace(/\s+/g, '_')}.png`;
        link.download = fileName;
        link.href = canvas.toDataURL('image/png', 1.0);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        downloadInviteBtn.innerHTML = '<i class="fas fa-check"></i> Convite Baixado!';
        downloadInviteBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
        
        setTimeout(() => {
            downloadInviteBtn.innerHTML = originalText;
            downloadInviteBtn.style.background = '';
            downloadInviteBtn.disabled = false;
        }, 2000);
        
    }).catch(error => {
        console.error('Erro ao baixar convite:', error);
        downloadInviteBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro!';
        downloadInviteBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        
        setTimeout(() => {
            downloadInviteBtn.innerHTML = originalText;
            downloadInviteBtn.style.background = '';
            downloadInviteBtn.disabled = false;
            alert('Ocorreu um erro ao baixar o convite. Tente novamente.');
        }, 2000);
    });
});

sendWhatsAppBtn.addEventListener('click', function() {
    const inviteUrl = `${window.location.href.split('?')[0]}?convite=${encodeURIComponent(currentGuestName)}`;
    const message = `Glória a Deus! Paz e graça!\n\n${currentGuestName}, baixe o seu convite para a Gala Cristã Juvenil através do link:\n\n${inviteUrl}\n\n*Data:* 26 de Dezembro de 2025\n*Horário:* 22h00 às 04h00\n*Local:* Congregação Tsakane, Machava-Sede\n\nContato: 84 401 2254\n\nTe esperamos para um momento abençoado de comunhão e louvor! 🙏`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
});

sendSMSBtn.addEventListener('click', function() {
    const inviteUrl = `${window.location.href.split('?')[0]}?convite=${encodeURIComponent(currentGuestName)}`;
    const message = `Glória a Deus! Paz e graça! ${currentGuestName}, baixe seu convite para a Gala Cristã Juvenil: ${inviteUrl} - Data: 26/12/2025, 22h-04h. Local: Congregação Tsakane, Machava-Sede. Contato: 84 401 2254`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`sms:?body=${encodedMessage}`, '_blank');
});

backToHomeFromInviteBtn.addEventListener('click', function() {
    invitationContainer.style.display = 'none';
    actionButtons.style.display = 'none';
    welcomeScreen.style.display = 'block';
});

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteName = urlParams.get('convite');
    
    if (inviteName) {
        const decodedName = decodeURIComponent(inviteName);
        currentGuestName = formatName(decodedName);
        
        welcomeScreen.style.display = 'none';
        creationScreen.style.display = 'none';
        invitationContainer.style.display = 'block';
        actionButtons.style.display = 'grid';
        displayName.textContent = currentGuestName;
        
        localStorage.setItem('galaInviteName', currentGuestName);
    }
}

function checkSavedInvite() {
    const savedName = localStorage.getItem('galaInviteName');
    if (savedName) {
        currentGuestName = savedName;
        viewInviteBtn.style.display = 'block';
    }
}

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

passwordModal.addEventListener('click', function(e) {
    if (e.target === passwordModal) {
        passwordModal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadChurchLogo();
    checkSavedInvite();
    checkUrlParams();
    if (currentGuestName) {
        viewInviteBtn.style.display = 'block';
    }
});