function navegar(idTela) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(idTela).classList.add('active');
}

function validarSenha() {
    const senha = document.getElementById('inputSenha').value;
    if (senha === "irm3022irm") {
        navegar('tela3');
    } else {
        alert("Senha incorreta!");
    }
}

function gerarConvite() {
    const nome = document.getElementById('nomeConvidado').value;
    if (nome.trim() === "") {
        alert("Por favor, digite um nome.");
        return;
    }
    document.getElementById('displayNome').innerText = nome;
    localStorage.setItem('conviteNome', nome); // Salva para o "Ver Convite"
    navegar('tela4');
}

function verConviteExistente() {
    const nomeSalvo = localStorage.getItem('conviteNome');
    if (nomeSalvo) {
        document.getElementById('displayNome').innerText = nomeSalvo;
        navegar('tela4');
        // Esconde botão de editar na visualização direta se desejar, 
        // mas aqui mantive conforme pedido.
    } else {
        alert("Nenhum convite gerado ainda.");
    }
}

function baixarImagem() {
    const area = document.getElementById('areaConvite');
    html2canvas(area, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Convite_Gala_${document.getElementById('displayNome').innerText}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

function compartilharWhatsApp() {
    const nome = document.getElementById('displayNome').innerText;
    const linkSite = window.location.href;
    const texto = `Glória a Deus.! Paz e graça,\n\n*${nome}*, baixe o seu convite para a Gala Cristã Juvenil através do link: ${linkSite}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}