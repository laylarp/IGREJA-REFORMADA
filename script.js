// Comportamento da SPA: controle de telas, senha, geração do convite (html2canvas), download e compartilhamento via WhatsApp.
// Senha definida: "irm3022irm"

const SELECTORS = {
  homeCard: document.getElementById('homeCard'),
  btnCreate: document.getElementById('btnCreate'),
  btnView: document.getElementById('btnView'),
  passwordModal: document.getElementById('passwordModal'),
  passwordInput: document.getElementById('passwordInput'),
  btnPassAccess: document.getElementById('btnPassAccess'),
  btnPassCancel: document.getElementById('btnPassCancel'),
  nameCard: document.getElementById('nameCard'),
  nameInput: document.getElementById('nameInput'),
  btnGenerate: document.getElementById('btnGenerate'),
  backFromName: document.getElementById('backFromName'),
  inviteCard: document.getElementById('inviteCard'),
  invitePreview: document.getElementById('invitePreview'),
  inviteName: document.getElementById('inviteName'),
  btnDownload: document.getElementById('btnDownload'),
  btnWhats: document.getElementById('btnWhats'),
  btnEditName: document.getElementById('btnEditName'),
  backFromInvite: document.getElementById('backFromInvite')
};

const APP = {
  PASSWORD: 'irm3022irm',
  LAST_KEY: 'convitelRM_last',
  NAME_KEY: 'convitelRM_name',
  init(){
    this.bind();
    const url = new URL(location.href);
    if(url.searchParams.get('view') === 'last'){
      this.showLastInviteView();
    }
  },
  bind(){
    SELECTORS.btnCreate.addEventListener('click', ()=> this.openPassword());
    SELECTORS.btnView.addEventListener('click', ()=> this.showLastInviteView());
    SELECTORS.btnPassCancel.addEventListener('click', ()=> this.closePassword());
    SELECTORS.btnPassAccess.addEventListener('click', ()=> this.checkPassword());
    SELECTORS.btnGenerate.addEventListener('click', ()=> this.generateInvite());
    SELECTORS.backFromName.addEventListener('click', ()=> this.showHome());
    SELECTORS.backFromInvite.addEventListener('click', ()=> this.showHome());
    SELECTORS.btnDownload.addEventListener('click', ()=> this.downloadInvite());
    SELECTORS.btnWhats.addEventListener('click', ()=> this.shareWhatsApp());
    SELECTORS.btnEditName.addEventListener('click', ()=> this.editNameFromInvite());
  },
  openPassword(){
    SELECTORS.passwordModal.classList.remove('hidden');
    SELECTORS.passwordInput.value = '';
    SELECTORS.passwordInput.focus();
  },
  closePassword(){
    SELECTORS.passwordModal.classList.add('hidden');
  },
  checkPassword(){
    const val = SELECTORS.passwordInput.value.trim();
    if(val === this.PASSWORD){
      this.closePassword();
      this.showNameCard();
    } else {
      alert('Senha incorreta');
    }
  },
  showHome(){
    this.hideAll();
    SELECTORS.homeCard.classList.remove('hidden');
  },
  showNameCard(){
    this.hideAll();
    SELECTORS.nameCard.classList.remove('hidden');
    const cachedName = localStorage.getItem(this.NAME_KEY);
    if(cachedName) SELECTORS.nameInput.value = cachedName;
    SELECTORS.nameInput.focus();
  },
  showInviteCard(editable=true){
    this.hideAll();
    SELECTORS.inviteCard.classList.remove('hidden');
    const name = localStorage.getItem(this.NAME_KEY) || 'Convidado';
    SELECTORS.inviteName.textContent = name;
    SELECTORS.btnEditName.style.display = editable ? 'inline-block' : 'none';
  },
  hideAll(){
    SELECTORS.homeCard.classList.add('hidden');
    SELECTORS.passwordModal.classList.add('hidden');
    SELECTORS.nameCard.classList.add('hidden');
    SELECTORS.inviteCard.classList.add('hidden');
  },
  generateInvite(){
    const rawName = SELECTORS.nameInput.value.trim();
    if(!rawName){
      alert('Por favor escreva o nome completo.');
      return;
    }
    const formatted = rawName.split(' ').filter(Boolean).map(p => p[0]?.toUpperCase() + p.slice(1).toLowerCase()).join(' ');
    localStorage.setItem(this.NAME_KEY, formatted);
    SELECTORS.inviteName.textContent = formatted;
    setTimeout(()=> {
      this.showInviteCard(true);
      this.renderInviteToImage(true);
    }, 150);
  },
  renderInviteToImage(saveToLocal=true){
    const node = document.getElementById('invitePreview');
    html2canvas(node, { scale: 2, useCORS: true, backgroundColor: null }).then(canvas => {
      const dataUrl = canvas.toDataURL('image/png');
      if(saveToLocal){
        localStorage.setItem(this.LAST_KEY, dataUrl);
      }
      this._lastDataUrl = dataUrl;
    }).catch(err=>{
      console.error(err);
      alert('Erro ao gerar imagem do convite.');
    });
  },
  downloadInvite(){
    const dataUrl = this._lastDataUrl || localStorage.getItem(this.LAST_KEY);
    if(!dataUrl){
      alert('Nenhum convite gerado ainda.');
      return;
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    const nomeArquivo = `convite-gala-${(new Date()).toISOString().slice(0,10)}.png`;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  shareWhatsApp(){
    const shareUrl = location.origin + location.pathname + '?view=last';
    const text = `Gloria a Deus. Voce recebeu o convite para participar, baixe seu convite: ${shareUrl}  senha: ${this.PASSWORD}`;
    const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(wa, '_blank');
  },
  editNameFromInvite(){
    this.showNameCard();
  },
  showLastInviteView(){
    const last = localStorage.getItem(this.LAST_KEY);
    const name = localStorage.getItem(this.NAME_KEY);
    if(!last || !name){
      alert('Nenhum convite salvo. Gere um convite primeiro.');
      this.showHome();
      return;
    }
    SELECTORS.inviteName.textContent = name;
    this._lastDataUrl = last;
    this.showInviteCard(false);
  }
};

APP.init();