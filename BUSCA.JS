// Função para buscar um serviço pelo ID e exibir em um balão de busca
function buscarServico(id) {
  var aba = obterAba("Serviços");
  var intervalo = aba.getRange(2, 1, aba.getLastRow() - 1, 1);
  var valores = intervalo.getValues();
  var resultado = "";

  for (var i = 0; i < valores.length; i++) {
    if (valores[i][0] == id) {
      var dadosServico = aba.getRange(i + 2, 1, 1, 10).getValues()[0];
      resultado =
        "ID: " +
        dadosServico[0] +
        "\n" +
        "Marca do Veículo: " +
        dadosServico[1] +
        "\n" +
        "Placa do Veículo: " +
        dadosServico[2] +
        "\n" +
        "Cliente: " +
        dadosServico[3] +
        "\n" +
        "Descrição dos Serviços: " +
        dadosServico[4] +
        "\n" +
        "Funcionário: " +
        dadosServico[5] +
        "\n" +
        "Data do Serviço: " +
        dadosServico[6] +
        "\n" +
        "Horário do Serviço: " +
        dadosServico[7] +
        "\n" +
        "Preço do Serviço: " +
        dadosServico[8].toFixed(2) +
        "\n" +
        "Feedback: " +
        dadosServico[9];
      break;
    }
  }

  if (resultado === "") {
    resultado = "Serviço não encontrado.";
  }

  mostrarResultado(resultado);
}

// Função para buscar uma peça no estoque pelo ID e exibir em um balão de busca
function buscarEstoque(id) {
  var aba = obterAba("Estoque");
  var intervalo = aba.getRange(2, 1, aba.getLastRow() - 1, 1);
  var valores = intervalo.getValues();
  var resultado = "";

  for (var i = 0; i < valores.length; i++) {
    if (valores[i][0] == id) {
      var dadosPeca = aba.getRange(i + 2, 1, 1, 8).getValues()[0];
      resultado =
        "ID da Peça: " +
        dadosPeca[0] +
        "\n" +
        "Nome da Peça: " +
        dadosPeca[1] +
        "\n" +
        "Marca da Peça: " +
        dadosPeca[2] +
        "\n" +
        "Quantidade: " +
        dadosPeca[3] +
        "\n" +
        "Preço Unitário de Compra: " +
        dadosPeca[4].toFixed(2) +
        "\n" +
        "Preço Unitário de Venda: " +
        dadosPeca[5].toFixed(2) +
        "\n" +
        "Data da Última Atualização: " +
        Utilities.formatDate(
          dadosPeca[6],
          Session.getScriptTimeZone(),
          "dd/MM/yyyy"
        ) +
        "\n" +
        "Lucro Total: " +
        dadosPeca[7].toFixed(2);
      break;
    }
  }

  if (resultado === "") {
    resultado = "Peça não encontrada.";
  }

  mostrarResultado(resultado);
}

// Função para exibir os resultados na interface do usuário com formatação vertical
function mostrarResultado(mensagem) {
  var ui = SpreadsheetApp.getUi();
  ui.alert("Resultado da Busca", mensagem, ui.ButtonSet.OK);
}

// Função auxiliar para exibir o prompt de busca de serviço
function buscarServicoPrompt() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Digite o ID do Serviço");

  if (response.getSelectedButton() == ui.Button.OK) {
    var id = response.getResponseText();
    buscarServico(id);
  }
}

// Função auxiliar para exibir o prompt de busca de estoque
function buscarEstoquePrompt() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt("Digite o ID da Peça");

  if (response.getSelectedButton() == ui.Button.OK) {
    var id = response.getResponseText();
    buscarEstoque(id);
  }
}
