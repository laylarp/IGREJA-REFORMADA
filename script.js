const ConviteApp = {
  PASSWORD: 'irm3022irm',
  STORAGE_KEYS: {
    NAME: 'gala_nome_salvo',
    IMAGE: 'gala_imagem_salva'
  },
  
  currentScreen: 'home',
  lastImageUrl: null,
  
  elements: {},
  
  init() {
    this.cacheElements();
    this.bindEvents();
    this.checkUrlParams();
    this.loadSavedData();
    this.showScreen('home');
    
    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
  },
  
  cacheElements() {
    this.elements.screens = {
      home: document.getElementById('homeCard'),
      password: document.getElementById('passwordScreen'),
      name: document.getElementById('nameScreen'),
      invite: document.getElementById('inviteScreen')
    };
    
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
    
    this.elements.backButtons = {
      password: document.getElementById('backFromPassword'),
      name: document.getElementById('backFromName'),
      invite: document.getElementById('backFromInvite')
    };
    
    this.elements.inputs = {
      password: document.getElementById('passwordInput'),
      name: document.getElementById('nameInput')
    };
    
    this.elements.inviteName = document.getElementById('inviteName');
  },
  
  bindEvents() {
    this.elements.buttons.create.addEventListener('click', () => this.showScreen('password'));
    this.elements.buttons.view.addEventListener('click', () => this.showSavedInvite());
    this.elements.buttons.cancel.addEventListener('click', () => this.showScreen('home'));
    
    this.elements.buttons.access.addEventListener('click', () => this.checkPassword());
    this.elements.inputs.password.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.checkPassword();
    });
    
    this.elements.buttons.generate.addEventListener('click', () => this.generateInvite());
    this.elements.inputs.name.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.generateInvite();
    });
    
    this.elements.backButtons.password.addEventListener('click', () => this.showScreen('home'));
    this.elements.backButtons.name.addEventListener('click', () => this.showScreen('password'));
    this.elements.backButtons.invite.addEventListener('click', () => this.showScreen('home'));
    
    this.elements.buttons.download.addEventListener('click', () => this.downloadInvite());
    this.elements.buttons.whatsapp.addEventListener('click', () => this.shareWhatsApp());
    this.elements.buttons.edit.addEventListener('click', () => this.showScreen('name'));
  },
  
  loadSavedData() {
    const savedName = localStorage.getItem(this.STORAGE_KEYS.NAME);
    if (savedName) {
      this.elements.inputs.name.value = savedName;
      this.elements.inviteName.textContent = savedName;
    }
    
    this.lastImageUrl = localStorage.getItem(this.STORAGE_KEYS.IMAGE);
  },
  
  showScreen(screenName) {
    Object.values(this.elements.screens).forEach(screen => {
      screen.classList.remove('active');
    });
    
    this.elements.screens[screenName].classList.add('active');
    this.currentScreen = screenName;
    
    window.scrollTo(0, 0);
    
    switch(screenName) {
      case 'password':
        this.elements.inputs.password.value = '';
        setTimeout(() => {
          this.elements.inputs.password.focus();
        }, 350);
        break;
        
      case 'name':
        setTimeout(() => {
          this.elements.inputs.name.focus();
        }, 350);
        break;
        
      case 'invite':
        const currentName = this.elements.inputs.name.value.trim() || 
                           localStorage.getItem(this.STORAGE_KEYS.NAME) || 
                           'Convidado';
        this.elements.inviteName.textContent = this.formatName(currentName);
        
        if (!this.lastImageUrl) {
          setTimeout(() => this.generateImage(), 500);
        }
        break;
    }
  },
  
  checkPassword() {
    const password = this.elements.inputs.password.value.trim();
    
    if (password === this.PASSWORD) {
      this.showScreen('name');
    } else {
      alert('Senha incorreta! Tente novamente.');
      this.elements.inputs.password.value = '';
      this.elements.inputs.password.focus();
    }
  },
  
  generateInvite() {
    const rawName = this.elements.inputs.name.value.trim();
    
    if (!rawName) {
      alert('Por favor, digite seu nome completo.');
      this.elements.inputs.name.focus();
      return;
    }
    
    const formattedName = this.formatName(rawName);
    
    localStorage.setItem(this.STORAGE_KEYS.NAME, formattedName);
    this.elements.inviteName.textContent = formattedName;
    
    this.elements.buttons.generate.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GERANDO...';
    this.elements.buttons.generate.disabled = true;
    
    setTimeout(() => {
      this.generateImage();
      this.showScreen('invite');
      
      setTimeout(() => {
        this.elements.buttons.generate.innerHTML = '<i class="fas fa-magic"></i> GERAR CONVITE';
        this.elements.buttons.generate.disabled = false;
      }, 1500);
    }, 300);
  },
  
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
  
  generateImage() {
    const inviteElement = document.getElementById('invitePreview');
    const originalStyles = {
      width: inviteElement.style.width,
      height: inviteElement.style.height,
      position: inviteElement.style.position,
      overflow: inviteElement.style.overflow
    };
    
    inviteElement.style.width = '600px';
    inviteElement.style.height = 'auto';
    inviteElement.style.position = 'absolute';
    inviteElement.style.left = '-9999px';
    inviteElement.style.overflow = 'visible';
    
    document.body.appendChild(inviteElement);
    
    const options = {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 20000,
      width: 600,
      height: inviteElement.scrollHeight,
      windowWidth: 600,
      windowHeight: inviteElement.scrollHeight,
      removeContainer: true,
      onclone: function(clonedDoc) {
        const clonedPreview = clonedDoc.getElementById('invitePreview');
        if (clonedPreview) {
          clonedPreview.style.width = '600px';
          clonedPreview.style.height = 'auto';
          clonedPreview.style.position = 'relative';
          clonedPreview.style.left = '0';
          clonedPreview.style.overflow = 'visible';
        }
      }
    };
    
    html2canvas(inviteElement, options)
      .then(canvas => {
        Object.assign(inviteElement.style, originalStyles);
        document.body.appendChild(inviteElement);
        
        const margin = 50;
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width + (margin * 2);
        finalCanvas.height = canvas.height + (margin * 2);
        
        const ctx = finalCanvas.getContext('2d');
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        ctx.drawImage(canvas, margin, margin);
        
        this.lastImageUrl = finalCanvas.toDataURL('image/png', 1.0);
        localStorage.setItem(this.STORAGE_KEYS.IMAGE, this.lastImageUrl);
      })
      .catch(error => {
        Object.assign(inviteElement.style, originalStyles);
        document.body.appendChild(inviteElement);
        
        const simpleOptions = {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        };
        
        html2canvas(inviteElement, simpleOptions)
          .then(canvas => {
            this.lastImageUrl = canvas.toDataURL('image/png');
            localStorage.setItem(this.STORAGE_KEYS.IMAGE, this.lastImageUrl);
          });
      });
  },
  
  downloadInvite() {
    if (!this.lastImageUrl) {
      this.lastImageUrl = localStorage.getItem(this.STORAGE_KEYS.IMAGE);
    }
    
    if (!this.lastImageUrl) {
      alert('Gere o convite primeiro clicando em "GERAR CONVITE"!');
      return;
    }
    
    const link = document.createElement('a');
    link.href = this.lastImageUrl;
    const fileName = `Convite-Gala-Juvenil-${this.formatName(localStorage.getItem(this.STORAGE_KEYS.NAME) || 'Convidado').replace(/\s+/g, '-')}.png`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
    }, 1000);
    
    const originalText = this.elements.buttons.download.innerHTML;
    const originalBg = this.elements.buttons.download.style.background;
    
    this.elements.buttons.download.innerHTML = '<i class="fas fa-check"></i> BAIXADO!';
    this.elements.buttons.download.style.background = '#2e7d32';
    this.elements.buttons.download.disabled = true;
    
    setTimeout(() => {
      this.elements.buttons.download.innerHTML = originalText;
      this.elements.buttons.download.style.background = originalBg;
      this.elements.buttons.download.disabled = false;
    }, 2000);
  },
  
  shareWhatsApp() {
    const name = localStorage.getItem(this.STORAGE_KEYS.NAME) || 'Convidado';
    const shareUrl = window.location.href.split('?')[0];
    
    const message = `Gloria a Deus. Voce recebeu o convite para participar, baixe seu convite: ${shareUrl}  senha: ${this.PASSWORD}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  },
  
  showSavedInvite() {
    const savedName = localStorage.getItem(this.STORAGE_KEYS.NAME);
    const savedImage = localStorage.getItem(this.STORAGE_KEYS.IMAGE);
    
    if (!savedName || !savedImage) {
      alert('Nenhum convite encontrado. Crie um convite primeiro!');
      return;
    }
    
    this.elements.inviteName.textContent = savedName;
    this.lastImageUrl = savedImage;
    this.showScreen('invite');
  },
  
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'last') {
      this.showSavedInvite();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    ConviteApp.init();
  }, 100);
});