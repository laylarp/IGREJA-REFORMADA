// APP PRINCIPAL - CONVITE GALA JUVENIL
const ConviteApp = {
  // Configurações
  PASSWORD: 'irm3022irm',
  STORAGE_KEYS: {
    NAME: 'gala_nome_salvo',
    IMAGE: 'gala_imagem_salva'
  },
  
  // Estado
  currentScreen: 'home',
  lastImageUrl: null,
  
  // Elementos do DOM
  elements: {},
  
  // Inicialização
  init() {
    console.log('🚀 Iniciando Convite App - Formato A5');
    this.cacheElements();
    this.bindEvents();
    this.checkUrlParams();
    this.loadSavedData();
    this.showScreen('home');
    
    // Animação de entrada suave
    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
  },
  
  // Cache de elementos
  cacheElements() {
    // Telas
    this.elements.screens = {
      home: document.getElementById('homeCard'),
      password: document.getElementById('passwordScreen'),
      name: document.getElementById('nameScreen'),
      invite: document.getElementById('inviteScreen')
    };
    
    // Botões principais
    this.elements.buttons = {
      create: document.getElementById('btnCreate'),
      view: document.getElementById('btnView'),
      access: document.getElementById('btnAccess'),
      cancel: document.getElementById('btnCancel'),
      generate: document.getElementById('btnGenerate'),
      download: document.getElementById('btnDownload'),
      whatsapp: document.getElementById('btnWhats'),
      edit: document.getElementById('btnEditName')
    };
    
    // Botões voltar
    this.elements.backButtons = {
      password: document.getElementById('backFromPassword'),
      name: document.getElementById('backFromName'),
      invite: document.getElementById('backFromInvite')
    };
    
    // Inputs
    this.elements.inputs = {
      password: document.getElementById('passwordInput'),
      name: document.getElementById('nameInput')
    };
    
    // Nome no convite
    this.elements.inviteName = document.getElementById('inviteName');
  },
  
  // Vincular eventos
  bindEvents() {
    // Navegação principal
    this.elements.buttons.create.addEventListener('click', () => this.showScreen('password'));
    this.elements.buttons.view.addEventListener('click', () => this.showSavedInvite());
    this.elements.buttons.cancel.addEventListener('click', () => this.showScreen('home'));
    
    // Acesso com senha
    this.elements.buttons.access.addEventListener('click', () => this.checkPassword());
    this.elements.inputs.password.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.checkPassword();
    });
    
    // Gerar convite
    this.elements.buttons.generate.addEventListener('click', () => this.generateInvite());
    this.elements.inputs.name.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.generateInvite();
    });
    
    // Botões voltar
    this.elements.backButtons.password.addEventListener('click', () => this.showScreen('home'));
    this.elements.backButtons.name.addEventListener('click', () => this.showScreen('password'));
    this.elements.backButtons.invite.addEventListener('click', () => this.showScreen('home'));
    
    // Ações do convite
    this.elements.buttons.download.addEventListener('click', () => this.downloadInvite());
    this.elements.buttons.whatsapp.addEventListener('click', () => this.shareWhatsApp());
    this.elements.buttons.edit.addEventListener('click', () => this.showScreen('name'));
    
    // Focar inputs automaticamente
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('input-field')) {
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
  },
  
  // Carregar dados salvos
  loadSavedData() {
    // Carregar nome salvo
    const savedName = localStorage.getItem(this.STORAGE_KEYS.NAME);
    if (savedName) {
      this.elements.inputs.name.value = savedName;
      this.elements.inviteName.textContent = savedName;
    }
    
    // Carregar imagem salva
    this.lastImageUrl = localStorage.getItem(this.STORAGE_KEYS.IMAGE);
  },
  
  // Mostrar tela específica
  showScreen(screenName) {
    console.log('📱 Mudando para tela:', screenName);
    
    // Esconder todas as telas
    Object.values(this.elements.screens).forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Mostrar tela solicitada
    this.elements.screens[screenName].classList.add('active');
    this.currentScreen = screenName;
    
    // Scroll para o topo
    window.scrollTo(0, 0);
    
    // Ações específicas por tela
    switch(screenName) {
      case 'password':
        this.elements.inputs.password.value = '';
        setTimeout(() => {
          this.elements.inputs.password.focus();
          this.elements.inputs.password.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
        break;
        
      case 'name':
        setTimeout(() => {
          this.elements.inputs.name.focus();
          this.elements.inputs.name.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 350);
        break;
        
      case 'invite':
        // Atualizar nome no convite
        const currentName = this.elements.inputs.name.value.trim() || 
                           localStorage.getItem(this.STORAGE_KEYS.NAME) || 
                           'Convidado';
        this.elements.inviteName.textContent = this.formatName(currentName);
        
        // Gerar imagem automaticamente se não existir
        if (!this.lastImageUrl) {
          setTimeout(() => this.generateImage(), 500);
        }
        break;
    }
  },
  
  // Verificar senha
  checkPassword() {
    const password = this.elements.inputs.password.value.trim();
    
    if (password === this.PASSWORD) {
      this.showScreen('name');
      this.showNotification('✅ Senha correta!', 'success');
    } else {
      this.showNotification('❌ Senha incorreta! Tente novamente.', 'error');
      this.elements.inputs.password.value = '';
      this.elements.inputs.password.focus();
      this.elements.inputs.password.classList.add('pulse');
      setTimeout(() => {
        this.elements.inputs.password.classList.remove('pulse');
      }, 500);
    }
  },
  
  // Gerar convite
  generateInvite() {
    const rawName = this.elements.inputs.name.value.trim();
    
    if (!rawName) {
      this.showNotification('📝 Por favor, digite seu nome completo.', 'error');
      this.elements.inputs.name.focus();
      return;
    }
    
    // Formatar nome
    const formattedName = this.formatName(rawName);
    
    // Salvar nome
    localStorage.setItem(this.STORAGE_KEYS.NAME, formattedName);
    this.elements.inviteName.textContent = formattedName;
    
    // Feedback visual
    this.elements.buttons.generate.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GERANDO...';
    this.elements.buttons.generate.disabled = true;
    
    // Gerar imagem
    setTimeout(() => {
      this.generateImage();
      this.showScreen('invite');
      
      // Restaurar botão
      setTimeout(() => {
        this.elements.buttons.generate.innerHTML = '<i class="fas fa-magic"></i> GERAR CONVITE';
        this.elements.buttons.generate.disabled = false;
      }, 1500);
    }, 300);
  },
  
  // Formatar nome
  formatName(name) {
    return name
      .split(' ')
      .map(word => {
        if (word.length > 2) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
      })
      .join(' ');
  },
  
  // Gerar imagem do convite em formato A5
  generateImage() {
    console.log('🖼️ Gerando imagem no formato A5...');
    
    const inviteElement = document.getElementById('invitePreview');
    const originalStyles = {
      width: inviteElement.style.width,
      height: inviteElement.style.height,
      position: inviteElement.style.position,
      overflow: inviteElement.style.overflow
    };
    
    // Configurar para captura
    inviteElement.style.width = '1240px';
    inviteElement.style.height = '1754px'; // A5 em pixels (1240x1754)
    inviteElement.style.position = 'absolute';
    inviteElement.style.left = '-9999px';
    inviteElement.style.overflow = 'visible';
    
    document.body.appendChild(inviteElement);
    
    // Configurações otimizadas para A5
    const options = {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fffef9',
      logging: false,
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 20000,
      width: 1240,
      height: 1754,
      windowWidth: 1240,
      windowHeight: 1754,
      removeContainer: true,
      onclone: function(clonedDoc) {
        const clonedPreview = clonedDoc.getElementById('invitePreview');
        if (clonedPreview) {
          clonedPreview.style.width = '1240px';
          clonedPreview.style.height = '1754px';
          clonedPreview.style.position = 'relative';
          clonedPreview.style.left = '0';
          clonedPreview.style.overflow = 'visible';
        }
      }
    };
    
    html2canvas(inviteElement, options)
      .then(canvas => {
        console.log('✅ Canvas A5 gerado:', canvas.width, 'x', canvas.height);
        
        // Restaurar estilos originais
        Object.assign(inviteElement.style, originalStyles);
        document.body.appendChild(inviteElement);
        
        // Criar canvas final com margens
        const margin = 50;
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width + (margin * 2);
        finalCanvas.height = canvas.height + (margin * 2);
        
        const ctx = finalCanvas.getContext('2d');
        
        // Fundo branco
        ctx.fillStyle = '#fffef9';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        // Desenhar convite centralizado
        ctx.drawImage(canvas, margin, margin);
        
        // Salvar URL
        this.lastImageUrl = finalCanvas.toDataURL('image/png', 1.0);
        localStorage.setItem(this.STORAGE_KEYS.IMAGE, this.lastImageUrl);
        
        console.log('💾 Imagem A5 salva com sucesso!');
        console.log('📐 Dimensões finais:', finalCanvas.width, 'x', finalCanvas.height);
        
        this.showNotification('✨ Convite gerado no formato A5!', 'success');
      })
      .catch(error => {
        console.error('❌ Erro ao gerar imagem A5:', error);
        
        // Restaurar estilos mesmo em erro
        Object.assign(inviteElement.style, originalStyles);
        document.body.appendChild(inviteElement);
        
        this.showNotification('⚠️ Erro ao gerar imagem. Tente novamente.', 'error');
        
        // Fallback: método simplificado
        this.generateSimpleImage();
      });
  },
  
  // Método simplificado de fallback
  generateSimpleImage() {
    const inviteElement = document.getElementById('invitePreview');
    
    const options = {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fffef9',
      logging: false
    };
    
    html2canvas(inviteElement, options)
      .then(canvas => {
        this.lastImageUrl = canvas.toDataURL('image/png');
        localStorage.setItem(this.STORAGE_KEYS.IMAGE, this.lastImageUrl);
        this.showNotification('✅ Convite gerado!', 'success');
      })
      .catch(error => {
        console.error('Erro no fallback:', error);
        this.showNotification('❌ Não foi possível gerar a imagem.', 'error');
      });
  },
  
  // Baixar convite
  downloadInvite() {
    if (!this.lastImageUrl) {
      this.lastImageUrl = localStorage.getItem(this.STORAGE_KEYS.IMAGE);
    }
    
    if (!this.lastImageUrl) {
      this.showNotification('📱 Gere o convite primeiro clicando em "GERAR CONVITE"!', 'error');
      return;
    }
    
    // Criar link de download
    const link = document.createElement('a');
    link.href = this.lastImageUrl;
    const fileName = `Convite-Gala-Juvenil-${this.formatName(localStorage.getItem(this.STORAGE_KEYS.NAME) || 'Convidado').replace(/\s+/g, '-')}-${new Date().toISOString().slice(0,10)}.png`;
    link.download = fileName;
    
    // Adicionar e clicar
    document.body.appendChild(link);
    link.click();
    
    // Remover após uso
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);
    
    // Feedback visual
    const originalText = this.elements.buttons.download.innerHTML;
    const originalBg = this.elements.buttons.download.style.background;
    
    this.elements.buttons.download.innerHTML = '<i class="fas fa-check"></i> BAIXADO!';
    this.elements.buttons.download.style.background = 'linear-gradient(135deg, #2e7d32, #1b5e20)';
    this.elements.buttons.download.disabled = true;
    
    this.showNotification('📥 Convite baixado com sucesso!', 'success');
    
    setTimeout(() => {
      this.elements.buttons.download.innerHTML = originalText;
      this.elements.buttons.download.style.background = originalBg;
      this.elements.buttons.download.disabled = false;
    }, 2000);
  },
  
  // Compartilhar via WhatsApp
  shareWhatsApp() {
    const name = localStorage.getItem(this.STORAGE_KEYS.NAME) || 'Convidado';
    const shareUrl = window.location.href.split('?')[0];
    
    const message = `✨ *GLÓRIA A DEUS!* ✨

*${this.formatName(name)}* CONVIDA VOCÊ PARA:

🎉 *GALA JUVENIL 2025*
⛪ *Igreja Reformada*

📅 *Data:* 26 de Dezembro de 2025
⏰ *Horário:* 22:00 às 04:00
📍 *Local:* Congregação Tsakane - Machava-Sede

*Lema:* "Como é bom e agradável quando os irmãos convivem em união."
*(Salmos 133:1)*

📱 *Baixe seu convite personalizado aqui:*
${shareUrl}

🔐 *Senha de acesso:* ${this.PASSWORD}

*Contactos da Comissão:*
📞 85 232 8379
📞 84 401 2254

*Que Deus abençoe nossa comunhão!* 🙏

#GalaJuvenil2025 #IgrejaReformada`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    this.showNotification('📤 Abrindo WhatsApp...', 'success');
  },
  
  // Mostrar convite salvo
  showSavedInvite() {
    const savedName = localStorage.getItem(this.STORAGE_KEYS.NAME);
    const savedImage = localStorage.getItem(this.STORAGE_KEYS.IMAGE);
    
    if (!savedName || !savedImage) {
      this.showNotification('📋 Nenhum convite encontrado. Crie um convite primeiro!', 'error');
      return;
    }
    
    this.elements.inviteName.textContent = savedName;
    this.lastImageUrl = savedImage;
    this.showScreen('invite');
    
    this.showNotification('📖 Carregando convite salvo...', 'success');
  },
  
  // Mostrar notificação
  showNotification(message, type = 'success') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  },
  
  // Verificar parâmetros da URL
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'last') {
      this.showSavedInvite();
    }
  }
};

// Iniciar app quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  // Iniciar com opacidade 0 para animação
  document.body.style.opacity = '0';
  
  // Iniciar app
  setTimeout(() => {
    ConviteApp.init();
  }, 100);
  
  // Prevenir zoom em inputs no iOS
  document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      e.preventDefault();
    }
  }, { passive: false });
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('✅ ServiceWorker registrado:', registration.scope);
      })
      .catch(error => {
        console.log('❌ ServiceWorker falhou:', error);
      });
  });
}

// Detectar iOS para ajustes específicos
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
  document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
}