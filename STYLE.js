STYLE;

function aplicarCoresProfissionais() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var abas = ss.getSheets();

  abas.forEach(function (aba) {
    Logger.log("Aplicando formatação na aba: " + aba.getName());
    formatarCabecalhos(aba);
    formatarTodasAsCelulas(aba);
  });
}

function formatarCabecalhos(aba) {
  var intervaloCabecalhos = aba.getRange(1, 1, 1, aba.getMaxColumns());
  intervaloCabecalhos
    .setBackground("#004F6C") // Azul escuro para cabeçalhos
    .setFontColor("#FFFFFF") // Texto branco
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBorder(true, true, true, true, false, false);
}

function formatarTodasAsCelulas(aba) {
  var totalLinhas = aba.getMaxRows();
  var totalColunas = aba.getMaxColumns();

  if (totalLinhas > 1 && totalColunas > 0) {
    // Verifica se há linhas e colunas para formatar
    var intervalo = aba.getRange(2, 1, totalLinhas - 1, totalColunas);
    intervalo
      .setBackground("#F2F2F2") // Fundo cinza claro para todas as células
      .setFontSize(10)
      .setHorizontalAlignment("left")
      .setBorder(true, true, true, true, false, false);

    // Alternar cores de fundo para linhas
    for (var i = 0; i < totalLinhas - 1; i++) {
      var corLinha = i % 2 === 0 ? "#FFFFFF" : "#F9F9F9"; // Branco e cinza muito claro
      aba.getRange(i + 2, 1, 1, totalColunas).setBackground(corLinha);
    }
  } else {
    Logger.log("Nenhuma linha de dados encontrada na aba: " + aba.getName());
  }
}
