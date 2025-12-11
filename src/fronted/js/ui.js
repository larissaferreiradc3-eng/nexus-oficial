// VARIÁVEIS GLOBAIS
let historicoAtual = [];
let logEntradas = [];
let saldo = 0;
let usuarioLogado = null; 

// ESTRATÉGIA NERA: Estruturas de Dados
let Tabela_Alvos_NERA = {}; 
let NERA_Alvos_Atrasados = {}; // Rastreia alvos que foram invalidados e aguardam a 7ª rodada

// ======================================================
// FUNÇÕES DE PERSISTÊNCIA (Local Storage)
// ======================================================

function salvarDadosUsuario(username) {
    // Implemente a lógica de salvar usuários e hash de senha aqui
    const usuarios = JSON.parse(localStorage.getItem('nexus_usuarios') || '{}');
    usuarios[username] = { senhaHash: calcularHashHistorico(username), saldo: saldo };
    localStorage.setItem('nexus_usuarios', JSON.stringify(usuarios));
}

function carregarDadosUsuario(username) {
    const usuarios = JSON.parse(localStorage.getItem('nexus_usuarios') || '{}');
    return usuarios[username];
}

function salvarSessao(username) {
    const dadosSessao = {
        historico: historicoAtual,
        logs: logEntradas,
        saldo: saldo,
        Tabela_Alvos_NERA: Tabela_Alvos_NERA, 
        NERA_Alvos_Atrasados: NERA_Alvos_Atrasados // Salva a tabela de Atraso
    };
    localStorage.setItem(`nexus_sessao_${username}`, JSON.stringify(dadosSessao));
}

function carregarSessao(username) {
    const data = localStorage.getItem(`nexus_sessao_${username}`);
    if (data) {
        const sessao = JSON.parse(data);
        historicoAtual = sessao.historico || [];
        logEntradas = sessao.logs || [];
        saldo = sessao.saldo || 0;
        Tabela_Alvos_NERA = sessao.Tabela_Alvos_NERA || {};
        NERA_Alvos_Atrasados = sessao.NERA_Alvos_Atrasados || {}; // Carrega a tabela de Atraso
    }
}

// ======================================================
// FUNÇÕES DE LOGIN/REGISTRO
// ======================================================

window.fazerLogin = function(username, password) {
    const usuarioSalvo = carregarDadosUsuario(username);
    const hashLogin = calcularHashHistorico(password);
    
    if (usuarioSalvo && usuarioSalvo.senhaHash === hashLogin) {
        usuarioLogado = username;
        iniciarSessao(username);
        return true;
    } else {
        document.getElementById('login-message').textContent = 'Erro: Usuário ou senha incorretos.';
        return false;
    }
}

window.iniciarSessao = function(username) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('current-user').textContent = `Usuário: ${username}`;
    carregarSessao(username);
    atualizarLinhaDoTempo();
    atualizarLogs();
    atualizarAnalise();
}

window.fazerLogout = function() {
    if (usuarioLogado) {
        salvarSessao(usuarioLogado);
    }
    
    historicoAtual = [];
    logEntradas = [];
    saldo = 0;
    Tabela_Alvos_NERA = {}; 
    NERA_Alvos_Atrasados = {}; // RESET DA TABELA NERA
    usuarioLogado = null;
    
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-message').textContent = 'Logout realizado. Sessão salva.';
}

// ======================================================
// FUNÇÕES DE DADOS E HASH
// ======================================================

function calcularHashHistorico(data) {
    // Simulação simples de hash para rastreamento de estado
    return btoa(data.toString()).substring(0, 8);
}

