package com.nexus.analyser.service; // CORRIGIDO: usando o pacote com.nexus.analyser.service

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class EstelarService {

    private final Map<Integer, Integer> historicoJogadas = new HashMap<>();

    public String analisarJogada(int jogada) {
        historicoJogadas.put(jogada, jogada);

        if (jogada % 2 == 0) {
            return "Decodificação Estelar: Par. Sinal de estabilidade. (Jogadas no Histórico: " + historicoJogadas.size() + ")";
        } else {
            return "Decodificação Estelar: Ímpar. Sinal de instabilidade. (Jogadas no Histórico: " + historicoJogadas.size() + ")";
        }
    }
}