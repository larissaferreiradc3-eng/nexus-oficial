# 🌟 NEXUS ANALIZER - Surpass Yourself

## Visão Geral do Projeto

O **Nexus Analizer** é uma ferramenta de análise preditiva projetada para monitorar a repetição cíclica de números em roletas. Utilizando algoritmos de Mapeamento de Equivalência e Análise Estelar, o Nexus identifica padrões subjacentes de repetição (como Trincas de Terminais) e sugere alvos de aposta com base na probabilidade estatística de quebrar um desequilíbrio.

O projeto é desenvolvido puramente em **HTML, CSS e JavaScript (Vanilla)**, rodando completamente no cliente (navegador), garantindo rapidez e privacidade.

## 🎯 Funcionalidades Principais

* **Roleta Interativa:** Interface visual para inserção rápida e fácil dos números sorteados.
* **Análise Estelar:** Algoritmo de backend que processa a Linha do Tempo (histórico recente) e gera sugestões de alvos de aposta.
* **Mapeamento de Equivalência:** Utiliza a matriz completa da roleta (duzias, colunas, par/ímpar, alto/baixo, terminais) para identificar correlações e desequilíbrios.
* **Logs e Gestão de Saldo:** Sistema para registrar resultados (Green/Red) e calcular o saldo da sessão em tempo real.
* **Persistência de Dados:** Salva o histórico de Logs e o Saldo no `localStorage` do navegador, mantendo o progresso mesmo após fechar a sessão.

## 🚀 Como Usar o Nexus Analizer

O Nexus é uma aplicação baseada em navegador e não requer instalação de servidor.

### 1. Inicialização

Para iniciar a ferramenta:

1.  Baixe ou clone este repositório para o seu computador.
2.  Navegue até a pasta `src/frontend/`.
3.  Abra o arquivo **`index.html`** no seu navegador de preferência (Chrome, Firefox, Edge, etc.).

### 2. Fluxo de Análise

1.  **Inserção de Dados:** Insira os números sorteados na Linha do Tempo:
    * **Método Rápido:** Clique nos números diretamente na grade da Roleta Interativa (recomendado para uso em tempo real).
    * **Método Histórico:** Cole uma sequência de números (separados por vírgula ou espaço) na caixa de texto "Colar Histórico Base".
2.  **Análise Estelar:** Após inserir o 9º número, o sistema ativará a Análise NEXUS.
3.  **Sugestão de Alvo:** O sistema irá sugerir um alvo (`alvos sugeridos`) e uma recomendação (`Ação`).
4.  **Registro de Resultado:** Após a aposta, clique em:
    * **✅ Green (Ganhou):** Se o alvo sugerido acertou. O saldo será atualizado (simulando lucro 35:1).
    * **❌ Red (Perdeu):** Se a aposta falhou. O saldo será atualizado (simulando perda de 1 unidade).
5.  **Próximo Ciclo:** Registrar um resultado limpa a Linha do Tempo e inicia um novo ciclo de análise.

### 3. Persistência de Sessão

* O saldo e o histórico de logs são salvos automaticamente no seu navegador após cada clique em **Green** ou **Red**.
* Para garantir o salvamento manual, clique em **LOGOUT & Salvar Sessão** a qualquer momento.

## 📁 Estrutura do Projeto

O projeto é dividido em frontend (interface) e backend (lógica), rodando integralmente no cliente (navegador).
