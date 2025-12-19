// Comportamento da SPA: controle de telas, senha, geração do convite (html2canvas), download e compartilhamento via WhatsApp.
// Senha definida: "irm3022irm"
// Mensagem de WhatsApp conforme pedido.

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
    // Se veio com ?view=last tenta mostrar invite salvo
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
    // se houver nome salvo atualiza
    const name = localStorage.getItem(this.NAME_KEY) || 'Convidado';
    SELECTORS.inviteName.textContent = name;
    // toggle edit button (if view-only then hide edit)
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
    // formata nome com capitalização básica
    const formatted = rawName.split(' ').filter(Boolean).map(p => p[0]?.toUpperCase() + p.slice(1).toLowerCase()).join(' ');
    localStorage.setItem(this.NAME_KEY, formatted);
    // atualiza convite no DOM e gera imagem
    SELECTORS.inviteName.textContent = formatted;
    // Aguarda pintura do DOM e gera
    setTimeout(()=> {
      // Mostrar a tela do convite (editável)
      this.showInviteCard(true);
      // gerar e salvar em last
      this.renderInviteToImage(true);
    }, 150);
  },
  renderInviteToImage(saveToLocal=true){
    const node = document.getElementById('invitePreview');
    // aumentar escala para melhor resolução
    html2canvas(node, { scale: 2, useCORS: true, backgroundColor: null }).then(canvas => {
      const dataUrl = canvas.toDataURL('image/png');
      if(saveToLocal){
        localStorage.setItem(this.LAST_KEY, dataUrl);
      }
      // guardar temporariamente para download imediato
      this._lastDataUrl = dataUrl;
    }).catch(err=>{
      console.error(err);
      alert('Erro ao gerar imagem do convite.');
    });
  },
  downloadInvite(){
    // Se já possuímos dataURL (após geração) usa, caso contrário tenta pegar do localStorage
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
    // Tenta compartilhar o link para baixar o convite. Como não temos upload, compartilhamos a página com parâmetro ?view=last
    const shareUrl = location.origin + location.pathname + '?view=last';
    const text = `Gloria a Deus. Voce recebeu o convite para participar, baixe seu convite: ${shareUrl}  senha: ${this.PASSWORD}`;
    // Se o navegador for mobile e suportar Web Share API com files, poderíamos compartilhar a imagem; aqui abrimos WhatsApp Web/mobile com texto
    const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(wa, '_blank');
  },
  editNameFromInvite(){
    // volta para tela de nome (mantém o valor atual)
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
    // Mostrar convite a partir do last (view-only)
    // Colocar a imagem em um elemento temporário do invitePreview
    SELECTORS.inviteName.textContent = name;
    // Carregamos a imagem (last) como background do invitePreview para garantir que o layout fique igual e o botão editar fique oculto
    // Porém para manter o layout idêntico exibimos a própria estrutura e deixamos o botão "EDITAR NOME" oculto.
    this._lastDataUrl = last;
    this.showInviteCard(false);
  }
};

APP.init();