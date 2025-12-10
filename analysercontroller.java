// AnalyserController.java
package com.nexus.analyser.controller;

import com.nexus.analyser.model.AnaliseRequest;
import com.nexus.analyser.model.AnaliseResult;
import com.nexus.analyser.service.EstelarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analise")
public class AnalyserController {

    // Injeção do Serviço onde está toda a lógica do seu algoritmo
    @Autowired
    private EstelarService estelarService; 

    /**
     * Endpoint principal para gerar a análise Estelar e a Regra de Espera.
     * Deve implementar a Regra de Sincronia de Análise (determinismo).
     */
    @PostMapping("/gerar")
    public AnaliseResult gerarAnalise(@RequestBody AnaliseRequest request) {
        
        // 1. Processar a Chave de Sincronia no Service
        String chaveSincronia = estelarService.generateSincroniaKey(request);
        
        // 2. Tentar buscar resultado no Cache/BD (Regra de Sincronia)
        AnaliseResult cachedResult = estelarService.getCachedResult(chaveSincronia);
        if (cachedResult != null) {
            return cachedResult;
        }

        // 3. Se não houver cache, rodar o Algoritmo Estelar
        AnaliseResult result = estelarService.runEstelarAlgorithm(request.getHistoricoCompleto(), 
                                                                    request.getUltimoNumero(), 
                                                                    request.getNomeMesa());
        
        // 4. Salvar o novo resultado no BD/Cache para sincronia
        estelarService.saveResult(result, chaveSincronia);
        
        return result;
    }
    
    // Endpoint para rastreamento (atualiza a contagem de espera)
    @PostMapping("/rastrear")
    public AnaliseResult rastrearJogada(@RequestBody RastreamentoRequest request) {
        // Lógica: Processa o novo número, ajusta a contagem de espera (+2 se houver repetição) 
        // e retorna o status atual (Ex: "AGUARDE 4 RODADAS").
        return estelarService.updateRastreamento(request);
    }
}
