// EstelarService.java - Em: backend/src/main/java/com/nexus/analyser/service/
package com.nexus.analyser.service;

import com.nexus.analyser.model.AnaliseRequest;
import com.nexus.analyser.model.AnaliseResult;
import com.nexus.analyser.model.TrincaAnalise;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.stream.Collectors;
import javax.xml.bind.DatatypeConverter; // Necessita de biblioteca ou Java 16+ HexFormat

@Service
public class EstelarService {

    // --- DADOS ESTATICOS DA ROLETA (Sequência Vizinho e Espelhos) ---
    private static final Map<Integer, Integer> ESPELHOS_FIXOS = Map.of(
        1, 10, 10, 1, 2, 20, 20, 2, 3, 30, 30, 3, 6, 9, 9, 6,
        16, 19, 19, 16, 26, 29, 29, 26, 13, 31, 31, 13, 12, 21, 21, 12, 32, 23, 23, 32
    );
    private static final List<Integer> ROULETTE_SEQUENCE = List.of(
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    );
    // -----------------------------------------------------------------

    // --- FUNÇÃO 1: CHAVE DE SINCRONIA ---
    public String generateSincroniaKey(AnaliseRequest request) {
        String context = request.getNomeMesa() + "|" + request.getHistoricoCompleto();
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(context.getBytes("UTF-8"));
            return DatatypeConverter.printHexBinary(hash);
        } catch (NoSuchAlgorithmException | java.io.UnsupportedEncodingException e) {
            return String.valueOf(context.hashCode()); // Hash simples em caso de falha
        }
    }

    // --- FUNÇÃO 2: REGRA DE EQUIVALÊNCIA ---
    private boolean isEquivalent(int numA, int numB) {
        if (numA == numB) return false;

        // Terminal (Mesmo último dígito)
        if (numA % 10 == numB % 10) return true;

        // Espelho Fixo
        if (ESPELHOS_FIXOS.containsKey(numA) && ESPELHOS_FIXOS.get(numA) == numB) return true;

        // Vizinho (1 passo no cilindro)
        return isVizinho(numA, numB);
    }

    private boolean isVizinho(int numA, int numB) {
        int indexA = ROULETTE_SEQUENCE.indexOf(numA);
        if (indexA == -1) return false;
        int size = ROULETTE_SEQUENCE.size();
        int nextIndex = (indexA + 1) % size;
        int prevIndex = (indexA - 1 + size) % size;

        return ROULETTE_SEQUENCE.get(nextIndex) == numB || 
               ROULETTE_SEQUENCE.get(prevIndex) == numB;
    }

    // --- FUNÇÃO 3: BUSCA DE TRINCAS EQUIVALENTES (DECODIFICAÇÃO) ---
    public List<TrincaAnalise> findTrincas(List<Integer> historico) {
        if (historico.size() < 3) return Collections.emptyList();
        
        int gatilhoC = historico.get(historico.size() - 1);
        List<TrincaAnalise> trincasEncontradas = new ArrayList<>();

        for (int i = historico.size() - 3; i >= 0; i--) {
            int numA = historico.get(i);
            int numB = historico.get(i + 1);

            if (isEquivalent(numB, gatilhoC) && isEquivalent(numA, numB)) {
                TrincaAnalise trinca = new TrincaAnalise(numA, numB, gatilhoC, i);
                trincasEncontradas.add(trinca);
                // Retorna a primeira/mais recente trinca (opcional, dependendo da estratégia)
                return List.of(trinca); 
            }
        }
        return trincasEncontradas;
    }

    // --- FUNÇÃO 4: CLASSIFICAÇÃO DOS PILARES (CONFIAÇA) ---
    private void classificarPilares(TrincaAnalise trinca, List<Integer> historicoCompleto) {
        trinca.addPilar(); // Pilar 1: Trinca Encontrada
        
        // Simulação do Pilar 2 (Repetição Histórica)
        if (trinca.getNumA() % 3 == trinca.getNumC_Gatilho() % 3) { // Se A e C na mesma Coluna (Exemplo)
            trinca.addPilar();
        }
        
        // Simulação do Pilar 3 (Propriedades Paralelas)
        if (trinca.getNumA() % 2 == trinca.getNumB() % 2) { // Se A e B mesma Paridade (Exemplo)
            trinca.addPilar();
        }

        // Definir alvos (Apenas um Vizinho e o Espelho do Gatilho para exemplo)
        trinca.setAlvosGerados(Arrays.asList(
            getVizinhoTarget(trinca.getNumC_Gatilho()), 
            ESPELHOS_FIXOS.getOrDefault(trinca.getNumC_Gatilho(), 0)
        ).stream().filter(n -> n != 0).collect(Collectors.toList()));
    }
    
    private int getVizinhoTarget(int num) {
        int index = ROULETTE_SEQUENCE.indexOf(num);
        if (index == -1) return -1;
        int nextIndex = (index + 1) % ROULETTE_SEQUENCE.size();
        return ROULETTE_SEQUENCE.get(nextIndex);
    }

    // --- FUNÇÃO 5: REGRA DE DEFINIÇÃO DA ESPERA (X) ---
    private AnaliseResult aplicarRegraDeEspera(TrincaAnalise trinca, List<Integer> historico) {
        AnaliseResult result = new AnaliseResult();
        int pilares = trinca.getPilaresConfianca();
        
        // 1. Padrão Limpo (3 Pilares)
        if (pilares >= 3) {
            result.setRegraEspera("ENTRADA IMEDIATA");
            result.setRodadasEspera(0);
            trinca.setTipoPadrao("LIMPO");
            return result;
        }

        // 2. Padrão Inverso (Simulação: Se B for o 'Espelho Fixo' de A)
        if (ESPELHOS_FIXOS.getOrDefault(trinca.getNumA(), -1) == trinca.getNumB()) {
            result.setRegraEspera("AGUARDE 6 RODADAS");
            result.setRodadasEspera(6);
            trinca.setTipoPadrao("INVERSO");
            return result;
        }
        
        // 3. Padrão Repetitivo (Menos Pilares, sinal de instabilidade)
        int rodadasEspera = 2 + (3 - pilares); // 2 + (Quanto mais fraco, mais espera)
        result.setRegraEspera("AGUARDE " + rodadasEspera + " RODADAS");
        result.setRodadasEspera(rodadasEspera);
        trinca.setTipoPadrao("REPETITIVO");
        return result;
    }

    // --- FUNÇÃO PRINCIPAL ---
    public AnaliseResult runEstelarAlgorithm(AnaliseRequest request) {
        List<Integer> historico = Arrays.stream(request.getHistoricoCompleto().split(","))
                                    .map(Integer::parseInt)
                                    .collect(Collectors.toList());
        
        List<TrincaAnalise> trincas = findTrincas(historico);
        
        if (trincas.isEmpty()) {
            AnaliseResult noResult = new AnaliseResult();
            noResult.setRegraEspera("AGUARDE - Sem Padrão");
            noResult.setUltimoNumero(request.getUltimoNumero());
            noResult.setAlvosLancados("N/A");
            return noResult;
        }

        TrincaAnalise trincaAtiva = trincas.get(0); // Usar a trinca mais recente
        
        classificarPilares(trincaAtiva, historico);
        AnaliseResult finalResult = aplicarRegraDeEspera(trincaAtiva, historico);
        
        finalResult.setUltimoNumero(request.getUltimoNumero());
        finalResult.setAlvosLancados(trincaAtiva.getAlvosGerados().stream().map(String::valueOf).collect(Collectors.joining(",")));
        finalResult.setConfiancaPilares(trincaAtiva.getPilaresConfianca());
        
        return finalResult;
    }
}
