// AnaliseResult.java - Em: backend/src/main/java/com/nexus/analyser/model/
package com.nexus.analyser.model;

import java.io.Serializable;

public class AnaliseResult implements Serializable {
    private String estrategiaNome = "Estelar";
    private int ultimoNumero;
    private String alvosLancados; // Ex: "13, 21, 32"
    private int confiancaPilares;
    private String regraEspera; // Ex: "ENTRADA IMEDIATA" ou "AGUARDE 6 RODADAS"
    private int rodadasEspera;

    // Getters e Setters (Implementados pelo IDE)...
    public String getEstrategiaNome() { return estrategiaNome; }
    public void setEstrategiaNome(String estrategiaNome) { this.estrategiaNome = estrategiaNome; }
    public int getUltimoNumero() { return ultimoNumero; }
    public void setUltimoNumero(int ultimoNumero) { this.ultimoNumero = ultimoNumero; }
    public String getAlvosLancados() { return alvosLancados; }
    public void setAlvosLancados(String alvosLancados) { this.alvosLancados = alvosLancados; }
    public int getConfiancaPilares() { return confiancaPilares; }
    public void setConfiancaPilares(int confiancaPilares) { this.confiancaPilares = confiancaPilares; }
    public String getRegraEspera() { return regraEspera; }
    public void setRegraEspera(String regraEspera) { this.regraEspera = regraEspera; }
    public int getRodadasEspera() { return rodadasEspera; }
    public void setRodadasEspera(int rodadasEspera) { this.rodadasEspera = rodadasEspera; }
}
