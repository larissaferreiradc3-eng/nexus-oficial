package com.nexus.analyser.controller; // CORRIGIDO: usando o pacote com.nexus.analyser.controller

import com.nexus.analyser.service.EstelarService; // Importa o Service com o pacote correto
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analise")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AnalisadorController {

    private final EstelarService estelarService;

    @Autowired
    public AnalisadorController(EstelarService estelarService) {
        this.estelarService = estelarService;
    }

    @PostMapping
    public ResponseEntity<String> analisar(@RequestBody JogadaRequest request) {
        String resultado = estelarService.analisarJogada(request.getNumero());
        return ResponseEntity.ok(resultado);
    }

    private static class JogadaRequest {
        private int numero;
        public int getNumero() { return numero; }
        public void setNumero(int numero) { this.numero = numero; }
    }
}