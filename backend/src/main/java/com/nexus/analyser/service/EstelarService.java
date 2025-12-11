// ======================================================
// CONFIGURAÇÕES E DADOS DE SUPORTE
// ======================================================

const MIN_ESTELAR = 9;   
const MIN_SEQUENCIA = 5; 
const MIN_CDC = 20;      
const MIN_ANALISES_NERA = 3; // Mínimo de ocorrências do Alvo_X para Convergência

// Mapeamento de Regiões do Cilindro (Voisin, Tiers, Orphelin) - MANTIDO
const REGIOES_VOT = {
    Voisin: [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25], 
    Tiers: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],
    Orphelin: [17, 34, 6, 1, 20, 14, 31, 9] 
};

// Mapeamento de Vizinhos na Race (Simplificado) - MANTIDO
const VIZINHOS_RACE = {
    12: [28, 35] 
};

// ... (Funções Auxiliares: getGrupoDZC, _getRegiaoVOT) ...
function getGrupoDZC(numero, roletaData) {
    const props = roletaData.PROPRIEDADES[numero];
    if (!props) return { duzia: 0, coluna: 0, regiaoVOT: null };

    return {
        duzia: props.duzia,
        coluna: props.coluna,
        regiaoVOT: _getRegiaoVOT(numero)
    };
}

function _getRegiaoVOT(numero) {
    if (REGIOES_VOT.Voisin.includes(numero)) return 'Voisin';
    if (REGIOES_VOT.Tiers.includes(numero)) return 'Tiers';
    if (REGIOES_VOT.Orphelin.includes(numero)) return 'Orphelin';
    return null;
}
// Note: Assumindo que Vizinhos_Roleta e getEspelho estão acessíveis globalmente (roulette_data.js)

// ======================================================
// MÓDULO NERA: PROCESSAMENTO (Prioridades 2 e 3)
// ======================================================

function Processar_Resultado_NERA(historico, Novo_Numero, Tabela_Alvos, NERA_Atrasados, roletaData) {
    const Alvo_X = Novo_Numero;
    const Contexto_Pre = historico.slice(0, 3).reverse(); 

    const N_Menos_1 = historico[0]; 
    const espelhoAlvo = getEspelho(Alvo_X); 
    
    // 🔴 Regra de Invalidez: Veio do Espelho (Inverso)
    const isInvalid = (N_Menos_1 !== undefined && N_Menos_1 === espelhoAlvo); 

    // --- RASTREIO DE ATRAVESSADO/ATRASADO (7 CASAS) ---
    if (isInvalid) {
        if (!(Alvo_X in NERA_Atrasados)) {
            NERA_Atrasados[Alvo_X] = {
                rodadaInvalidacao: historico.length + 1, 
                alvo: Alvo_X,
                status: 'Aguardando Recuperação'
            };
        }
    }
    
    // Remove o alvo do atraso se ele sair de novo (gatilho limpo)
    if (!isInvalid && (Alvo_X in NERA_Atrasados)) {
        delete NERA_Atrasados[Alvo_X];
    }
    // ----------------------------------------


    // Criação do Registro de Análise (Para a convergência principal MERA)
    const Analise_Registro = { 
        "Rodada": historico.length + 1,
        "Contexto_Pre": Contexto_Pre, 
        "Contexto_Pos": [null, null, null],
        "Valid": !isInvalid 
    };

    // 1. Tenta preencher Contexto_Pos nas análises pendentes:
    for (const alvo in Tabela_Alvos) {
        for (const analise of Tabela_Alvos[alvo]) {
            if (analise.Valid) { 
                const posIndex = analise.Contexto_Pos.findIndex(val => val === null);
                if (posIndex !== -1) {
                    analise.Contexto_Pos[posIndex] = Alvo_X;
                }
            }
        }
    }
    
    // 2. Adiciona um novo registro para o Novo_Numero (Alvo_X):
    if (Alvo_X in Tabela_Alvos) {
        Tabela_Alvos[Alvo_X].push(Analise_Registro);
    } else {
        Tabela_Alvos[Alvo_X] = [Analise_Registro];
    }
    
    return { Tabela_Alvos, NERA_Atrasados };
}

