const roletaConfig = {
    // [CUIDADO: ESTA ORDEM É CRUCIAL] Ordem dos números na roda de roleta europeia (sentido horário)
    VIZINHOS_RODA: [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26],
    
    // Propriedades existentes (Cor, Dúzia, Coluna, etc.)
    PROPRIEDADES: {
        0: { cor: 'green', paridade: 'par', alta_baixa: 'n/a', duzia: 0, coluna: 0 },
        1: { cor: 'red', paridade: 'impar', alta_baixa: 'baixa', duzia: 1, coluna: 1 },
        2: { cor: 'black', paridade: 'par', alta_baixa: 'baixa', duzia: 1, coluna: 2 },
        3: { cor: 'red', paridade: 'impar', alta_baixa: 'baixa', duzia: 1, coluna: 3 },
        4: { cor: 'black', paridade: 'par', alta_baixa: 'baixa', duzia: 1, coluna: 1 },
        5: { cor: 'red', paridade: 'impar', alta_baixa: 'baixa', duzia: 1, coluna: 2 },
        6: { cor: 'black', paridade: 'par', alta_baixa: 'baixa', duzia: 1, coluna: 3 },
        7: { cor: 'red', paridade: 'impar', alta_baixa: 'baixa', duzia: 1, coluna: 1 },
        8: { cor: 'black', paridade: 'par', alta_baixa: 'baixa', duzia: 1, coluna: 2 },
        9: { cor: 'red', paridade: 'impar', alta_baixa: 'baixa', duzia: 1, coluna: 3 },
        10: { cor: 'black', paridade: 'par', alta_baixa: 'baixa', duzia: 1, coluna: 1 },
        11: { cor: 'black', paridade: 'impar', alta_baixa: 'baixa', duzia: 1, coluna: 2 },
        12: { cor: 'red', paridade: 'par', alta_baixa: 'baixa', duzia: 1, coluna: 3 },
        13: { cor: 'black', paridade: 'impar', alta_baixa: 'baixa', duzia: 2, coluna: 1 },
        14: { cor: 'red', paridade: 'par', alta_baixa: 'baixa', duzia: 2, coluna: 2 },
        15: { cor: 'black', paridade: 'impar', alta_baixa: 'baixa', duzia: 2, coluna: 3 },
        16: { cor: 'red', paridade: 'par', alta_baixa: 'baixa', duzia: 2, coluna: 1 },
        17: { cor: 'black', paridade: 'impar', alta_baixa: 'baixa', duzia: 2, coluna: 2 },
        18: { cor: 'red', paridade: 'par', alta_baixa: 'baixa', duzia: 2, coluna: 3 },
        19: { cor: 'red', paridade: 'impar', alta_baixa: 'alta', duzia: 2, coluna: 1 },
        20: { cor: 'black', paridade: 'par', alta_baixa: 'alta', duzia: 2, coluna: 2 },
        21: { cor: 'red', paridade: 'impar', alta_baixa: 'alta', duzia: 2, coluna: 3 },
        22: { cor: 'black', paridade: 'par', alta_baixa: 'alta', duzia: 2, coluna: 1 },
        23: { cor: 'red', paridade: 'impar', alta_baixa: 'alta', duzia: 2, coluna: 2 },
        24: { cor: 'black', paridade: 'par', alta_baixa: 'alta', duzia: 2, coluna: 3 },
        25: { cor: 'red', paridade: 'impar', alta_baixa: 'alta', duzia: 3, coluna: 1 },
        26: { cor: 'black', paridade: 'par', alta_baixa: 'alta', duzia: 3, coluna: 2 },
        27: { cor: 'red', paridade: 'impar', alta_baixa: 'alta', duzia: 3, coluna: 3 },
        28: { cor: 'black', paridade: 'par', alta_baixa: 'alta', duzia: 3, coluna: 1 },
        29: { cor: 'black', paridade: 'impar', alta_baixa: 'alta', duzia: 3, coluna: 2 },
        30: { cor: 'red', paridade: 'par', alta_baixa: 'alta', duzia: 3, coluna: 3 },
        31: { cor: 'black', paridade: 'impar', alta_baixa: 'alta', duzia: 3, coluna: 1 },
        32: { cor: 'red', paridade: 'par', alta_baixa: 'alta', duzia: 3, coluna: 2 },
        33: { cor: 'black', paridade: 'impar', alta_baixa: 'alta', duzia: 3, coluna: 3 },
        34: { cor: 'red', paridade: 'par', alta_baixa: 'alta', duzia: 3, coluna: 1 },
        35: { cor: 'black', paridade: 'impar', alta_baixa: 'alta', duzia: 3, coluna: 2 },
        36: { cor: 'red', paridade: 'par', alta_baixa: 'alta', duzia: 3, coluna: 3 }
    }
};

/**
 * Retorna os vizinhos de um número na roda da roleta (não na mesa).
 * @param {number} numero O número central.
 * @param {number} casasProx Quantas casas para cada lado buscar (e.g., 2 para Tiers).
 * @returns {Array<number>} Lista de vizinhos (sem incluir o número central).
 */
function Vizinhos_Roleta(numero, casasProx = 2) {
    const vizinhos = new Set();
    const roda = roletaConfig.VIZINHOS_RODA;
    const index = roda.indexOf(numero);

    if (index === -1) return [];

    const total = roda.length;

    for (let i = 1; i <= casasProx; i++) {
        // Sentido horário (Direita)
        const indexDireita = (index + i) % total;
        vizinhos.add(roda[indexDireita]);

        // Sentido anti-horário (Esquerda)
        const indexEsquerda = (index - i + total) % total;
        vizinhos.add(roda[indexEsquerda]);
    }

    return Array.from(vizinhos);
}

/**
 * Retorna o Espelho (diretamente oposto) de um número na roda.
 * @param {number} numero 
 * @returns {number} O número espelho.
 */
function getEspelho(numero) {
    const roda = roletaConfig.VIZINHOS_RODA;
    const total = roda.length; // 37 números
    const index = roda.indexOf(numero);
    
    if (index === -1) return null;

    // Oposto na roda (index + total / 2) % total
    const indexEspelho = Math.floor((index + total / 2)) % total;
    return roda[indexEspelho];
}
