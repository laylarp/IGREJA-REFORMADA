// Dados do aplicativo
const SENHA_VALIDA = "gala2025"; // Senha de acesso
let nomeConvidado = "";
let mobileWarningShown = false;

// Detecção de dispositivo móvel
function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Verifica se é um dispositivo móvel
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
    
    // Verifica se a largura da tela é pequena (adicional)
    const isSmallScreen = window.innerWidth <= 768;
    
    // Verifica se está em modo desktop forçado
    const isDesktopMode = window.matchMedia('(min-width: 1024px)').matches && 
                         !/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return (isMobile || isSmallScreen) && !isDesktopMode;
}

// Verifica se já está em modo desenvolvedor/desktop
function isDesktopModeEnabled() {
    // Verifica por características de modo desktop
    const isLargeViewport = window.innerWidth >= 1024 && window.innerHeight >= 768;
    const hasMouseEvent = 'onmousemove' in window && window.onmousemove !== undefined;
    const hasTouchSupport = 'ontouchstart' in window;
    
    // Se tem viewport grande, suporte a mouse e não tem touch (ou tem mas é convertido)
    return isLargeViewport && hasMouseEvent;
}

// Mostrar tela de aviso para mobile
function showMobileWarning() {
    if (!mobileWarningShown && isMobileDevice() && !isDesktopModeEnabled()) {
        document.getElementById('telaMobile').classList.add('active');
        mobileWarningShown = true;
        localStorage.setItem('mobileWarningShown', 'true');
        return true;
    }
    return false;
}

// Esconder tela de aviso
function hideMobileWarning() {
    document.getElementById('telaMobile').classList.remove('active');
}

// Verificação inicial
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se já mostrou o aviso nesta sessão
    const warningShown = localStorage.getItem('mobileWarningShown');
    mobileWarningShown = warningShown === 'true';
    
    // Mostra aviso se necessário
    const shouldShowWarning = showMobileWarning();
    
    // Se não mostrar aviso, inicia a aplicação normalmente
    if (!shouldShowWarning) {
        navegar('tela1');
    }
    
    // Configura botões da tela mobile
    document.getElementById('btnIgnorarMobile').addEventListener('click', function() {
        hideMobileWarning();
        navegar('tela1');
        // Marca como ignorado
        localStorage.setItem('mobileIgnored', 'true');
        
        // Mostra aviso de possível problema
        setTimeout(() => {
            alert("Atenção: Algumas funções podem não funcionar corretamente sem o modo desenvolvedor ativado. Para melhor experiência, recomenda-se ativar o 'Modo Desktop' no navegador.");
        }, 500);
    });
    
    document.getElementById('btnAtivarDesktop').addEventListener('click', function() {
        hideMobileWarning();
        
        // Mostra instruções específicas
        const instructions = `
ATIVAÇÃO DO MODO DESENVOLVEDOR:

1. No Chrome: Toque nos 3 pontos → "Site para computador"
2. No Safari: Toque em Compartilhar → "Pedir site para computador" 
3. No Firefox: Toque nos 3 pontos → "Site para computador"

Após ativar, recarregue a página para aplicar as alterações.
        `;
        
        alert(instructions);
        
        // Oferece recarregar a página
        if (confirm("Deseja recarregar a página agora para aplicar as configurações?")) {
            localStorage.setItem('mobileWarningShown', 'false');
            location.reload();
        } else {
            navegar('tela1');
        }
    });
    
    document.getElementById('btnTestarNovamente').addEventListener('click', function() {
        localStorage.setItem('mobileWarningShown', 'false');
        location.reload();
    });
    
    // Configurações da aplicação principal
    setupApp();
});

// Configuração da aplicação principal
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
    
    // Verificação periódica de modo mobile
    setInterval(() => {
        if (isMobileDevice() && !isDesktopModeEnabled()) {
            // Se detectar mobile sem modo desktop, mostra ícone de aviso
            showMobileIndicator();
        } else {
            hideMobileIndicator();
        }
    }, 5000);
}

// Navegação entre telas
function navegar(telaDestino) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(tela => {
        tela.classList.remove('active');
    });
    
    // Mostra a tela de destino
    document.getElementById(telaDestino).classList.add('active');
}