function analisarRecuperacaoNERA(historico, NERA_Atrasados) {
    const rodadaAtual = historico.length;
    const alvoRecuperacao = {
        alvosAposta: null,
        confianca: 0,
        fatores: [],
        statusEspera: []
    };
    
    for (const alvo in NERA_Atrasados) {
        const atrasado = NERA_Atrasados[alvo];
        const alvoNum = parseInt(alvo);
        const rodadaAlvo = atrasado.rodadaInvalidacao + 7;
        
        if (rodadaAtual >= rodadaAlvo) {
            // Gatilho de 7 Casas ACIONADO
            const vizinhosAposta = Vizinhos_Roleta(alvoNum, 2);
            
            alvoRecuperacao.alvosAposta = [...vizinhosAposta, alvoNum];
            alvoRecuperacao.confianca = 8;
            alvoRecuperacao.fatores.push(`[NERA RECUPERAÇÃO] Alvo ${alvoNum} atingiu a 7ª casa após pagamento antecipado.`);
            
            delete NERA_Atrasados[alvo]; 
            return alvoRecuperacao; 
        } else {
            // Gatilho em ESPERA
            const rodadasFaltantes = rodadaAlvo - rodadaAtual;
            const mensagem = `🔴 ALVO ATRASADO ${alvoNum}: Aguardando **${rodadasFaltantes} rodada(s)** para recuperação (Total 7).`;
            alvoRecuperacao.statusEspera.push(mensagem);
        }
    }
    
    return alvoRecuperacao;
}


function analisarConvergenciaNERA(historico, Tabela_Alvos) {
    
    for (const Alvo_X in Tabela_Alvos) {
        const analisesValidas = Tabela_Alvos[Alvo_X].filter(a => a.Valid);
        
        if (analisesValidas.length >= MIN_ANALISES_NERA) {
            
            const contagemFrequencia = {};
            
            analisesValidas.forEach(analise => {
                const todosContextos = [...analise.Contexto_Pre, ...analise.Contexto_Pos].filter(n => n !== null);
                
                todosContextos.forEach(numeroContexto => {
                    contagemFrequencia[numeroContexto] = (contagemFrequencia[numeroContexto] || 0) + 1;
                    
                    const vizinhos = Vizinhos_Roleta(numeroContexto, 2); 
                    vizinhos.forEach(v => {
                        contagemFrequencia[v] = (contagemFrequencia[v] || 0) + 0.5;
                    });
                });
            });
            
            let maiorFrequencia = 0;
            let alvoConverge = null;
            
            for (const numStr in contagemFrequencia) {
                const num = parseInt(numStr);
                const freq = contagemFrequencia[numStr];
                
                if (num === parseInt(Alvo_X)) continue; 
                
                if (freq > maiorFrequencia) {
                    maiorFrequencia = freq;
                    alvoConverge = num;
                }
            }

            if (alvoConverge !== null && maiorFrequencia >= (MIN_ANALISES_NERA * 2.5)) {
                 const vizinhosAposta = Vizinhos_Roleta(alvoConverge, 2);
                 const alvosFinais = [...vizinhosAposta, alvoConverge].filter((n, i, a) => a.indexOf(n) === i);
                 
                 return {
                    alvosAposta: alvosFinais,
                    confianca: Math.min(10, Math.floor(maiorFrequencia * 1.5)), 
                    fatores: [`[NERA] Convergência de ${Alvo_X} (3x) em ${alvoConverge}. Frequência: ${maiorFrequencia.toFixed(1)}`]
                 };
            }
        }
    }
    
    return null; 
}


// ======================================================
// MÓDULO ORION: BUSCA POR QUEBRA DE CICLO (Prioridade 1)
// ... (Código do módulo analisarOrion - MANTIDO) ...
function analisarOrion(historico, roletaData) {
    // Código da análise Orion...
    return null; // Retorna { alvosAposta, confianca, fatores } ou null
}


// ======================================================
// MÓDULO DE SEQUÊNCIAS (Prioridade 4)
// ... (Código do módulo analisarSequencias - MANTIDO) ...
function analisarSequencias(historico, roletaData) {
    // Código de análise de Sequências (Dúzia, Coluna, VOT)...
    return { alvos: [], confianca: 0, fatores: [] };
}


// ======================================================
// FUNÇÃO PRINCIPAL: CONFLUÊNCIA NEXUS
// ======================================================

