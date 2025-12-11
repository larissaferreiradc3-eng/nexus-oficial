// ======================================================
// CONFIGURAÇÕES GLOBAIS
// ======================================================

const HISTORICO_MAX = 100; // Limite de números no histórico.

// ======================================================
// GESTÃO DE USUÁRIOS SIMPLIFICADA (USANDO localStorage)
// ======================================================

function registrarUsuario(user, pass) {
    const loginMessage = document.getElementById('login-message');
    loginMessage.style.color = '#cf6679'; // Reset para cor de erro

    if (!user || !pass) {
        loginMessage.textContent = 'Preencha o usuário e a senha para se registrar.';
        return;
    }

    if (localStorage.getItem(user)) {
        loginMessage.textContent = `Erro: O usuário "${user}" já está registrado.`;
        return;
    }

    // Salva o usuário e senha (simplesmente como texto, sem hash)
    localStorage.setItem(user, pass);
    loginMessage.textContent = `Sucesso! O usuário "${user}" foi registrado. Faça o login.`;
    loginMessage.style.color = '#03dac6'; // Cor ciano para sucesso
}

function fazerLogin(user, pass) {
    const loginMessage = document.getElementById('login-message');
    loginMessage.style.color = '#cf6679'; // Cor padrão (vermelha) para erro

    if (!user || !pass) {
        loginMessage.textContent = 'Preencha o usuário e a senha.';
        return;
    }

    // Verifica se o usuário existe no localStorage E se a senha confere
    if (localStorage.getItem(user) === pass) {
        iniciarSessao(user);
    } else {
        loginMessage.textContent = 'Usuário ou senha inválidos. Tente novamente.';
    }
}

window.iniciarSessao = function(username) {
    document.getElementById('login-screen').classList.add('hidden'); 
    document.getElementById('main-content').classList.remove('hidden'); 
    document.getElementById('current-user').textContent = `Usuário: ${username}`;
    document.getElementById('current-saldo').textContent = (localStorage.getItem('saldo') || '1000.00'); // Saldo padrão de 1000
    
    // Inicia o estado da roleta (se houver dados salvos)
    const historicoSalvo = JSON.parse(localStorage.getItem('historico_roleta')) || [];
    historicoSalvo.forEach(num => adicionarNumeroAoHistoricoUI(num, false));
    
    // Inicializa a lógica NERA com os dados carregados
    processarNovoResultado(historicoSalvo);

    // Carregar logs da sessão
    carregarLogsSessao();
}

function encerrarSessao() {
    // Esconde o conteúdo principal e mostra a tela de login
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-message').textContent = 'Sessão encerrada com sucesso.';
}

// ======================================================
// LÓGICA DE INTERFACE E EVENTOS NERA
// ======================================================

let roletaHistorico = [];
let logsApostas = [];

function adicionarNumeroAoHistoricoUI(numero, animar = true) {
    const timeline = document.getElementById('historico-timeline');
    const divNum = document.createElement('div');
    
    // Determina a cor do número (mantida a lógica de cor padrão)
    let cor;
    if (numero === 0) cor = 'zero';
    else if (numero >= 1 && numero <= 10 && numero % 2 !== 0) cor = 'red';
    else if (numero >= 1 && numero <= 10 && numero % 2 === 0) cor = 'black';
    else if (numero >= 11 && numero <= 18 && numero % 2 !== 0) cor = 'black';
    else if (numero >= 11 && numero <= 18 && numero % 2 === 0) cor = 'red';
    else if (numero >= 19 && numero <= 28 && numero % 2 !== 0) cor = 'red';
    else if (numero >= 19 && numero <= 28 && numero % 2 === 0) cor = 'black';
    else if (numero >= 29 && numero <= 36 && numero % 2 !== 0) cor = 'black';
    else if (numero >= 29 && numero <= 36 && numero % 2 === 0) cor = 'red';
    else cor = 'desconhecida'; // Deve ser zero

    divNum.className = `historico-numero ${cor}`;
    divNum.textContent = numero;

    if (animar) {
        divNum.classList.add('new-number-animation');
    }

    // Adiciona no início da linha do tempo
    if (timeline.firstChild) {
        timeline.insertBefore(divNum, timeline.firstChild);
    } else {
        timeline.appendChild(divNum);
    }
    
    // Limita o histórico visual
    while (timeline.children.length > HISTORICO_MAX) {
        timeline.removeChild(timeline.lastChild);
    }
}

