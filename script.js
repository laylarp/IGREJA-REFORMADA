const welcomeScreen = document.getElementById('welcomeScreen');
const creationScreen = document.getElementById('creationScreen');
const invitationContainer = document.getElementById('invitationContainer');
const downloadOnlyScreen = document.getElementById('downloadOnlyScreen');
const actionButtons = document.getElementById('actionButtons');
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
const sendSMSBtn = document.getElementById('sendSMSBtn');
const backToHomeFromInviteBtn = document.getElementById('backToHomeFromInviteBtn');
const passwordModal = document.getElementById('passwordModal');
const closePasswordModal = document.getElementById('closePasswordModal');
const accessPasswordInput = document.getElementById('accessPassword');
const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
const passwordError = document.getElementById('passwordError');

const adminPassword = "irm3022irm";
let currentGuestName = "";

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

/* Load logo into initial and invitation areas.
   Selects .invitation-logo-fixed and #invitationLogo to ensure all targets are populated. */
function loadChurchLogo() {
    const logoUrl = 'logo.png';
    const churchLogo = document.getElementById('churchLogo');
    const invitationLogos = document.querySelectorAll('#invitationLogo, .invitation-logo-fixed');

    const img = new Image();
    // try set crossOrigin for html2canvas compatibility (server must allow CORS for remote images)
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        // populate churchLogo
        churchLogo.innerHTML = '';
        const logoImg1 = document.createElement('img');
        logoImg1.src = logoUrl;
        logoImg1.alt = 'Logo Igreja Reformada';
        // also set crossOrigin on created images
        logoImg1.crossOrigin = 'anonymous';
        churchLogo.appendChild(logoImg1);

        // populate invitation logo targets
        invitationLogos.forEach(invitationLogo => {
            if (!invitationLogo) return;
            invitationLogo.innerHTML = '';
            const logoImg2 = document.createElement('img');
            logoImg2.src = logoUrl;
            logoImg2.alt = 'Logo Igreja Reformada';
            logoImg2.crossOrigin = 'anonymous';
            invitationLogo.appendChild(logoImg2);
        });
    };

    img.onerror = function() {
        // keep placeholders if logo not found; optional: console.warn
        console.warn('Não foi possível carregar logo.png. Verifique o caminho.');
    };

    img.src = logoUrl;
}

/* Ensure logo is present/copied right before showing the invitation screens.
   This is a safe copy that uses existing #churchLogo img if available or clones innerHTML. */
function copyLogoToInvitation() {
    const source = document.getElementById('churchLogo');
    if (!source) return;
    const targets = document.querySelectorAll('#invitationLogo, .invitation-logo-fixed');
    targets.forEach(t => {
        if (!t) return;
        t.innerHTML = '';
        const srcImg = source.querySelector('img');
        if (srcImg && srcImg.src) {
            const clone = document.createElement('img');
            clone.src = srcImg.src;
            clone.alt = srcImg.alt || 'Logo Igreja Reformada';
            try { clone.crossOrigin = 'anonymous'; } catch (e) {}
            t.appendChild(clone);
        } else {
            // fallback: copy innerHTML (placeholder text)
            t.innerHTML = source.innerHTML;
        }
    });
}

function forceDesktopView() {
    document.body.classList.add('force-desktop');
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
    invitationContainer.style.display = 'none';
    downloadOnlyScreen.style.display = 'none';
    actionButtons.style.display = 'none';
});

