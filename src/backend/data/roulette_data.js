const roletaConfig = {
    // --- 1. PROPRIEDADES DE CADA NÚMERO ---
    PROPRIEDADES: {
        // Zero (Neutro)
        0: { cor: 'green', duzia: 0, coluna: 0, paridade: 'neutro', terminal: 0, grandeza: 'neutro' },

        // DÚZIA 1 (1-12)
        1: { cor: 'red', duzia: 1, coluna: 1, paridade: 'impar', terminal: 1, grandeza: 'baixo' },
        2: { cor: 'black', duzia: 1, coluna: 2, paridade: 'par', terminal: 2, grandeza: 'baixo' },
        3: { cor: 'red', duzia: 1, coluna: 3, paridade: 'impar', terminal: 3, grandeza: 'baixo' },
        4: { cor: 'black', duzia: 1, coluna: 1, paridade: 'par', terminal: 4, grandeza: 'baixo' },
        5: { cor: 'red', duzia: 1, coluna: 2, paridade: 'impar', terminal: 5, grandeza: 'baixo' },
        6: { cor: 'black', duzia: 1, coluna: 3, paridade: 'par', terminal: 6, grandeza: 'baixo' },
        7: { cor: 'red', duzia: 1, coluna: 1, paridade: 'impar', terminal: 7, grandeza: 'baixo' },
        8: { cor: 'black', duzia: 1, coluna: 2, paridade: 'par', terminal: 8, grandeza: 'baixo' },
        9: { cor: 'red', duzia: 1, coluna: 3, paridade: 'impar', terminal: 9, grandeza: 'baixo' },
        10: { cor: 'black', duzia: 1, coluna: 1, paridade: 'par', terminal: 0, grandeza: 'baixo' },
        11: { cor: 'black', duzia: 1, coluna: 2, paridade: 'impar', terminal: 1, grandeza: 'baixo' },
        12: { cor: 'red', duzia: 1, coluna: 3, paridade: 'par', terminal: 2, grandeza: 'baixo' },

        // DÚZIA 2 (13-24)
        13: { cor: 'black', duzia: 2, coluna: 1, paridade: 'impar', terminal: 3, grandeza: 'medio' },
        14: { cor: 'red', duzia: 2, coluna: 2, paridade: 'par', terminal: 4, grandeza: 'medio' },
        15: { cor: 'black', duzia: 2, coluna: 3, paridade: 'impar', terminal: 5, grandeza: 'medio' },
        16: { cor: 'red', duzia: 2, coluna: 1, paridade: 'par', terminal: 6, grandeza: 'medio' },
        17: { cor: 'black', duzia: 2, coluna: 2, paridade: 'impar', terminal: 7, grandeza: 'medio' },
        18: { cor: 'red', duzia: 2, coluna: 3, paridade: 'par', terminal: 8, grandeza: 'medio' },
        19: { cor: 'red', duzia: 2, coluna: 1, paridade: 'impar', terminal: 9, grandeza: 'medio' },
        20: { cor: 'black', duzia: 2, coluna: 2, paridade: 'par', terminal: 0, grandeza: 'medio' },
        21: { cor: 'red', duzia: 2, coluna: 3, paridade: 'impar', terminal: 1, grandeza: 'medio' },
        22: { cor: 'black', duzia: 2, coluna: 1, paridade: 'par', terminal: 2, grandeza: 'medio' },
        23: { cor: 'red', duzia: 2, coluna: 2, paridade: 'impar', terminal: 3, grandeza: 'medio' },
        24: { cor: 'black', duzia: 2, coluna: 3, paridade: 'par', terminal: 4, grandeza: 'medio' },

        // DÚZIA 3 (25-36)
        25: { cor: 'red', duzia: 3, coluna: 1, paridade: 'impar', terminal: 5, grandeza: 'alto' },
        26: { cor: 'black', duzia: 3, coluna: 2, paridade: 'par', terminal: 6, grandeza: 'alto' },
        27: { cor: 'red', duzia: 3, coluna: 3, paridade: 'impar', terminal: 7, grandeza: 'alto' },
        28: { cor: 'black', duzia: 3, coluna: 1, paridade: 'par', terminal: 8, grandeza: 'alto' },
        29: { cor: 'black', duzia: 3, coluna: 2, paridade: 'impar', terminal: 9, grandeza: 'alto' },
        30: { cor: 'red', duzia: 3, coluna: 3, paridade: 'par', terminal: 0, grandeza: 'alto' },
        31: { cor: 'black', duzia: 3, coluna: 1, paridade: 'impar', terminal: 1, grandeza: 'alto' },
        32: { cor: 'red', duzia: 3, coluna: 2, paridade: 'par', terminal: 2, grandeza: 'alto' },
        33: { cor: 'black', duzia: 3, coluna: 3, paridade: 'impar', terminal: 3, grandeza: 'alto' },
        34: { cor: 'red', duzia: 3, coluna: 1, paridade: 'par', terminal: 4, grandeza: 'alto' },
        35: { cor: 'black', duzia: 3, coluna: 2, paridade: 'impar', terminal: 5, grandeza: 'alto' },
        36: { cor: 'red', duzia: 3, coluna: 3, paridade: 'par', terminal: 6, grandeza: 'alto' }
    },

    // --- 2. VIZINHOS DE CILINDRO (Vizinhos de 1ª ordem da roleta europeia) ---
    VIZINHOS_CILINDRO: {
        0: [32, 26], 1: [33, 20], 2: [21, 25], 3: [35, 26], 4: [19, 21], 5: [10, 24], 6: [34, 27], 7: [29, 28], 
        8: [30, 23], 9: [31, 22], 10: [23, 5], 11: [36, 30], 12: [28, 35], 13: [27, 36], 14: [20, 31], 15: [32, 19], 
        16: [24, 33], 17: [25, 34], 18: [22, 29], 19: [15, 4], 20: [1, 14], 21: [4, 2], 22: [9, 18], 23: [8, 10], 
        24: [5, 16], 25: [2, 17], 26: [3, 0], 27: [6, 13], 28: [7, 12], 29: [18, 7], 30: [11, 8], 31: [14, 9], 
        32: [0, 15], 33: [16, 1], 34: [17, 6], 35: [12, 3], 36: [13, 11]
    },

    // --- 3. ESPELHOS FIXOS (Base Estelar) ---
    ESPELHOS_FIXOS: {
        1: 10, 2: 20, 3: 30, 4: 13, 5: 14, 6: 9, 7: 16, 8: 17, 11: 34, 12: 21, 15: 24, 18: 27, 19: 28, 22: 31, 23: 32, 
        25: 35, 26: 36, 29: 33, 31: 22, 32: 23, 33: 29, 34: 11, 35: 25, 36: 26, 
        // Adicionando reversos para facilitar a busca (melhoria de performance na equivalência)
        10: 1, 20: 2, 30: 3, 13: 4, 14: 5, 9: 6, 16: 7, 17: 8, 21: 12, 24: 15, 27: 18, 28: 19
    },

    // --- 4. FUNÇÃO DE EQUIVALÊNCIA ---
    VerificarEquivalencia: function(num1, num2) {
        const config = this; 
        
        if (num1 === num2) return true; 

        // 2. Espelhos Fixos
        if (config.ESPELHOS_FIXOS[num1] === num2 || config.ESPELHOS_FIXOS[num2] === num1) {
            return true;
        }

        // 3. Vizinhos de Cilindro
        const vizinhos1 = config.VIZINHOS_CILINDRO[num1] || [];
        if (vizinhos1.includes(num2)) {
            return true;
        }

        const prop1 = config.PROPRIEDADES[num1];
        const prop2 = config.PROPRIEDADES[num2];

        if (!prop1 || !prop2) return false;

        // 4. Terminais Comuns
        if (prop1.terminal === prop2.terminal) {
            return true;
        }

        // 5. Propriedade Dupla Comum (Cor E Dúzia)
        if (prop1.cor === prop2.cor && prop1.duzia === prop2.duzia && prop1.duzia !== 0) {
             return true;
        }
        
        return false;
    }
};

// Exporta o objeto de configuração para uso no frontend/backend
const PROPRIEDADES = roletaConfig.PROPRIEDADES;
const VIZINHOS_CILINDRO = roletaConfig.VIZINHOS_CILINDRO;
const ESPELHOS_FIXOS = roletaConfig.ESPELHOS_FIXOS;
// Cria a função de Equivalência que já sabe onde buscar os dados
const VerificarEquivalencia = roletaConfig.VerificarEquivalencia.bind(roletaConfig); 

// Para o navegador (global scope)
const roletaData = roletaConfig;
