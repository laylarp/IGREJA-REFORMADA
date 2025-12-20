// Dados do aplicativo
const SENHA_VALIDA = "gala2025";
let nomeConvidado = "";

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurações da aplicação
    setupApp();
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
        
        alert("Convite baixado com sucesso!");
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