const ConviteApp = {
  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadName();
  },
  
  cacheElements() {
    this.elements = {
      inviteName: document.getElementById('inviteName'),
      backBtn: document.getElementById('backBtn'),
      downloadBtn: document.getElementById('btnDownload'),
      whatsappBtn: document.getElementById('btnWhats'),
      editBtn: document.getElementById('btnEdit'),
      invitePreview: document.getElementById('invitePreview')
    };
  },
  
  bindEvents() {
    this.elements.backBtn.addEventListener('click', () => this.goBack());
    this.elements.downloadBtn.addEventListener('click', () => this.downloadInvite());
    this.elements.whatsappBtn.addEventListener('click', () => this.shareWhatsApp());
    this.elements.editBtn.addEventListener('click', () => this.editName());
  },
  
  loadName() {
    const savedName = localStorage.getItem('gala_nome_salvo');
    if (savedName) {
      this.elements.inviteName.textContent = savedName;
    }
  },
  
  goBack() {
    window.history.back();
  },
  
  editName() {
    // Mantive o comportamento original de redirecionar para index.html
    window.location.href = 'index.html';
  },
  
  generateImage() {
    return new Promise((resolve, reject) => {
      const inviteElement = this.elements.invitePreview;
      if (!inviteElement) return reject(new Error('Elemento do convite não encontrado'));

      // escala adaptativa para melhor qualidade em dispositivos HiDPI
      const scale = Math.min(2, window.devicePixelRatio || 1);
      const rect = inviteElement.getBoundingClientRect();
      const options = {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: Math.round(rect.width * scale),
        height: Math.round(rect.height * scale)
      };
      
      html2canvas(inviteElement, options)
        .then(canvas => {
          // Garantir fundo branco e exportar PNG
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = canvas.width;
          finalCanvas.height = canvas.height;
          const ctx = finalCanvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
          ctx.drawImage(canvas, 0, 0);
          const dataUrl = finalCanvas.toDataURL('image/png', 1.0);
          try {
            localStorage.setItem('gala_imagem_salva', dataUrl);
          } catch (e) {
            // storage pode falhar em modo privado; mas ainda resolvemos com dataUrl
            console.warn('Não foi possível salvar imagem em localStorage:', e);
          }
          resolve(dataUrl);
        })
        .catch(err => {
          console.warn('html2canvas falhou com opções avançadas, tentando fallback', err);
          // fallback com scale 1
          html2canvas(inviteElement, { scale: 1, useCORS: true })
            .then(canvas => {
              const dataUrl = canvas.toDataURL('image/png');
              try { localStorage.setItem('gala_imagem_salva', dataUrl); } catch(e){}
              resolve(dataUrl);
            })
            .catch(finalErr => reject(finalErr));
        });
    });
  },
  
  async downloadInvite() {
    let imageUrl = localStorage.getItem('gala_imagem_salva');
    
    if (!imageUrl) {
      this.elements.downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GERANDO...';
      this.elements.downloadBtn.disabled = true;
      
      try {
        imageUrl = await this.generateImage();
      } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        alert('Erro ao gerar convite. Tente novamente.');
        this.elements.downloadBtn.innerHTML = '<i class="fas fa-download"></i> BAIXAR';
        this.elements.downloadBtn.disabled = false;
        return;
      }
      
      this.elements.downloadBtn.innerHTML = '<i class="fas fa-download"></i> BAIXAR';
      this.elements.downloadBtn.disabled = false;
    }
    
    // Criar link e forçar download
    const link = document.createElement('a');
    link.href = imageUrl;
    const name = (localStorage.getItem('gala_nome_salvo') || 'Convidado').replace(/\s+/g, '-');
    const fileName = `Gala-Juvenil-${name}.png`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Feedback visual
    const originalHTML = this.elements.downloadBtn.innerHTML;
    this.elements.downloadBtn.innerHTML = '<i class="fas fa-check"></i> BAIXADO!';
    this.elements.downloadBtn.disabled = true;
    
    setTimeout(() => {
      this.elements.downloadBtn.innerHTML = originalHTML;
      this.elements.downloadBtn.disabled = false;
    }, 2000);
  },
  
  async shareWhatsApp() {
    // Gera a imagem se necessário para o utilizador poder partilhar a imagem manualmente
    try {
      this.elements.whatsappBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PREPARANDO...';
      this.elements.whatsappBtn.disabled = true;
      
      let imageUrl = localStorage.getItem('gala_imagem_salva');
      if (!imageUrl) {
        imageUrl = await this.generateImage();
      }
      
      // Abre a imagem em nova aba (usuário pode salvar/encaminhar a partir daí)
      const win = window.open();
      if (win) {
        win.document.write(`<title>Convite - Gala Juvenil</title><img src="${imageUrl}" style="max-width:100%;height:auto;display:block;margin:0 auto;">`);
      }
      
      // Prepara mensagem para WhatsApp (link para a página atual; não é possível anexar imagens via URL)
      const shareUrl = window.location.href.split('?')[0];
      const name = localStorage.getItem('gala_nome_salvo') || 'Convidado';
      const message = `Glória a Deus! Recebeste um convite para a Gala Juvenil 2025 — ${name}. Descarrega o convite a partir da imagem aberta ou visita: ${shareUrl}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    } catch (e) {
      console.error('Erro ao preparar partilha WhatsApp:', e);
      alert('Não foi possível preparar a partilha. Tenta novamente.');
    } finally {
      this.elements.whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> COMPARTILHAR';
      this.elements.whatsappBtn.disabled = false;
    }
  }
};

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ConviteApp.init());
} else {
  ConviteApp.init();
}