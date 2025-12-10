// AnaliseRequest.java - Em: backend/src/main/java/com/nexus/analyser/model/
package com.nexus.analyser.model;

// Necessário para Spring Boot
import java.io.Serializable;

public class AnaliseRequest implements Serializable {
    private String nomeMesa;
    private String historicoCompleto; // 50 números + timeline
    private int ultimoNumero;
    private String timelineAtual;

    // Getters e Setters (Implementados pelo IDE)...
    public String getNomeMesa() { return nomeMesa; }
    public void setNomeMesa(String nomeMesa) { this.nomeMesa = nomeMesa; }
    public String getHistoricoCompleto() { return historicoCompleto; }
    public void setHistoricoCompleto(String historicoCompleto) { this.historicoCompleto = historicoCompleto; }
    public int getUltimoNumero() { return ultimoNumero; }
    public void setUltimoNumero(int ultimoNumero) { this.ultimoNumero = ultimoNumero; }
    public String getTimelineAtual() { return timelineAtual; }
    public void setTimelineAtual(String timelineAtual) { this.timelineAtual = timelineAtual; }
}
