// AnalyserController.java - Em: backend/src/main/java/com/nexus/analyser/controller/
package com.nexus.analyser.controller;

import com.nexus.analyser.model.AnaliseRequest;
import com.nexus.analyser.model.AnaliseResult;
import com.nexus.analyser.service.EstelarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analise")
@CrossOrigin(origins = "http://localhost:8080") // Permitir conexão do Front-end local
public class AnalyserController {

    @Autowired
    private EstelarService estelarService;

    @PostMapping("/gerar")
    public ResponseEntity<AnaliseResult> gerarAnalise(@RequestBody AnaliseRequest request) {
        
        // 1. Gerar Chave de Sincronia para controle de estado
        String key = estelarService.generateSincroniaKey(request);
        // O código real salvaria a KEY e o estado da análise em um DB ou cache aqui
        
        // 2. Executar o Algoritmo Estelar
        AnaliseResult result = estelarService.runEstelarAlgorithm(request);
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/rastrear")
    public ResponseEntity<AnaliseResult> rastrearJogada(@RequestBody AnaliseRequest request) {
        // Implementação futura: Lógica para decrementar contador de espera e verificar GREEN/RED
        return ResponseEntity.ok(new AnaliseResult());
    }
}
