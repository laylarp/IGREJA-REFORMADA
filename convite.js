// convite.js - Atualizado com melhorias
const ConviteApp = {
  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadName();
    this.checkLogo();
  },
  
  cacheElements() {
    this.elements = {
      inviteName: document.getElementById('inviteName'),
      backBtn: document.getElementById('backBtn'),
      downloadBtn: document.getElementById('btnDownload'),
      whatsappBtn: document.getElementById('btnWhats'),
      editBtn: document.getElementById('btnEdit'),
      invitePreview: document.getElementById('invitePreview'),
      logoImg: document.querySelector('.logo-img'),
      logoFallback: document.querySelector('.logo-fallback')
    };
  },
  
  bindEvents() {
    this.elements.backBtn.addEventListener('click', () => this.goBack());
    this.elements.downloadBtn.addEventListener('click', () => this.downloadInvite());
    this.elements.whatsappBtn.addEventListener('click', () => this.shareWhatsApp());
    this.elements.editBtn.addEventListener('click', () => this.editName());
  },
  
  loadName() {
    const savedName = localStorage.getItem('gala_nome_salvo') || 'Convidado Especial';
    this.elements.inviteName.textContent = savedName;
  },
  
  checkLogo() {
    // Verifica se a logo.png existe, caso contrário mostra o fallback
    if (this.elements.logoImg && this.elements.logoImg.naturalWidth === 0) {
      this.elements.logoImg.style.display = 'none';
      if (this.elements.logoFallback) {
        this.elements.logoFallback.style.display = 'flex';
      }
    }
  },
  
  goBack() {
    window.history.back();
  },
  
  editName() {
    window.location.href = 'index.html';
  },
  
  generateImage() {
    return new Promise((resolve, reject) => {
      const inviteElement = this.elements.invitePreview;
      if (!inviteElement) return reject(new Error('Elemento do convite não encontrado'));

      // Temporariamente aumenta a qualidade visual para captura
      inviteElement.style.transform = 'scale(1.02)';
      inviteElement.style.transition = 'none';

      const scale = Math.min(3, window.devicePixelRatio || 1.5);
      const rect = inviteElement.getBoundingClientRect();
      
      const options = {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        onclone: (clonedDoc) => {
          // Garante que todos os elementos visuais estejam otimizados para captura
          const clonedCard = clonedDoc.getElementById('invitePreview');
          if (clonedCard) {
            clonedCard.style.boxShadow = '0 20px 60px rgba(154, 78, 46, 0.25)';
            clonedCard.style.border = '3px solid rgba(154, 78, 46, 0.15)';
          }
        }
      };
      
      html2canvas(inviteElement, options)
        .then(canvas => {
          // Restaura transformação original
          inviteElement.style.transform = '';
          inviteElement.style.transition = '';
          
          // Melhora a qualidade da imagem final
          const finalCanvas = document.createElement('canvas');
          const ctx = finalCanvas.getContext('2d');
          
          // Aumenta um pouco a resolução para melhor qualidade
          finalCanvas.width = canvas.width * 1.2;
          finalCanvas.height = canvas.height * 1.2;
          
          // Fundo branco
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
          
          // Centraliza a imagem no canvas maior
          const xOffset = (finalCanvas.width - canvas.width) / 2;
          const yOffset = (finalCanvas.height - canvas.height) / 2;
          ctx.drawImage(canvas, xOffset, yOffset);
          
          const dataUrl = finalCanvas.toDataURL('image/png', 1.0);
          try {
            localStorage.setItem('gala_imagem_salva', dataUrl);
          } catch (e) {
            console.warn('Storage limitado, continuando sem salvar:', e);
          }
          resolve(dataUrl);
        })
        .catch(err => {
          inviteElement.style.transform = '';
          inviteElement.style.transition = '';
          console.error('Erro html2canvas:', err);
          
          // Fallback simplificado
          html2canvas(inviteElement, { 
            scale: 1,
            useCORS: true,
            backgroundColor: '#ffffff'
          })
            .then(canvas => {
              const dataUrl = canvas.toDataURL('image/png');
              try { 
                localStorage.setItem('gala_imagem_salva', dataUrl); 
              } catch(e) {}
              resolve(dataUrl);
            })
            .catch(finalErr => reject(finalErr));
        });
    });
  },
  
  async downloadInvite() {
    const originalHTML = this.elements.downloadBtn.innerHTML;
    this.elements.downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GERANDO...';
    this.elements.downloadBtn.disabled = true;
    
    try {
      const imageUrl = await this.generateImage();
      
      // Criar link e forçar download
      const link = document.createElement('a');
      link.href = imageUrl;
      const name = (localStorage.getItem('gala_nome_salvo') || 'Convidado').replace(/\s+/g, '_');
      const fileName = `Gala_Juvenil_2025_${name}.png`;
      link.download = fileName;
      
      // Adiciona efeito visual antes do download
      this.elements.invitePreview.style.animation = 'pulse 0.5s';
      setTimeout(() => {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.elements.invitePreview.style.animation = '';
      }, 500);
      
      // Feedback visual
      this.elements.downloadBtn.innerHTML = '<i class="fas fa-check"></i> BAIXADO!';
      this.elements.downloadBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
      this.elements.downloadBtn.style.borderColor = '#2E7D32';
      
      setTimeout(() => {
        this.elements.downloadBtn.innerHTML = originalHTML;
        this.elements.downloadBtn.disabled = false;
        this.elements.downloadBtn.style.background = '';
        this.elements.downloadBtn.style.borderColor = '';
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar convite. Por favor, tente novamente.');
      this.elements.downloadBtn.innerHTML = originalHTML;
      this.elements.downloadBtn.disabled = false;
    }
  },
  
  async shareWhatsApp() {
    const originalHTML = this.elements.whatsappBtn.innerHTML;
    this.elements.whatsappBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PREPARANDO...';
    this.elements.whatsappBtn.disabled = true;
    
    try {
      // Gera a imagem primeiro
      const imageUrl = await this.generateImage();
      
      // Converte dataURL para blob para compartilhamento
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'Convite_Gala_Juvenil.png', { type: 'image/png' });
      
      // Tenta usar a Web Share API primeiro (se disponível)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Convite Gala Juvenil 2025',
          text: `Glória a Deus! Recebeste um convite para a Gala Juvenil 2025.`
        });
      } else {
        // Fallback para WhatsApp Web
        const name = localStorage.getItem('gala_nome_salvo') || 'Convidado Especial';
        const message = `🎉 *CONVITE GALA JUVENIL 2025* 🎉\n\n` +
                       `Glória a Deus! Recebeste um convite especial para a Gala Juvenil 2025.\n` +
                       `👤 *Convidado:* ${name}\n` +
                       `📅 *Data:* 26 de Dezembro de 2025\n` +
                       `⏰ *Horário:* 22:00 às 04:00\n` +
                       `📍 *Local:* Congregação Tsakane, Machava-Sede\n` +
                       `\n"Como é bom e agradável quando os irmãos convivem em união." (Salmos 133:1)\n` +
                       `\nPara mais informações, abre a imagem do convite.`;
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        
        // Mostra a imagem em nova aba para o usuário salvar
        setTimeout(() => {
          const win = window.open();
          if (win) {
            win.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>Convite Gala Juvenil</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    background: #f9f1e3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                  }
                  img { 
                    max-width: 100%; 
                    height: auto; 
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                  }
                </style>
              </head>
              <body>
                <img src="${imageUrl}" alt="Convite Gala Juvenil">
                <script>
                  setTimeout(() => alert('Podes salvar esta imagem para partilhar!'), 500);
                </script>
              </body>
              </html>
            `);
          }
        }, 1000);
      }
      
      // Feedback visual
      this.elements.whatsappBtn.innerHTML = '<i class="fas fa-check"></i> PARTILHADO!';
      this.elements.whatsappBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
      
      setTimeout(() => {
        this.elements.whatsappBtn.innerHTML = originalHTML;
        this.elements.whatsappBtn.disabled = false;
        this.elements.whatsappBtn.style.background = '';
      }, 3000);
      
    } catch (e) {
      console.error('Erro ao partilhar:', e);
      alert('Não foi possível partilhar. Podes tentar descarregar o convite e partilhar manualmente.');
      this.elements.whatsappBtn.innerHTML = originalHTML;
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

// Adicionar animação CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  
  .logo-circle img {
    transition: transform 0.5s ease;
  }
  
  .logo-circle:hover img {
    transform: rotate(10deg) scale(1.1);
  }
  
  .logo-circle:hover .logo-fallback i {
    transform: rotate(-10deg) scale(1.1);
  }
`;
document.head.appendChild(style);