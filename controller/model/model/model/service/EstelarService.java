// A função VerificarEquivalencia já estará disponível no escopo do HTML.

/**
 * Realiza a Análise Estelar para encontrar a Trinca de Repetição e o Alvo Nexus.
 * @param {Array<number>} linhaDoTempo - O histórico sequencial de números da roleta.
 * @param {object} config - O objeto roletaConfig (dados da roleta).
 * @returns {object} - Resultado da análise (confiança, alvos e recomendação).
 */
function analisarEstelar(linhaDoTempo, config) {
    const minHistorico = 9;

    if (linhaDoTempo.length < minHistorico) {
        return {
            confianca: 0,
            status: `Aguardando mais ${minHistorico - linhaDoTempo.length} números para iniciar a Análise Estelar.`,
            alvos: []
        };
    }

    // Analisa os últimos 30 números, invertido (mais recente no índice 0).
    const historicoRecente = linhaDoTempo.slice(-30).reverse(); 

    // Busca a Trinca de Repetição (A -> B -> C equivalente)
    const trinca = buscarTrincaEquivalente(historicoRecente, config);

    if (!trinca) {
        return {
            confianca: 1,
            status: "Nenhuma Trinca de Repetição Clara (A -> B -> C) identificada no histórico recente.",
            alvos: []
        };
    }

    // Se a Trinca for encontrada, gera a sugestão de Alvo.
    return gerarAlvoNexus(trinca, config);
}


function buscarTrincaEquivalente(historicoRecente, config) {
    // Itera para encontrar A, B, C
    for (let i = 0; i < historicoRecente.length - 2; i++) {
        const C = historicoRecente[i];     
        const B = historicoRecente[i + 1]; 
        const A = historicoRecente[i + 2]; 

        // Usa a função de Equivalência do roulette_data.js
        const eqCB = VerificarEquivalencia(C, B, config);
        const eqCA = VerificarEquivalencia(C, A, config);
        const eqAB = VerificarEquivalencia(A, B, config);
        
        // Trinca Forte: Pelo menos 2 das 3 equivalências ocorrem.
        let forcaTrinca = 0;
        if (eqAB) forcaTrinca++;
        if (eqCB) forcaTrinca++;
        if (eqCA) forcaTrinca++;

        if (forcaTrinca >= 2) {
            return { A, B, C, forca: forcaTrinca };
        }
    }

    return null;
}


function gerarAlvoNexus(trinca, config) {
    const C = trinca.C;
    const alvos = [];

    // 1. Alvo Principal: Espelho Fixo de C
    const espelhoC = config.ESPELHOS_FIXOS[C];
    if (espelhoC) {
        alvos.push(espelhoC);
    }

    // 2. Alvo Secundário: Vizinhos de C
    const vizinhosC = config.VIZINHOS_CILINDRO[C] || [];
    alvos.push(...vizinhosC);

    // 3. Alvo de Proteção: O Terminal de C (todos os outros números com o mesmo terminal)
    const terminalC = config.PROPRIEDADES[C].terminal;
    for (const num in config.PROPRIEDADES) {
        if (config.PROPRIEDADES[num].terminal === terminalC && parseInt(num) !== C && parseInt(num) !== 0) {
            alvos.push(parseInt(num));
        }
    }
    
    // Remove duplicatas e o próprio C
    const alvosFinais = [...new Set(alvos)].filter(n => n !== C);

    return {
        confianca: trinca.forca * 3, 
        status: `Trinca de Repetição (A:${trinca.A}, B:${trinca.B}, C:${trinca.C}) identificada.`,
        alvos: alvosFinais,
        recomendacao: "Aguardar 1 ou 2 giros para confirmar a quebra da Trinca e entrar no próximo Echo de C."
    };
}