function processarNovoResultado(historico) {
    roletaHistorico = historico;
    localStorage.setItem('historico_roleta', JSON.stringify(roletaHistorico));

    const analiseDiv = document.getElementById('analise-sugerida');
    const logButtonsDiv = document.getElementById('log-buttons');

    if (roletaHistorico.length < 20) {
        analiseDiv.innerHTML = `<p>Status: Aguardando **${20 - roletaHistorico.length}** resultados para análise completa.</p>`;
        logButtonsDiv.classList.add('hidden');
        return;
    }

    try {
        // Chamada ao Algoritmo NERA (do estelar.js)
        const resultadoNERA = AnaliseEstelarNERA.analisar(roletaHistorico);

        if (resultadoNERA.status === 'CONVERGENCIA') {
            logButtonsDiv.classList.remove('hidden');
            
            let htmlAlvos = '<ul>';
            resultadoNERA.alvos.forEach(alvo => {
                htmlAlvos += `<li>**Alvo:** ${alvo.nome} (${alvo.numeros.join(', ')})</li>`;
            });
            htmlAlvos += '</ul>';

            analiseDiv.innerHTML = `
                <p class="status-success">✅ **SINAL DE CONVERGÊNCIA (NERA)**</p>
                <p><strong>Ciclo Estelar:</strong> ${resultadoNERA.cicloEstelar}</p>
                <p><strong>Alvos Sugeridos:</strong></p>
                ${htmlAlvos}
                <p>⚠️ **ATENÇÃO:** O sistema sugere ${resultadoNERA.alvos.length} fichas no total (1 ficha por alvo). Registre a aposta abaixo.</p>
            `;
            // Armazena a última sugestão no localStorage para o registro da aposta
            localStorage.setItem('ultima_sugestao', JSON.stringify(resultadoNERA));

        } else if (resultadoNERA.status === 'RECUPERACAO') {
            logButtonsDiv.classList.add('hidden');
            analiseDiv.innerHTML = `
                <p class="status-warning">🔶 **FASE DE RECUPERAÇÃO**</p>
                <p>Motivo: ${resultadoNERA.motivo}</p>
                <p>Aguarde o próximo ciclo para um novo sinal de convergência.</p>
            `;
        } else {
            logButtonsDiv.classList.add('hidden');
            analiseDiv.innerHTML = `
                <p class="status-error">🔴 **INVALIDEZ DE SINAL**</p>
                <p>Motivo: ${resultadoNERA.motivo}</p>
                <p>Aguarde o próximo ciclo.</p>
            `;
        }
    } catch (e) {
        analiseDiv.innerHTML = `<p class="status-error">🔴 **ERRO:** Falha ao executar o algoritmo NERA.</p>`;
        console.error("Erro na análise NERA:", e);
    }
}

// ======================================================
// LÓGICA DE SALDO E LOGS
// ======================================================

function atualizarSaldo(valor) {
    let saldo = parseFloat(localStorage.getItem('saldo')) || 1000.00;
    saldo += valor;
    localStorage.setItem('saldo', saldo.toFixed(2));
    document.getElementById('current-saldo').textContent = saldo.toFixed(2);
}

function registrarAposta(tipo) {
    const sugestao = JSON.parse(localStorage.getItem('ultima_sugestao'));
    if (!sugestao) return;
    
    const valorAposta = sugestao.alvos.length * 1.0; // 1 ficha por alvo

    let resultado;
    let corResultado;
    let valorGanho = 0;

    if (tipo === 'GREEN') {
        // Vitória (o retorno em trincas é 11x)
        valorGanho = valorAposta * 11.0; 
        resultado = 'GREEN (Vitória)';
        corResultado = 'green';
        atualizarSaldo(valorGanho - valorAposta); // Ganho líquido
    } else {
        // Perda
        valorGanho = -valorAposta;
        resultado = 'RED (Perda)';
        corResultado = 'red';
        atualizarSaldo(-valorAposta); // Perda
    }

    const novoLog = {
        data: new Date().toLocaleString(),
        rodada: roletaHistorico.length,
        alvos: sugestao.alvos.map(a => `${a.nome} (${a.numeros.join(',')})`).join('; '),
        valor: valorAposta.toFixed(2),
        resultado: resultado,
        cor: corResultado
    };

    logsApostas.unshift(novoLog); // Adiciona no início
    localStorage.setItem('logs_apostas', JSON.stringify(logsApostas));
    carregarLogsSessao();
}

function carregarLogsSessao() {
    logsApostas = JSON.parse(localStorage.getItem('logs_apostas')) || [];
    const tableBody = document.getElementById('log-table-body');
    tableBody.innerHTML = '';

    logsApostas.forEach(log => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = log.data.split(' ')[1];
        row.insertCell().textContent = log.rodada;
        row.insertCell().textContent = log.alvos;
        row.insertCell().textContent = `R$ ${log.valor}`;
        row.insertCell().innerHTML = `<span class="log-result ${log.cor}">${log.resultado}</span>`;
    });
}

function resetarSessao() {
    if (confirm("Tem certeza que deseja resetar o histórico, logs e saldo?")) {
        localStorage.removeItem('historico_roleta');
        localStorage.removeItem('logs_apostas');
        localStorage.setItem('saldo', '1000.00'); // Reseta para o saldo padrão
        window.location.reload(); // Recarrega a página para limpar o UI
    }
}

// ======================================================
// EVENT LISTENERS GERAIS
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. LISTENERS DE LOGIN E REGISTRO
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        fazerLogin(username, password); 
    });

    document.getElementById('register-btn').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        registrarUsuario(username, password);
    });

    document.getElementById('logout-btn').addEventListener('click', encerrarSessao);

    // 2. LISTENER DE ENTRADA DE NÚMERO
    const roletaInput = document.getElementById('roleta-input');
    roletaInput.addEventListener('change', function() {
        const novoNum = parseInt(this.value);
        if (novoNum >= 0 && novoNum <= 36) {
            adicionarNumeroAoHistoricoUI(novoNum);
            roletaHistorico.unshift(novoNum); // Adiciona no início
            
            processarNovoResultado(roletaHistorico);
            this.value = ''; // Limpa o campo após o registro
        }
    });

    // 3. LISTENERS DE LOG DE APOSTA
    document.getElementById('log-green-btn').addEventListener('click', () => registrarAposta('GREEN'));
    document.getElementById('log-red-btn').addEventListener('click', () => registrarAposta('RED'));

    // 4. LISTENER DE RESET
    document.getElementById('reset-btn').addEventListener('click', resetarSessao);
});
