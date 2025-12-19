const MainApp = {
  PASSWORD: 'irm3022irm',
  
  init() {
    this.cacheElements();
    this.bindEvents();
    this.checkUrlParams();
    this.showScreen('home');
    
    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
  },
  
  cacheElements() {
    this.elements = {
      screens: {
        home: document.getElementById('homeCard'),
        password: document.getElementById('passwordScreen'),
        name: document.getElementById('nameScreen')
      },
      buttons: {
        create: document.getElementById('btnCreate'),
        view: document.getElementById('btnView'),
        access: document.getElementById('btnAccess'),
        cancel: document.getElementById('btnCancel'),
        generate: document.getElementById('btnGenerate')
      },
      backButtons: {
        password: document.getElementById('backFromPassword'),
        name: document.getElementById('backFromName')
      },
      inputs: {
        password: document.getElementById('passwordInput'),
        name: document.getElementById('nameInput')
      }
    };
  },
  
  bindEvents() {
    this.elements.buttons.create.addEventListener('click', () => this.showScreen('password'));
    this.elements.buttons.view.addEventListener('click', () => this.viewSavedInvite());
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
  },
  
  showScreen(screenName) {
    Object.values(this.elements.screens).forEach(screen => {
      screen.classList.remove('active');
    });
    
    this.elements.screens[screenName].classList.add('active');
    
    window.scrollTo(0, 0);
    
    switch(screenName) {
      case 'password':
        this.elements.inputs.password.value = '';
        setTimeout(() => {
          this.elements.inputs.password.focus();
        }, 350);
        break;
        
      case 'name':
        const savedName = localStorage.getItem('gala_nome_salvo');
        if (savedName) this.elements.inputs.name.value = savedName;
        setTimeout(() => {
          this.elements.inputs.name.focus();
        }, 350);
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
    
    localStorage.setItem('gala_nome_salvo', formattedName);
    
    window.location.href = 'convite.html';
  },
  
  viewSavedInvite() {
    const savedName = localStorage.getItem('gala_nome_salvo');
    const savedImage = localStorage.getItem('gala_imagem_salva');
    
    if (!savedName || !savedImage) {
      alert('Nenhum convite encontrado. Crie um convite primeiro!');
      return;
    }
    
    window.location.href = 'convite.html?view=saved';
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
  
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'saved') {
      this.viewSavedInvite();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    MainApp.init();
  }, 100);
});