function analisarEstelar(historico, roletaData, Tabela_Alvos_NERA, NERA_Alvos_Atrasados) {
    
    const CONF_MAX = 20; 
    const resultados = {
        status: `Análise NEXUS em Monitoramento. Força: 0/${CONF_MAX}.`,
        confianca: 0,
        fatores: [],
        alvos: [],
        alvosAposta: null,
        recomendacao: 'Aguarde a Confluência Estelar.',
        recomendacaoOrion: null,
        recomendacaoNERA: null,
        recomendacaoRecuperacao: null,
        mensagensEspera: [] 
    };
    
    if (historico.length < MIN_CDC) {
         resultados.status = `Aguardando ${MIN_CDC - historico.length} resultados para análise completa.`;
         return resultados;
    }

    // A. ANÁLISE ORION (PRIORIDADE 1)
    const resultadoOrion = analisarOrion(historico, roletaData);
    if (resultadoOrion) {
        resultados.alvosAposta = resultadoOrion.alvosAposta;
        resultados.confianca += resultadoOrion.confianca;
        resultados.fatores.push(...resultadoOrion.fatores);
        resultados.recomendacaoOrion = `GATILHO ORION ATIVO! Alvo Máximo: ${resultados.alvosAposta.join(', ')}.`;
    }

    // B. ANÁLISE SEQUENCIAL (PRIORIDADE 4, contribui com confiança/alvos)
    const resultadoSequencia = analisarSequencias(historico, roletaData);
    resultados.alvos.push(...resultadoSequencia.alvos);
    resultados.confianca += resultadoSequencia.confianca;
    resultados.fatores.push(...resultadoSequencia.fatores);

    
    // C. GATILHO NERA RECUPERAÇÃO (PRIORIDADE 2 - Execução e Checagem)
    const resultadoRecuperacao = analisarRecuperacaoNERA(historico, NERA_Alvos_Atrasados);
    resultados.mensagensEspera = resultadoRecuperacao.statusEspera; 

    if (resultadoRecuperacao.alvosAposta && !resultados.alvosAposta) { // Usa o alvo se Orion não tiver acionado
        resultados.alvosAposta = resultadoRecuperacao.alvosAposta;
        resultados.confianca += resultadoRecuperacao.confianca;
        resultados.fatores.push(...resultadoRecuperacao.fatores);
        resultados.recomendacaoRecuperacao = `GATILHO NERA RECUPERAÇÃO ATIVO! Aposta em ${resultados.alvosAposta.join(', ')}.`;
    }

    // D. GATILHO NERA CONVERGÊNCIA (MERA) (PRIORIDADE 3 - Execução e Checagem)
    const resultadoNERA = analisarConvergenciaNERA(historico, Tabela_Alvos_NERA);
    
    if (resultadoNERA && !resultados.alvosAposta) { // Usa o alvo se Orion e Recuperação não acionaram
        resultados.alvosAposta = resultadoNERA.alvosAposta;
        resultados.confianca += resultadoNERA.confianca;
        resultados.fatores.push(...resultadoNERA.fatores);
        resultados.recomendacaoNERA = `GATILHO NERA CONVERGÊNCIA ATIVO. Convergência forte em ${resultados.alvosAposta.join(', ')}.`;
    }


    // --- DECISÃO FINAL BASEADA NA PRIORIDADE ---

    if (resultados.recomendacaoOrion) {
        resultados.recomendacao = resultados.recomendacaoOrion;
        resultados.status = `GATILHO ORION ATIVO. Confluência Máxima. Força: ${resultados.confianca}/${CONF_MAX}.`;
    } else if (resultados.recomendacaoRecuperacao) { 
         resultados.recomendacao = resultados.recomendacaoRecuperacao;
         resultados.status = `GATILHO NERA RECUPERAÇÃO. Força: ${resultados.confianca}/${CONF_MAX}.`;
    } else if (resultados.recomendacaoNERA) { 
         resultados.recomendacao = resultados.recomendacaoNERA;
         resultados.status = `GATILHO NERA CONVERGÊNCIA. Força: ${resultados.confianca}/${CONF_MAX}.`;
    } else if (resultados.confianca >= 10 && resultados.alvos.length > 1) {
        resultados.recomendacao = `Confluência forte em gatilhos simples: ${resultados.alvos.join(' **OU** ')}.`;
        resultados.status = `Análise NEXUS em Alto Monitoramento. Força: ${resultados.confianca}/${CONF_MAX}.`;
    } else {
        resultados.status = `Análise NEXUS em Monitoramento. Força: ${resultados.confianca}/${CONF_MAX}.`;
        // Exibe mensagem de espera se houver alvos atrasados
        if (resultados.mensagensEspera.length > 0) {
            resultados.status = `Análise NEXUS: ALVOS EM ESPERA.`;
        }
    }
    
    return resultados; 
}