// Validação de senha
function validarSenha() {
    const senhaDigitada = document.getElementById('inputSenha').value;
    
    if (senhaDigitada === SENHA_VALIDA) {
        navegar('tela3');
        document.getElementById('inputSenha').value = ""; // Limpa o campo
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
    
    // Atualiza o nome no convite
    document.getElementById('displayNome').textContent = nomeConvidado;
    
    // Navega para a tela do convite
    navegar('tela4');
    
    // Salva no localStorage
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
    // Verifica se está em mobile sem modo desktop
    if (isMobileDevice() && !isDesktopModeEnabled()) {
        const shouldContinue = confirm("Atenção: O download de imagens pode não funcionar corretamente em modo mobile. Recomenda-se ativar o 'Modo Desktop' no navegador.\n\nDeseja continuar mesmo assim?");
        if (!shouldContinue) {
            return;
        }
    }
    
    const elemento = document.getElementById('areaConvite');
    
    // Temporariamente permite seleção para captura
    elemento.style.userSelect = 'auto';
    elemento.style.webkitUserSelect = 'auto';
    
    // Mostra mensagem de processamento
    const btnDownload = document.querySelector('.btn-download');
    const originalHTML = btnDownload.innerHTML;
    btnDownload.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btnDownload.disabled = true;
    
    // Configuração do html2canvas
    html2canvas(elemento, {
        scale: 2, // Maior qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        onclone: function(clonedDoc) {
            // Garante que os estilos sejam aplicados no clone
            const clonedElement = clonedDoc.getElementById('areaConvite');
            clonedElement.style.width = elemento.offsetWidth + 'px';
            clonedElement.style.height = elemento.offsetHeight + 'px';
        }
    }).then(canvas => {
        // Restaura as propriedades de seleção
        elemento.style.userSelect = 'none';
        elemento.style.webkitUserSelect = 'none';
        
        // Cria link para download
        const link = document.createElement('a');
        link.download = `Convite-Gala-Juvenil-${nomeConvidado.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        
        // Simula clique no link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Restaura o botão
        btnDownload.innerHTML = originalHTML;
        btnDownload.disabled = false;
        
        // Feedback ao usuário
        alert("Convite baixado com sucesso!");
    }).catch(error => {
        console.error("Erro ao gerar imagem:", error);
        
        // Se erro em mobile, sugere ativar modo desktop
        if (isMobileDevice() && !isDesktopModeEnabled()) {
            alert("Erro ao baixar imagem. Isso pode ser devido ao modo mobile. Tente ativar o 'Modo Desktop' no navegador e tente novamente.");
        } else {
            alert("Erro ao baixar a imagem. Por favor, tente novamente.");
        }
        
        // Restaura o botão em caso de erro
        btnDownload.innerHTML = originalHTML;
        btnDownload.disabled = false;
        elemento.style.userSelect = 'none';
        elemento.style.webkitUserSelect = 'none';
    });
}

// Compartilhar no WhatsApp
function compartilharWhatsApp() {
    const textoConvite = `*Convite para a Gala Juvenil 2025*\n\nOlá! ${nomeConvidado} está convidando você para a Gala Juvenil da Igreja Reformada.\n\n*Data:* 26 de Dezembro de 2025\n*Hora:* 22:00 às 04:00\n*Local:* Congregação Tsakane, Machava-Sede\n\n"Como é bom e agradável quando os irmãos convivem em união." (Salmos 133:1)\n\nContamos com sua presença!`;
    
    // Codifica o texto para URL
    const textoCodificado = encodeURIComponent(textoConvite);
    
    // Cria a URL do WhatsApp
    const urlWhatsApp = `https://wa.me/?text=${textoCodificado}`;
    
    // Abre em nova janela
    window.open(urlWhatsApp, '_blank');
}

// Função para reabrir verificação mobile
function verificarMobileNovamente() {
    localStorage.setItem('mobileWarningShown', 'false');
    localStorage.setItem('mobileIgnored', 'false');
    showMobileWarning();
}

// Mostrar indicador de modo mobile
function showMobileIndicator() {
    let indicator = document.getElementById('mobileIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'mobileIndicator';
        indicator.innerHTML = '<i class="fas fa-mobile-alt"></i>';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: var(--warning);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        `;
        indicator.onclick = verificarMobileNovamente;
        document.body.appendChild(indicator);
    }
    indicator.style.display = 'flex';
}

function hideMobileIndicator() {
    const indicator = document.getElementById('mobileIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Instalação PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}

// Detecta mudanças na orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        if (isMobileDevice() && !isDesktopModeEnabled()) {
            showMobileWarning();
        }
    }, 500);
});

// Detecta redimensionamento da janela
window.addEventListener('resize', function() {
    // Debounce para evitar muitas execuções
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        if (isMobileDevice() && !isDesktopModeEnabled()) {
            showMobileIndicator();
        } else {
            hideMobileIndicator();
        }
    }, 250);
});