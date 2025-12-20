// Dados do aplicativo
const SENHA_VALIDA = "gala2025";
let nomeConvidado = "";

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configura botão modo desktop
    const desktopToggleBtn = document.getElementById('btnDesktopToggle');
    
    // Verifica se está em tela pequena e ativa automaticamente
    if (window.innerWidth < 768) {
        const hasDesktopMode = localStorage.getItem('desktopMode') === 'true';
        if (!hasDesktopMode) {
            // Mostra mensagem simples para mobile
            setTimeout(() => {
                if (confirm("Para melhor visualização em celular, recomenda-se ativar o Modo Desktop. Ativar agora?")) {
                    toggleDesktopMode();
                }
            }, 1000);
        } else {
            document.body.classList.add('desktop-mode');
            updateButtonText();
        }
    }
    
    // Evento do botão
    desktopToggleBtn.addEventListener('click', toggleDesktopMode);
    
    // Configurações da aplicação
    setupApp();
});

// Função para alternar modo desktop
function toggleDesktopMode() {
    const body = document.body;
    const isDesktopMode = body.classList.contains('desktop-mode');
    
    if (isDesktopMode) {
        body.classList.remove('desktop-mode');
        localStorage.setItem('desktopMode', 'false');
        showToast("Modo Mobile ativado");
    } else {
        body.classList.add('desktop-mode');
        localStorage.setItem('desktopMode', 'true');
        showToast("Modo Desktop ativado");
    }
    
    updateButtonText();
}

// Atualiza texto do botão
function updateButtonText() {
    const btn = document.getElementById('btnDesktopToggle');
    const btnText = btn.querySelector('.btn-text');
    const isDesktopMode = document.body.classList.contains('desktop-mode');
    
    if (isDesktopMode) {
        btnText.textContent = "Modo Mobile";
        btn.innerHTML = '<i class="fas fa-mobile-alt"></i><span class="btn-text">Modo Mobile</span>';
    } else {
        btnText.textContent = "Modo Desktop";
        btn.innerHTML = '<i class="fas fa-desktop"></i><span class="btn-text">Modo Desktop</span>';
    }
}

// Mostra notificação simples
function showToast(message) {
    // Remove toast anterior se existir
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Cria novo toast
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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
    if (nomeSalvo) {
        document.getElementById('nomeConvidado').value = nomeSalvo;
    }
}

// Navegação entre telas
function navegar(telaDestino) {
    document.querySelectorAll('.screen').forEach(tela => {
        tela.classList.remove('active');
    });
    document.getElementById(telaDestino).classList.add('active');
}

// Validação de senha
function validarSenha() {
    const senhaDigitada = document.getElementById('inputSenha').value;
    
    if (senhaDigitada === SENHA_VALIDA) {
        navegar('tela3');
        document.getElementById('inputSenha').value = "";
    } else {
        alert("Senha incorreta. Por favor, tente novamente.");
        document.getElementById('inputSenha').value = "";
        document.getElementById('inputSenha').focus();
    }
}

// Geração do convite
function gerarConvite() {
    nomeConvidado = document.getElementById('nomeConvidado').value.trim();
    
    if (!nomeConvidado) {
        alert("Por favor, digite seu nome para gerar o convite.");
        return;
    }
    
    document.getElementById('displayNome').textContent = nomeConvidado;
    navegar('tela4');
    localStorage.setItem('conviteGalaNome', nomeConvidado);
}

// Ver convite existente
function verConviteExistente() {
    const nomeSalvo = localStorage.getItem('conviteGalaNome');
    
    if (nomeSalvo) {
        nomeConvidado = nomeSalvo;
        document.getElementById('displayNome').textContent = nomeSalvo;
        navegar('tela4');
    } else {
        alert("Nenhum convite encontrado. Crie um novo convite primeiro.");
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
    
    html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        onclone: function(clonedDoc) {
            const clonedElement = clonedDoc.getElementById('areaConvite');
            clonedElement.style.width = elemento.offsetWidth + 'px';
            clonedElement.style.height = elemento.offsetHeight + 'px';
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
        
        showToast("Convite baixado com sucesso!");
    }).catch(error => {
        console.error("Erro ao gerar imagem:", error);
        alert("Erro ao baixar a imagem. Por favor, tente novamente.");
        
        btnDownload.innerHTML = originalHTML;
        btnDownload.disabled = false;
        elemento.style.userSelect = 'none';
        elemento.style.webkitUserSelect = 'none';
    });
}

// Compartilhar no WhatsApp
function compartilharWhatsApp() {
    const textoConvite = `*Convite para a Gala Juvenil 2025*\n\nOlá! ${nomeConvidado} está convidando você para a Gala Juvenil da Igreja Reformada.\n\n*Data:* 26 de Dezembro de 2025\n*Hora:* 22:00 às 04:00\n*Local:* Congregação Tsakane, Machava-Sede\n\n"Como é bom e agradável quando os irmãos convivem em união." (Salmos 133:1)\n\nContamos com sua presença!`;
    
    const textoCodificado = encodeURIComponent(textoConvite);
    const urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
}

// CSS para animações do toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Instalação PWA (mantido)
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