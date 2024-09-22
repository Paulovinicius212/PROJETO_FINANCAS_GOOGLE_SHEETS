// Função para verificar boletos
function verificarBoletos() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaPendencias = planilha.getSheetByName("Pendências");

  var ultimaLinha = abaPendencias.getLastRow();
  var intervalo = abaPendencias.getRange(2, 1, ultimaLinha - 1, 5);

  var dados = intervalo.getValues();
  var dataAtual = new Date();

  for (var i = 0; i < dados.length; i++) {
    var id = dados[i][0]; // Coluna A: ID do boleto
    var empresa = dados[i][1]; // Coluna B: Empresa responsável
    var descricao = dados[i][2]; // Coluna C: Descrição do boleto
    var dataVencimento = new Date(dados[i][3]); // Coluna D: Data de vencimento
    var status = dados[i][4]; // Coluna E: Status atual (Pendente, Pago, etc.)

    if (status.toLowerCase() !== "pago") {
      if (dataVencimento >= dataAtual) {
        abaPendencias.getRange(i + 2, 6).setValue("Ativo / A Vencer"); // Coluna F
      } else {
        abaPendencias.getRange(i + 2, 6).setValue("Vencido"); // Coluna F
      }
    } else {
      abaPendencias.getRange(i + 2, 6).setValue("Concluído"); // Coluna F
    }
  }
}

// Função para buscar boletos por ID
function buscarBoletoPorID(idBoleto) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaPendencias = planilha.getSheetByName("Pendências");

  var ultimaLinha = abaPendencias.getLastRow();
  var intervalo = abaPendencias.getRange(2, 1, ultimaLinha - 1, 6);

  var dados = intervalo.getValues();
  var resultado = [];

  for (var i = 0; i < dados.length; i++) {
    var id = dados[i][0]; // Coluna A: ID do boleto

    if (id == idBoleto) {
      var empresa = dados[i][1]; // Coluna B: Empresa responsável
      var descricao = dados[i][2]; // Coluna C: Descrição
      var dataVencimento = dados[i][3]; // Coluna D: Data de vencimento
      var status = dados[i][4]; // Coluna E: Status
      var observacao = dados[i][5]; // Coluna F: Observações (Vencido, Ativo, etc.)

      resultado.push({
        ID: id,
        Empresa: empresa,
        Descrição: descricao,
        "Data de Vencimento": dataVencimento,
        Status: status,
        Observações: observacao,
      });
    }
  }

  if (resultado.length > 0) {
    Logger.log("Boleto encontrado: " + JSON.stringify(resultado));
    SpreadsheetApp.getUi().alert(
      "Boleto encontrado:\n" + JSON.stringify(resultado)
    );
  } else {
    Logger.log("Boleto com ID " + idBoleto + " não encontrado.");
    SpreadsheetApp.getUi().alert(
      "Boleto com ID " + idBoleto + " não encontrado."
    );
  }
}

// Função para pedir o ID do boleto via prompt e chamar a função de busca
function buscarBoletoPorIDPrompt() {
  var ui = SpreadsheetApp.getUi();
  var resposta = ui.prompt(
    "Buscar Boleto",
    "Digite o ID do boleto que deseja buscar:",
    ui.ButtonSet.OK_CANCEL
  );

  if (resposta.getSelectedButton() == ui.Button.OK) {
    var idBoleto = resposta.getResponseText();
    buscarBoletoPorID(idBoleto); // Chamando a função de busca por ID
  }
}

// Função para buscar boletos vencidos
function buscarBoletosVencidos() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaPendencias = planilha.getSheetByName("Pendências");

  var ultimaLinha = abaPendencias.getLastRow();
  var intervalo = abaPendencias.getRange(2, 1, ultimaLinha - 1, 6);

  var dados = intervalo.getValues();
  var boletosVencidos = [];

  for (var i = 0; i < dados.length; i++) {
    var observacao = dados[i][5]; // Coluna F: Observação (Vencido, Ativo, etc.)

    if (observacao.toLowerCase() === "vencido") {
      boletosVencidos.push(dados[i]);
    }
  }

  if (boletosVencidos.length > 0) {
    Logger.log("Boletos Vencidos: " + JSON.stringify(boletosVencidos));
    SpreadsheetApp.getUi().alert(
      "Boletos Vencidos:\n" + JSON.stringify(boletosVencidos)
    );
  } else {
    Logger.log("Nenhum boleto vencido encontrado.");
    SpreadsheetApp.getUi().alert("Nenhum boleto vencido encontrado.");
  }
}

// Função para buscar boletos pagos
function buscarBoletosPagos() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaPendencias = planilha.getSheetByName("Pendências");

  var ultimaLinha = abaPendencias.getLastRow();
  var intervalo = abaPendencias.getRange(2, 1, ultimaLinha - 1, 6);

  var dados = intervalo.getValues();
  var boletosPagos = [];

  for (var i = 0; i < dados.length; i++) {
    var status = dados[i][4]; // Coluna E: Status do boleto

    if (status.toLowerCase() === "pago") {
      boletosPagos.push(dados[i]);
    }
  }

  if (boletosPagos.length > 0) {
    Logger.log("Boletos Pagos: " + JSON.stringify(boletosPagos));
    SpreadsheetApp.getUi().alert(
      "Boletos Pagos:\n" + JSON.stringify(boletosPagos)
    );
  } else {
    Logger.log("Nenhum boleto pago encontrado.");
    SpreadsheetApp.getUi().alert("Nenhum boleto pago encontrado.");
  }
}

// Função para buscar boletos a vencer
function buscarBoletosAVencer() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaPendencias = planilha.getSheetByName("Pendências");

  var ultimaLinha = abaPendencias.getLastRow();
  var intervalo = abaPendencias.getRange(2, 1, ultimaLinha - 1, 6);

  var dados = intervalo.getValues();
  var boletosAVencer = [];

  for (var i = 0; i < dados.length; i++) {
    var observacao = dados[i][5]; // Coluna F: Observação (Vencido, Ativo, etc.)

    if (observacao.toLowerCase() === "ativo / a vencer") {
      boletosAVencer.push(dados[i]);
    }
  }

  if (boletosAVencer.length > 0) {
    Logger.log("Boletos Ativos / A Vencer: " + JSON.stringify(boletosAVencer));
    SpreadsheetApp.getUi().alert(
      "Boletos Ativos / A Vencer:\n" + JSON.stringify(boletosAVencer)
    );
  } else {
    Logger.log("Nenhum boleto a vencer encontrado.");
    SpreadsheetApp.getUi().alert("Nenhum boleto a vencer encontrado.");
  }
}
