// VARIÁVEIS GLOBAIS
let linhaDoTempo = [];
let roletaData = {}; // Objeto roletaConfig

// 1. Geração da Roleta Interativa na tela
function renderizarRoleta() {
    const roletaDiv = document.getElementById('roleta-interativa');
    roletaDiv.innerHTML = ''; // Limpa antes de renderizar

    for (let i = 0; i <= 36; i++) {
        const numeroDiv = document.createElement('div');
        numeroDiv.textContent = i;
        numeroDiv.classList.add('numero');
        
        // Define cor usando o mapeamento do backend
        if (roletaData.PROPRIEDADES[i]) {
            numeroDiv.classList.add(roletaData.PROPRIEDADES[i].cor);
        } else {
             numeroDiv.classList.add('neutro');
        }
        
        numeroDiv.onclick = () => atualizarLinhaTempo(i);
        roletaDiv.appendChild(numeroDiv);
    }
}

// 2. Função principal para adicionar/remover número na Linha do Tempo
function atualizarLinhaTempo(numero) {
    const ultimoNumero = linhaDoTempo[linhaDoTempo.length - 1];

    if (numero === ultimoNumero && linhaDoTempo.length > 0) {
        // Regra de Correção Rápida: Clicar novamente remove o último número
        linhaDoTempo.pop();
    } else {
        linhaDoTempo.push(numero);
    }

    renderizarLinhaDoTempo();
    gerarAnaliseEstelar(); // Atualiza a análise sempre que o histórico muda
}

// 3. Renderiza a Linha do Tempo na tela
function renderizarLinhaDoTempo() {
    const linhaDiv = document.getElementById('linha-do-tempo');
    
    // Garantindo que a classe da cor está sendo usada corretamente
    linhaDiv.innerHTML = linhaDoTempo.map(n => {
        const cor = roletaData.PROPRIEDADES[n] ? roletaData.PROPRIEDADES[n].cor : 'neutro';
        return `<span class="lt-numero lt-${cor}">${n}</span>`;
    }).join(' → ');
}

// 4. Carrega o Histórico Base colado
function carregarHistorico() {
    const texto = document.getElementById('historico-paste').value;
    const historicoArray = texto.split(/[\s,;]+/)
                                .filter(n => n.length > 0)
                                .map(n => parseInt(n))
                                .filter(n => n >= 0 && n <= 36);

    if (historicoArray.length > 0) {
        linhaDoTempo = [...historicoArray]; 
        renderizarLinhaDoTempo();
        gerarAnaliseEstelar();
        alert(`Histórico Base carregado! ${historicoArray.length} números.`);
    } else {
        alert("Nenhum número válido encontrado.");
    }
}

// 5. Função que chama o Módulo de Análise Estelar (O Coração do Nexus)
function gerarAnaliseEstelar() {
    // Chama a função do backend (estelar.js)
    const resultado = analisarEstelar(linhaDoTempo, roletaData); 
    const analiseDiv = document.getElementById('analise-sugerida');
    
    // Monta a exibição do resultado
    if (resultado.alvos && resultado.alvos.length > 0) {
        analiseDiv.innerHTML = `
            <p class="sugestao-titulo">🎯 ANÁLISE NEXUS (Estelar)</p>
            <p><strong>Status:</strong> ${resultado.status}</p>
            <p><strong>Força/Confiança:</strong> ${resultado.confianca}/9</p>
            <p><strong>Alvos Sugeridos:</strong> <span class="alvos">${resultado.alvos.join(', ')}</span></p>
            <p class="espera">Ação: ${resultado.recomendacao}</p>
        `;
    } else {
         analiseDiv.innerHTML = `<p class="alerta">${resultado.status}</p>`;
    }
}

function logoutSalvarSessao() {
    alert("Funcionalidade de Logout e Salvar Sessão em desenvolvimento!");
    // Aqui seria o código para salvar o linhaDoTempo no localStorage ou banco de dados.
}

// Inicializa a Roleta quando a página carrega
window.onload = () => {
    // 'roletaConfig' (o objeto completo) é carregado como 'roletaData' no escopo global
    if (typeof roletaConfig !== 'undefined') {
         roletaData = roletaConfig; 
    }
    renderizarRoleta();
    // Exibe a análise inicial
    gerarAnaliseEstelar();
};