function carregarHistorico(historicoStr) {
    // Simulação de carregamento de histórico via JSON/texto
    try {
        const novoHistorico = JSON.parse(historicoStr);
        if (Array.isArray(novoHistorico) && novoHistorico.every(n => typeof n === 'number' && n >= 0 && n <= 36)) {
            historicoAtual = novoHistorico.slice(0, 100);
            Tabela_Alvos_NERA = {}; // Limpa NERA ao carregar novo histórico
            NERA_Alvos_Atrasados = {}; // Limpa atrasos
            
            // Re-processa NERA se um histórico grande for carregado
            historicoAtual.slice().reverse().forEach(num => {
                 const resultadosNERA = Processar_Resultado_NERA(historicoAtual, num, Tabela_Alvos_NERA, NERA_Alvos_Atrasados, roletaConfig);
                 Tabela_Alvos_NERA = resultadosNERA.Tabela_Alvos;
                 NERA_Alvos_Atrasados = resultadosNERA.NERA_Atrasados;
            });
            
            atualizarLinhaDoTempo();
            atualizarAnalise();
            if (usuarioLogado) salvarSessao(usuarioLogado);
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}

window.inserirNumeroManual = function(numero) {
    const num = parseInt(numero);
    if (!isNaN(num) && num >= 0 && num <= 36) {
        
        // --- Executa o Processamento NERA ANTES de adicionar ao histórico ---
        const resultadosNERA = Processar_Resultado_NERA(historicoAtual, num, Tabela_Alvos_NERA, NERA_Alvos_Atrasados, roletaConfig);
        Tabela_Alvos_NERA = resultadosNERA.Tabela_Alvos;
        NERA_Alvos_Atrasados = resultadosNERA.NERA_Atrasados;
        // ------------------------------------------------------------------

        historicoAtual.unshift(num); 
        historicoAtual = historicoAtual.slice(0, 100); 

        atualizarLinhaDoTempo();
        atualizarAnalise();
        if (usuarioLogado) salvarSessao(usuarioLogado);
    }
}

// ======================================================
// FUNÇÕES DE LOGS E GESTÃO (GREEN/RED)
// ======================================================

function registrarEntrada(tipo, valor, alvos) {
    const resultado = 'GREEN'; // Assumindo sucesso para simplificar o exemplo
    const log = {
        rodada: historicoAtual.length + 1,
        tipo: tipo,
        valor: valor,
        alvos: alvos,
        resultado: resultado,
        data: new Date().toLocaleString()
    };
    logEntradas.unshift(log);
    saldo += resultado === 'GREEN' ? valor * 30 : -valor; // Exemplo simplificado de cálculo
    atualizarLogs();
    if (usuarioLogado) salvarSessao(usuarioLogado);
}

window.resetSessao = function() {
    if (confirm("Tem certeza que deseja RESETAR o Saldo e todos os Logs desta sessão?")) {
        logEntradas = [];
        saldo = 0;
        historicoAtual = [];
        Tabela_Alvos_NERA = {}; 
        NERA_Alvos_Atrasados = {}; // RESET DA TABELA DE ATRASO
        atualizarLogs();
        atualizarLinhaDoTempo();
        atualizarAnalise();
        
        if (usuarioLogado) {
            salvarSessao(usuarioLogado);
        }
    }
}

// ======================================================
// FUNÇÕES DE RENDERIZAÇÃO
// ======================================================

function atualizarAnalise() {
    
    // Passamos NERA_Alvos_Atrasados para analisarEstelar
    const analise = analisarEstelar(historicoAtual, roletaConfig, Tabela_Alvos_NERA, NERA_Alvos_Atrasados); 
    const hash = calcularHashHistorico(historicoAtual);
    const outputDiv = document.getElementById('analise-sugerida');
    outputDiv.innerHTML = '';

    // --- NOVA SEÇÃO DE MENSAGENS DE ESPERA ---
    let mensagensEsperaHTML = '';
    if (analise.mensagensEspera && analise.mensagensEspera.length > 0) {
        mensagensEsperaHTML = `<div class="alvo-espera-output">
            <p><strong>🚨 NERA ATRAVESSADO: 7 CASAS</strong></p>
            ${analise.mensagensEspera.map(msg => `<p class="alvo-atrasado-msg">${msg}</p>`).join('')}
        </div>`;
    }
    
    // --- CONSTRUÇÃO DO OUTPUT PRINCIPAL ---
    let alvosFormatados = '';
    
    if (analise.alvosAposta && analise.alvosAposta.length > 0) {
        alvosFormatados = `🎯 **ALVO DE ENTRADA: ${analise.alvosAposta.join(', ')}**`;
    } else if (analise.alvos && analise.alvos.length > 0) {
         alvosFormatados = `Alvos de Confluência: ${analise.alvos.join(' **OU** ')}`;
    } else {
         alvosFormatados = 'Alvos: N/A';
    }

    outputDiv.innerHTML = `
        ${mensagensEsperaHTML}
        <p>Status: ${analise.status}</p>
        <p>Hash do Histórico: **${hash}** (Para garantir consistência)</p>
        <p>Força da Confluência: **${analise.confianca}**</p>
        <p class="alvo-sugerido-output">${alvosFormatados}</p>
        <h3 class="recomendacao-final">${analise.recomendacao}</h3>
    `;
    
    const logButtons = document.getElementById('log-buttons');
    if (analise.confianca > 0) {
        logButtons.classList.remove('hidden');
    } else {
         logButtons.classList.add('hidden');
    }
}

function atualizarLinhaDoTempo() {
    const timeline = document.getElementById('historico-timeline');
    const saldoDisplay = document.getElementById('current-saldo');
    timeline.innerHTML = '';
    historicoAtual.forEach(num => {
        const item = document.createElement('span');
        const cor = roletaConfig.PROPRIEDADES[num].cor;
        item.className = `num-item ${cor}`;
        item.textContent = num;
        timeline.appendChild(item);
    });
    saldoDisplay.textContent = saldo.toFixed(2);
}

function atualizarLogs() {
    const logTableBody = document.getElementById('log-table-body');
    logTableBody.innerHTML = '';
    logEntradas.forEach(log => {
        const row = logTableBody.insertRow();
        row.insertCell().textContent = log.data;
        row.insertCell().textContent = log.rodada;
        row.insertCell().textContent = log.alvos;
        row.insertCell().textContent = log.valor;
        row.insertCell().textContent = log.resultado;
        row.className = log.resultado === 'GREEN' ? 'log-green' : 'log-red';
    });
}

// Função de inicialização do frontend
window.onload = function() {
    // Inicializar Roleta Interativa (Exemplo de entrada)
    const roletaInput = document.getElementById('roleta-input');
    if (roletaInput) {
        roletaInput.addEventListener('change', (e) => inserirNumeroManual(e.target.value));
    }
    
    // Inicializar Login/Registro (Exemplo básico)
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        fazerLogin(user, pass);
    });
    
    // Inicializar Botões de Ação
    document.getElementById('log-green-btn').addEventListener('click', () => registrarEntrada('GREEN', 10, document.querySelector('.alvo-sugerido-output').textContent));
    document.getElementById('log-red-btn').addEventListener('click', () => registrarEntrada('RED', 10, document.querySelector('.alvo-sugerido-output').textContent));
    document.getElementById('logout-btn').addEventListener('click', fazerLogout);
    document.getElementById('reset-btn').addEventListener('click', resetSessao);

    // Tentar carregar sessão se houver um usuário logado (simulado)
    const lastUser = localStorage.getItem('last_logged_user');
    if (lastUser) {
        // Simulação de login automático
        // iniciarSessao(lastUser);
    }
};
