// APP SIMPLES E FUNCIONAL
const App = {
  PASSWORD: 'irm3022irm',
  
  init() {
    this.cacheElements();
    this.bindEvents();
    this.checkUrlParams();
  },
  
  cacheElements() {
    // Telas
    this.screens = {
      home: document.getElementById('homeCard'),
      password: document.getElementById('passwordScreen'),
      name: document.getElementById('nameScreen'),
      invite: document.getElementById('inviteScreen')
    };
    
    // Botões
    this.buttons = {
      create: document.getElementById('btnCreate'),
      view: document.getElementById('btnView'),
      access: document.getElementById('btnAccess'),
      cancel: document.getElementById('btnCancel'),
      generate: document.getElementById('btnGenerate'),
      download: document.getElementById('btnDownload'),
      whatsapp: document.getElementById('btnWhats'),
      edit: document.getElementById('btnEditName')
    };
    
    // Voltar
    this.backButtons = {
      password: document.getElementById('backFromPassword'),
      name: document.getElementById('backFromName'),
      invite: document.getElementById('backFromInvite')
    };
    
    // Inputs
    this.inputs = {
      password: document.getElementById('passwordInput'),
      name: document.getElementById('nameInput')
    };
    
    // Nome no convite
    this.inviteName = document.getElementById('inviteName');
  },
  
  bindEvents() {
    // Navegação principal
    this.buttons.create.addEventListener('click', () => this.showScreen('password'));
    this.buttons.view.addEventListener('click', () => this.showLastInvite());
    this.buttons.cancel.addEventListener('click', () => this.showScreen('home'));
    
    // Acesso com senha
    this.buttons.access.addEventListener('click', () => this.checkPassword());
    this.inputs.password.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.checkPassword();
    });
    
    // Gerar convite
    this.buttons.generate.addEventListener('click', () => this.generateInvite());
    this.inputs.name.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.generateInvite();
    });
    
    // Botões de voltar
    this.backButtons.password.addEventListener('click', () => this.showScreen('home'));
    this.backButtons.name.addEventListener('click', () => this.showScreen('password'));
    this.backButtons.invite.addEventListener('click', () => this.showScreen('home'));
    
    // Ações do convite
    this.buttons.download.addEventListener('click', () => this.downloadInvite());
    this.buttons.whatsapp.addEventListener('click', () => this.shareWhatsApp());
    this.buttons.edit.addEventListener('click', () => this.showScreen('name'));
  },
  
  showScreen(screenName) {
    // Esconder todas as telas
    Object.values(this.screens).forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Mostrar tela solicitada
    this.screens[screenName].classList.add('active');
    
    // Limpar inputs quando necessário
    if (screenName === 'password') {
      this.inputs.password.value = '';
      setTimeout(() => this.inputs.password.focus(), 300);
    } else if (screenName === 'name') {
      const savedName = localStorage.getItem('galaName');
      if (savedName) this.inputs.name.value = savedName;
      setTimeout(() => this.inputs.name.focus(), 300);
    }
  },
  
  checkPassword() {
    const password = this.inputs.password.value.trim();
    if (password === this.PASSWORD) {
      this.showScreen('name');
    } else {
      alert('Senha incorreta!');
      this.inputs.password.value = '';
      this.inputs.password.focus();
    }
  },
  
  generateInvite() {
    const rawName = this.inputs.name.value.trim();
    
    if (!rawName) {
      alert('Por favor, digite seu nome.');
      this.inputs.name.focus();
      return;
    }
    
    // Formatar nome (primeira letra maiúscula)
    const formattedName = rawName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Salvar nome
    localStorage.setItem('galaName', formattedName);
    
    // Atualizar convite
    this.inviteName.textContent = formattedName;
    
    // Gerar imagem do convite
    this.generateInviteImage();
    
    // Mostrar tela do convite
    this.showScreen('invite');
  },
  
  generateInviteImage() {
    const inviteElement = document.getElementById('invitePreview');
    
    // Configurações para celular
    const options = {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fffef9',
      logging: false,
      width: 375, // Largura fixa para celular
      height: inviteElement.scrollHeight * 1.2,
      windowWidth: 375,
      windowHeight: inviteElement.scrollHeight * 1.2
    };
    
    html2canvas(inviteElement, options)
      .then(canvas => {
        // Adicionar margens brancas
        const margin = 30;
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width + (margin * 2);
        finalCanvas.height = canvas.height + (margin * 2);
        
        const ctx = finalCanvas.getContext('2d');
        ctx.fillStyle = '#fffef9';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(canvas, margin, margin);
        
        // Salvar para download
        this.lastImageUrl = finalCanvas.toDataURL('image/png');
        localStorage.setItem('lastInviteImage', this.lastImageUrl);
      })
      .catch(error => {
        console.error('Erro ao gerar imagem:', error);
      });
  },
  
  downloadInvite() {
    const imageUrl = this.lastImageUrl || localStorage.getItem('lastInviteImage');
    
    if (!imageUrl) {
      alert('Gere o convite primeiro!');
      return;
    }
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Convite-Gala-Juvenil-${new Date().toISOString().slice(0,10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  
  shareWhatsApp() {
    const name = localStorage.getItem('galaName') || 'Convidado';
    const shareUrl = window.location.origin + window.location.pathname;
    const message = `✨ Gloria a Deus! ✨\n\nOlá! ${name} convida você para a Gala Juvenil 2025!\n\nData: 26 de Dezembro\nHorário: 22:00 às 04:00\nLocal: Congregação Tsakane - Machava-Sede\n\nSenha para baixar convite: ${this.PASSWORD}\n\nQue Deus abençoe nossa comunhão!`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },
  
  showLastInvite() {
    const savedName = localStorage.getItem('galaName');
    const savedImage = localStorage.getItem('lastInviteImage');
    
    if (!savedName || !savedImage) {
      alert('Nenhum convite salvo. Crie um convite primeiro!');
      return;
    }
    
    this.inviteName.textContent = savedName;
    this.lastImageUrl = savedImage;
    this.showScreen('invite');
  },
  
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'last') {
      this.showLastInvite();
    }
  }
};

// Iniciar app quando carregar
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  
  // Animação suave de entrada
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});