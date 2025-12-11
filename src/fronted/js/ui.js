// VARIÁVEIS GLOBAIS
let linhaDoTempo = [];
let roletaData = {}; // Objeto roletaConfig
let logEntradas = []; // Array para armazenar o histórico de resultados
let saldo = 0; // Saldo inicial para gestão de risco

// ======================================================
// 1. Geração da Roleta Interativa na tela
// ======================================================
function renderizarRoleta() {
    const roletaDiv = document.getElementById('roleta-interativa');
    roletaDiv.innerHTML = ''; 

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

// ======================================================
// 2. Função principal para adicionar/remover número na Linha do Tempo
// ======================================================
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

// ======================================================
// 3. Renderiza a Linha do Tempo na tela
// ======================================================
function renderizarLinhaDoTempo() {
    const linhaDiv = document.getElementById('linha-do-tempo');
    
    // Garantindo que a classe da cor está sendo usada corretamente
    linhaDiv.innerHTML = linhaDoTempo.map(n => {
        const cor = roletaData.PROPRIEDADES[n] ? roletaData.PROPRIEDADES[n].cor : 'neutro';
        return `<span class="lt-numero lt-${cor}">${n}</span>`;
    }).join(' → ');
}

// ======================================================
// 4. Carrega o Histórico Base colado
// ======================================================
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

// ======================================================
// 5. Função que chama o Módulo de Análise Estelar
// ======================================================
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

// ======================================================
// 6. Gestão de Log (Green/Red) e Saldo
// ======================================================

/**
 * Registra o resultado de uma aposta baseada na sugestão Nexus.
 * @param {string} resultado - 'Green' ou 'Red'.
 */
function registrarEntrada(resultado) {
    if (linhaDoTempo.length === 0) {
        alert("Adicione alguns números à Linha do Tempo antes de registrar uma entrada!");
        return;
    }
    
    const valorEntrada = 1; // Unidade de aposta (ex: 1 Real/Dólar)
    let lucro = 0;

    // Simula uma vitória em número cheio. Se você usa cobertura, ajuste aqui.
    if (resultado === 'Green') {
        lucro = 35 * valorEntrada; // Vitória 35:1 (Lucro de 35)
        saldo += lucro;
    } else {
        lucro = -valorEntrada; // Perda da unidade
        saldo += lucro;
    }

    const entrada = {
        id: logEntradas.length + 1,
        timestamp: new Date().toLocaleTimeString(),
        resultado: resultado,
        lucro: lucro,
        historico: linhaDoTempo.slice() // Salva uma cópia do histórico da aposta
    };

    logEntradas.push(entrada);
    salvarSessao(); // Salva a sessão após cada entrada
    
    // Limpar e reiniciar o ciclo após a aposta
    linhaDoTempo = []; 
    renderizarLinhaDoTempo();
    gerarAnaliseEstelar(); 
    
    renderizarLog();
    alert(`Entrada Registrada: ${resultado}! Saldo Atual: ${saldo.toFixed(2)}`);
}

/**
 * Renderiza o log de entradas e o saldo na interface.
 */
function renderizarLog() {
    const logDiv = document.getElementById('log-entradas');
    logDiv.innerHTML = `<h4>💰 Saldo Atual: R$ ${saldo.toFixed(2)}</h4>`;

    // Mostra as 10 entradas mais recentes
    logEntradas.slice(-10).reverse().forEach(entrada => {
        const classe = entrada.resultado === 'Green' ? 'log-green' : 'log-red';
        const sinal = entrada.lucro >= 0 ? '+' : '';
        
        logDiv.innerHTML += `
            <div class="log-item ${classe}">
                [#${entrada.id} | ${entrada.timestamp}] 
                **${entrada.resultado}** | Lucro: ${sinal}${entrada.lucro.toFixed(2)}
                <small>Histórico: ${entrada.historico.join(',')}</small>
            </div>
        `;
    });
}

// ======================================================
// 7. Persistência de Dados (localStorage) - NOVO
// ======================================================

/**
 * Salva o log de entradas e o saldo no localStorage.
 */
function salvarSessao() {
    localStorage.setItem('nexus_log_entradas', JSON.stringify(logEntradas));
    localStorage.setItem('nexus_saldo', saldo);
}

/**
 * Carrega o log de entradas e o saldo do localStorage.
 */
function carregarSessao() {
    const logSalvo = localStorage.getItem('nexus_log_entradas');
    const saldoSalvo = localStorage.getItem('nexus_saldo');

    if (logSalvo) {
        logEntradas = JSON.parse(logSalvo);
    }
    
    if (saldoSalvo) {
        // Converte para número, garantindo que o saldo é carregado corretamente
        saldo = parseFloat(saldoSalvo);
    }
}

/**
 * Função chamada ao clicar em "LOGOUT & Salvar Sessão".
 */
function logoutSalvarSessao() {
    salvarSessao(); // Garante o salvamento
    alert("Sessão salva com sucesso! O histórico e saldo foram mantidos no seu navegador.");
}

// ======================================================
// 8. Inicialização
// ======================================================

// Inicializa a Roleta e carrega a sessão quando a página carrega
window.onload = () => {
    // 1. Carrega as configurações da roleta
    if (typeof roletaConfig !== 'undefined') {
         roletaData = roletaConfig; 
    }
    
    // 2. Carrega a sessão salva
    carregarSessao(); 

    // 3. Renderiza a UI
    renderizarRoleta();
    renderizarLog(); // Mostra o saldo carregado
    gerarAnaliseEstelar();
};
