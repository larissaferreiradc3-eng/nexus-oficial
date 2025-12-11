/**
 * Lógica da Análise Estelar NERA (Nexus Estelar da Roleta Analizer).
 * Este módulo implementa a filtragem em 3 etapas (Funil de Confluência NERA)
 * para sugerir apostas em Trincas (grupos de 3 números).
 */

const AnaliseEstelarNERA = {

    // Define os 12 grupos de Trincas da roleta
    TRINCAS: [
        { nome: 'T1', numeros: [1, 2, 3] }, { nome: 'T2', numeros: [4, 5, 6] },
        { nome: 'T3', numeros: [7, 8, 9] }, { nome: 'T4', numeros: [10, 11, 12] },
        { nome: 'T5', numeros: [13, 14, 15] }, { nome: 'T6', numeros: [16, 17, 18] },
        { nome: 'T7', numeros: [19, 20, 21] }, { nome: 'T8', numeros: [22, 23, 24] },
        { nome: 'T9', numeros: [25, 26, 27] }, { nome: 'T10', numeros: [28, 29, 30] },
        { nome: 'T11', numeros: [31, 32, 33] }, { nome: 'T12', numeros: [34, 35, 36] }
    ],

    // Define os 4 "Quartos" para análise de dispersão (aproximação do layout físico)
    QUARTOS: [
        { nome: 'Q1', numeros: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        { nome: 'Q2', numeros: [9, 10, 11, 12, 13, 14, 15, 16, 17] },
        { nome: 'Q3', numeros: [18, 19, 20, 21, 22, 23, 24, 25, 26] },
        { nome: 'Q4', numeros: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36] } // Q4 tem 10 para compensar
    ],

    /**
     * Função principal que aplica o Funil de Confluência NERA.
     * @param {number[]} historico - Array de números da roleta (do mais recente ao mais antigo).
     * @returns {object} O resultado da análise (status, alvos, ciclo).
     */
    analisar(historico) {
        if (historico.length < 20) {
            return { status: 'INVALIDEZ', motivo: 'Histórico insuficiente (mínimo de 20).' };
        }

        // 1. Etapa 1: Análise de Dispersão (Últimas 15 rodadas)
        const dispersaoResultado = this.analisarDispersao(historico.slice(0, 15));
        
        if (dispersaoResultado.status === 'ALTA') {
            return { status: 'RECUPERACAO', motivo: 'Dispersão alta e equilibrada. Aguardar desequilíbrio.' };
        }

        // 2. Etapa 2: Análise da Frequência de Trincas
        const trincasEmAtraso = this.analisarAtrasoTrincas(historico);

        if (trincasEmAtraso.length === 0) {
            return { status: 'RECUPERACAO', motivo: 'Nenhuma Trinca em atraso estatístico significativo.' };
        }

        // 3. Etapa 3: Confluência NERA (Atraso + Baixa Dispersão)
        const alvosSugeridos = this.confluenciaNERA(trincasEmAtraso, dispersaoResultado.quartosDominantes);

        if (alvosSugeridos.length > 0) {
            return {
                status: 'CONVERGENCIA',
                cicloEstelar: dispersaoResultado.status,
                alvos: alvosSugeridos
            };
        } else {
            return { status: 'INVALIDEZ', motivo: 'Atraso detectado, mas sem confluência com o padrão de dispersão.' };
        }
    },

    analisarDispersao(historicoRecente) {
        const contagemQuartos = {};
        this.QUARTOS.forEach(q => contagemQuartos[q.nome] = 0);

        historicoRecente.forEach(numero => {
            this.QUARTOS.forEach(quarto => {
                if (quarto.numeros.includes(numero)) {
                    contagemQuartos[quarto.nome]++;
                }
            });
        });

        const valores = Object.values(contagemQuartos);
        const media = valores.reduce((a, b) => a + b) / valores.length;
        
        // Define um limite de desequilíbrio (ex: se o mais frequente tiver 2x mais que o menos frequente)
        const max = Math.max(...valores);
        const min = Math.min(...valores);

        if (max > media * 1.5 && min < media * 0.5) {
            // Alta concentração em alguns quartos (Baixa Dispersão)
            const quartosDominantes = Object.keys(contagemQuartos).filter(q => contagemQuartos[q] === min);
            return { status: 'BAIXA', quartosDominantes: quartosDominantes };
        }
        
        // Dispersão considerada alta/equilibrada
        return { status: 'ALTA', quartosDominantes: [] };
    },

    analisarAtrasoTrincas(historicoCompleto) {
        const trincasAtrasadas = [];
        // Frequência esperada por Trinca: ~3.08% ou 1 em 32 (nas 100 rodadas).
        // Em 20 rodadas, espera-se ~0.65 acertos por trinca.
        const LIMITE_ATRASO = 0.5; // Limite de ocorrências em relação à esperada

        const contagemTrincas = this.TRINCAS.map(trinca => {
            let count = 0;
            historicoCompleto.forEach(num => {
                if (trinca.numeros.includes(num)) {
                    count++;
                }
            });
            // Calcula a frequência média esperada para o tamanho do histórico
            const frequenciaEsperada = historicoCompleto.length * (3 / 37); 
            
            return {
                nome: trinca.nome,
                numeros: trinca.numeros,
                contagem: count,
                atraso: frequenciaEsperada - count
            };
        });

        // Seleciona trincas que estão significativamente atrasadas
        contagemTrincas.forEach(t => {
            // Se a contagem real for menor que 50% da contagem esperada E o atraso for > 1
            if (t.contagem < t.frequenciaEsperada * LIMITE_ATRASO && t.atraso > 1) {
                trincasAtrasadas.push(t);
            }
        });

        return trincasAtrasadas;
    },

    confluenciaNERA(trincasAtrasadas, quartosEmFalta) {
        const alvosFinais = [];

        trincasAtrasadas.forEach(trinca => {
            const trincaNum = trinca.numeros;
            let pertenceAQuartoEmFalta = false;

            // 1. Verifica se a Trinca pertence a um dos "Quartos em Falta" (que menos saiu)
            quartosEmFalta.forEach(nomeQuarto => {
                const quarto = this.QUARTOS.find(q => q.nome === nomeQuarto);
                if (quarto && trincaNum.every(num => quarto.numeros.includes(num))) {
                    pertenceAQuartoEmFalta = true;
                }
            });

            // Se estiver atrasada E pertencer ao Quarto que está com baixa ocorrência, é um alvo forte.
            if (pertenceAQuartoEmFalta) {
                alvosFinais.push(trinca);
            }
        });

        // Se não houver confluência perfeita, mas houver muito atraso, sugere o mais atrasado.
        if (alvosFinais.length === 0 && trincasAtrasadas.length > 0) {
            // Ordena pelo maior atraso e sugere a trinca mais atrasada
            trincasAtrasadas.sort((a, b) => b.atraso - a.atraso);
            alvosFinais.push(trincasAtrasadas[0]); 
        }

        return alvosFinais;
    }
};

// Exporta a lógica para ser usada pelo ui.js
// No ambiente de navegador, ela estará disponível globalmente.
// Ex: window.AnaliseEstelarNERA
