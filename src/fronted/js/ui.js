// VARIÁVEIS GLOBAIS
let linhaDoTempo = [];
let roletaData = {}; // Será carregado de roulette_data.js

// 1. Geração da Roleta Interativa na tela
function renderizarRoleta() {
    const roletaDiv = document.getElementById('roleta-interativa');
    // Mapeamento básico para cores (pode ser aprimorado com roulette_data.js)
    const cores = {
        0: 'green',
        'par': 'black',
        'impar': 'red'
    };
    
    // Simples: 0 a 36
    for (let i = 0; i <= 36; i++) {
        const numeroDiv = document.createElement('div');
        numeroDiv.textContent = i;
        numeroDiv.classList.add('numero');
        // Define cor base
        if (i === 0) {
            numeroDiv.classList.add(cores[0]);
        } else if (i % 2 === 0) {
            numeroDiv.classList.add(cores['par']);
        } else {
            numeroDiv.classList.add(cores['impar']);
        }
        numeroDiv.onclick = () => atualizarLinhaTempo(i);
        roletaDiv.appendChild(numeroDiv);
    }
}

// 2. Função principal para adicionar/remover número na Linha do Tempo
function atualizarLinhaTempo(numero) {
    const ultimoNumero = linhaDoTempo[linhaDoTempo.length - 1];

    if (numero === ultimoNumero) {
        // Regra de Correção Rápida: Clicar novamente remove
        linhaDoTempo.pop();
        console.log(`Removido: ${numero}`);
    } else {
        linhaDoTempo.push(numero);
        console.log(`Adicionado: ${numero}`);
    }

    renderizarLinhaDoTempo();
}

// 3. Renderiza a Linha do Tempo na tela
function renderizarLinhaDoTempo() {
    const linhaDiv = document.getElementById('linha-do-tempo');
    linhaDiv.innerHTML = linhaDoTempo.map(n => `<span class="lt-numero lt-${roletaData.PROPRIEDADES[n].cor}">${n}</span>`).join(' → ');
}

// 4. Carrega o Histórico Base colado (para inicializar a Linha do Tempo)
function carregarHistorico() {
    const texto = document.getElementById('historico-paste').value;
    const historicoArray = texto.split(/[\s,;]+/)
                                .filter(n => n.length > 0)
                                .map(n => parseInt(n))
                                .filter(n => n >= 0 && n <= 36);

    // O histórico base serve como a Memória Longa.
    // O primeiro número do histórico deve iniciar a Linha do Tempo Editável.
    if (historicoArray.length > 0) {
        linhaDoTempo = [...historicoArray]; // Para começar com o base
        renderizarLinhaDoTempo();
        alert(`Histórico Base carregado! ${historicoArray.length} números.`);
    } else {
        alert("Nenhum número válido encontrado.");
    }
}

// 5. Placeholder para a Análise Estelar
function gerarAnaliseEstelar() {
    if (linhaDoTempo.length < 3) {
        document.getElementById('analise-sugerida').innerHTML = '<p class="alerta">Histórico muito curto. Mínimo de 3 números para Análise Estelar (Trinca).</p>';
        return;
    }
    
    // **AQUI CHAMAREMOS A LÓGICA DO BACKEND (estelar.js)**
    // Ex: const resultado = analisarEstelar(linhaDoTempo, roletaData);
    
    // Placeholder de Sugestão
    document.getElementById('analise-sugerida').innerHTML = `
        <p class="sugestao-titulo">🎯 ANÁLISE ESTELAR CONVERGENTE</p>
        <p><strong>Força:</strong> Alta Confiança (3 Pilares)</p>
        <p><strong>Alvos:</strong> 15, 32, 19, 0 (Proteção)</p>
        <p class="espera">Ação: Esperar 2 Rodadas para Entrada!</p>
    `;
}

// Inicializa a Roleta quando a página carrega
window.onload = () => {
    // Apenas para garantir que o objeto roletaData existe
    if (typeof roletaConfig !== 'undefined') {
         roletaData = roletaConfig; 
    } else {
         roletaData = {}; // Default para não quebrar
    }
    renderizarRoleta();
};
