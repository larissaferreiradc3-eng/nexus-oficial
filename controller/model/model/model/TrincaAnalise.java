// TrincaAnalise.java - Em: backend/src/main/java/com/nexus/analyser/model/
package com.nexus.analyser.model;

import java.util.ArrayList;
import java.util.List;

public class TrincaAnalise {
    private int numA;
    private int numB;
    private int numC_Gatilho;
    private int posicaoHistorico; 
    private int pilaresConfianca = 0; 
    private List<Integer> alvosGerados;
    private String tipoPadrao = "LIMPO"; 

    public TrincaAnalise(int numA, int numB, int numC_Gatilho, int posicaoHistorico) {
        this.numA = numA;
        this.numB = numB;
        this.numC_Gatilho = numC_Gatilho;
        this.posicaoHistorico = posicaoHistorico;
        this.alvosGerados = new ArrayList<>(); 
    }

    public void addPilar() {
        this.pilaresConfianca++;
    }
    
    // Getters e Setters (Implementados pelo IDE)...
    public int getNumA() { return numA; }
    public int getNumB() { return numB; }
    public int getNumC_Gatilho() { return numC_Gatilho; }
    public int getPosicaoHistorico() { return posicaoHistorico; }
    public int getPilaresConfianca() { return pilaresConfianca; }
    public void setPilaresConfianca(int pilaresConfianca) { this.pilaresConfianca = pilaresConfianca; }
    public List<Integer> getAlvosGerados() { return alvosGerados; }
    public void setAlvosGerados(List<Integer> alvosGerados) { this.alvosGerados = alvosGerados; }
    public String getTipoPadrao() { return tipoPadrao; }
    public void setTipoPadrao(String tipoPadrao) { this.tipoPadrao = tipoPadrao; }
}