viewInviteBtn.addEventListener('click', function() {
    if (!currentGuestName) {
        const savedName = localStorage.getItem('galaInviteName');
        if (savedName) {
            currentGuestName = savedName;
            displayName.textContent = currentGuestName;
        }
    }

    // ensure logo is present in invitation area
    copyLogoToInvitation();

    welcomeScreen.style.display = 'none';
    creationScreen.style.display = 'none';
    downloadOnlyScreen.style.display = 'none';
    invitationContainer.style.display = 'block';
    // use flex to match CSS expectations (previously grid caused empilhamento)
    actionButtons.style.display = 'flex';
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

    // ensure logo is present in invitation area
    copyLogoToInvitation();

    creationScreen.style.display = 'none';
    downloadOnlyScreen.style.display = 'none';
    invitationContainer.style.display = 'block';
    // use flex instead of grid to keep buttons side-by-side
    actionButtons.style.display = 'flex';
    viewInviteBtn.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function downloadInvite(cardId, fileNamePrefix) {
    const invitationCard = document.getElementById(cardId);

    const originalWidth = invitationCard.style.width;
    const originalMargin = invitationCard.style.margin;
    const originalDisplay = invitationCard.style.display;

    invitationCard.style.width = '800px';
    invitationCard.style.margin = '0 auto';
    invitationCard.style.display = 'block';

    // ensure logos are inline in the cloned DOM for html2canvas
    copyLogoToInvitation();

    window.scrollTo(0, 0);

    setTimeout(() => {
        html2canvas(invitationCard, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true,
            windowWidth: 800,
            windowHeight: document.documentElement.scrollHeight,
            width: 800,
            height: invitationCard.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            onclone: function(clonedDoc) {
                const clonedCard = clonedDoc.getElementById(cardId);
                if (clonedCard) {
                    clonedCard.style.width = '800px';
                    clonedCard.style.margin = '0 auto';
                    clonedCard.style.display = 'block';
                }
                // Make sure cloned images have crossOrigin if possible
                const imgs = clonedDoc.querySelectorAll('#' + cardId + ' img');
                imgs.forEach(i => {
                    try { i.crossOrigin = 'anonymous'; } catch (e) {}
                });
            }
        }).then(canvas => {
            invitationCard.style.width = originalWidth;
            invitationCard.style.margin = originalMargin;
            invitationCard.style.display = originalDisplay;

            const link = document.createElement('a');
            const safeName = currentGuestName ? currentGuestName.replace(/\s+/g, '_') : 'convidado';
            const fileName = `${fileNamePrefix}_${safeName}.png`;
            link.download = fileName;
            link.href = canvas.toDataURL('image/png', 1.0);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        }).catch(error => {
            console.error('Erro ao baixar convite:', error);
            alert('Ocorreu um erro ao baixar o convite. Tente novamente.');

            invitationCard.style.width = originalWidth;
            invitationCard.style.margin = originalMargin;
            invitationCard.style.display = originalDisplay;
        });
    }, 500);
}

downloadInviteBtn.addEventListener('click', function() {
    downloadInvite('invitationCard', 'Convite_Gala_Juvenil');
});

downloadOnlyBtn.addEventListener('click', function() {
    downloadInvite('downloadInvitationCard', 'Convite_Gala_Juvenil');
});

sendWhatsAppBtn.addEventListener('click', function() {
    const inviteUrl = `${window.location.href.split('?')[0]}?convite=${encodeURIComponent(currentGuestName)}`;
    const message = `Glória a Deus! Paz e graça!\n\n${currentGuestName}, baixe o seu convite para a Gala Cristã Juvenil através do link:\n\n${inviteUrl}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
});

sendSMSBtn.addEventListener('click', function() {
    const inviteUrl = `${window.location.href.split('?')[0]}?convite=${encodeURIComponent(currentGuestName)}`;
    const message = `Glória a Deus! Paz e graça! ${currentGuestName}, baixe seu convite para a Gala Cristã Juvenil: ${inviteUrl}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`sms:?body=${encodedMessage}`, '_blank');
});

backToHomeFromInviteBtn.addEventListener('click', function() {
    invitationContainer.style.display = 'none';
    downloadOnlyScreen.style.display = 'none';
    actionButtons.style.display = 'none';
    welcomeScreen.style.display = 'block';
});

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteName = urlParams.get('convite');

    if (inviteName) {
        const decodedName = decodeURIComponent(inviteName);
        currentGuestName = formatName(decodedName);
        downloadDisplayName.textContent = currentGuestName;

        // ensure logos are copied for the download-only view
        loadChurchLogo();
        copyLogoToInvitation();

        welcomeScreen.style.display = 'none';
        creationScreen.style.display = 'none';
        invitationContainer.style.display = 'none';
        actionButtons.style.display = 'none';
        downloadOnlyScreen.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    forceDesktopView();

    if (currentGuestName) {
        viewInviteBtn.style.display = 'block';
    }
});

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    setTimeout(() => {
        showInstallPrompt();
    }, 5000);
});

function showInstallPrompt() {
    const installPrompt = document.createElement('div');
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = `
        <span>📱 Instale este aplicativo para acesso rápido!</span>
        <button id="installBtn">Instalar</button>
        <button id="closeInstallBtn">X</button>
    `;

    document.body.appendChild(installPrompt);
    installPrompt.style.display = 'flex';

    document.getElementById('installBtn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                installPrompt.remove();
            }
            deferredPrompt = null;
        }
    });

    document.getElementById('closeInstallBtn').addEventListener('click', () => {
        installPrompt.remove();
    });
}