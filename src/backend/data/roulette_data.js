// --- PROPRIEDADES FIXAS DA ROLETA EUROPEIA (PARA CADA NÚMERO) ---
const roletaConfig = {
    // Mapeamento simplificado para exemplo (você pode expandir)
    PROPRIEDADES: {
        0: { cor: 'green', duzia: 0, coluna: 0, paridade: 'neutro', grandeza: 'neutro' },
        1: { cor: 'red', duzia: 1, coluna: 1, paridade: 'impar', grandeza: 'baixo', terminal: 1 },
        2: { cor: 'black', duzia: 1, coluna: 2, paridade: 'par', grandeza: 'baixo', terminal: 2 },
        // ... (Adicionar o mapeamento de todos os 36 números aqui)
        9: { cor: 'red', duzia: 1, coluna: 3, paridade: 'impar', grandeza: 'baixo', terminal: 9 },
        // ...
    },
    
    // --- VIZINHOS (1 passo na roda) ---
    // Mapear cada número para seus vizinhos no cilindro (não na grade)
    VIZINHOS_CILINDRO: {
        // ... (Exemplo: 9: [22, 31])
        9: [22, 31],
        // ...
    },

    // --- ESPELHOS FIXOS (Base Estelar) ---
    ESPELHOS_FIXOS: {
        1: 10, 
        2: 20, 
        3: 30, 
        6: 9, 
        16: 19, 
        26: 29, 
        13: 31, 
        12: 21, 
        32: 23
    },

    // A tabela de substituições complexas deve ser implementada como uma função
    // que verifica todas as regras (vizinho, terminal, espelho, soma/subtração)
};

// Exportar para ser usado pelos scripts frontend e backend
// (Em um ambiente de módulo Node.js, seria 'module.exports = roletaConfig;')
// Para o HTML simples, fazemos:
const PROPRIEDADES = roletaConfig.PROPRIEDADES; 
const VIZINHOS_CILINDRO = roletaConfig.VIZINHOS_CILINDRO; 
const ESPELHOS_FIXOS = roletaConfig.ESPELHOS_FIXOS;
