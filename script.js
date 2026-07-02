let nLoja = "000";

// Controla a transição entre as telas do fluxo
function nextStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
    
    // Foca automaticamente na área de texto ao abrir o scanner
    if(step === 3) {
        setTimeout(() => document.getElementById('scannerArea').focus(), 100);
    }
}

// Valida e formata o input do número da loja
function confirmarLoja() {
    let val = document.getElementById('lojaInput').value;
    if(!val) {
        alert("Por favor, insira o número da loja.");
        return;
    }
    // Formata com zeros à esquerda (ex: 1 -> 001)
    nLoja = val.toString().padStart(3, '0');
    document.getElementById('displayLoja').innerText = nLoja;
    nextStep(3);
}

// Contador de linhas em tempo real na área de escaneamento
document.getElementById('scannerArea').addEventListener('input', function() {
    let lines = this.value.split('\n').filter(l => l.trim() !== "").length;
    document.getElementById('lineCount').innerText = lines;
});

// Processa o texto escaneado e gera a formatação final
function finalizarEscaneamento() {
    const texto = document.getElementById('scannerArea').value;
    const linhas = texto.split(/\r?\n/).filter(l => l.trim() !== "");
    
    if(linhas.length === 0) {
        alert("Nenhum código foi escaneado.");
        return;
    }

    let conteudoFinal = "";
    
    linhas.forEach(codigo => {
        // Formatação RIGOROSA conforme padrão:
        // "CODIGO" (espaços) ,"LOJA","QUANTIDADE","I"
        conteudoFinal += `"${codigo.trim()}"        ,"${nLoja}","0001","I"\n`;
    });

    // Gerar data atualizada para o nome do arquivo (DDMMYYYY)
    const d = new Date();
    const dataStr = `${d.getDate().toString().padStart(2,'0')}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getFullYear()}`;
    const nomeArquivo = `leitura_${nLoja}_${dataStr}.txt`;

    // Cria o Blob contendo as informações formatadas
    const blob = new Blob([conteudoFinal], { type: 'text/plain' });
    const urlArquivo = URL.createObjectURL(blob);

    // Configura o link de emergência/manual ("Clique aqui") no HTML da tela 4
    const btnDownload = document.getElementById('btnDownload');
    btnDownload.href = urlArquivo;
    btnDownload.download = nomeArquivo;
    
    // Muda para a tela final de download
    nextStep(4);
    
    // Dispara o download automático em background
    setTimeout(() => {
        const linkInvisivel = document.createElement('a');
        linkInvisivel.href = urlArquivo;
        linkInvisivel.download = nomeArquivo;
        document.body.appendChild(linkInvisivel);
        linkInvisivel.click();
        document.body.removeChild(linkInvisivel);
    }, 500); // Um pequeno atraso sutil para o usuário perceber a animação do carregamento
}