function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu("Gerenciamento")
    .addItem("Adicionar Produto", "adicionarProdutoPrompt")
    .addItem("Atualizar Quantidade", "atualizarQuantidadePrompt")
    .addItem("Adicionar Boleto", "adicionarBoletoPorPrompt") // Adiciona a nova função para adicionar boletos
    .addItem("Adicionar Despesa", "adicionarDespesaPorPrompt") // Adiciona a função de adicionar despesa
    .addSeparator()
    .addItem("Adicionar Serviço", "adicionarServicoPrompt")
    .addItem("Atualizar Serviço", "atualizarServicoPrompt")
    .addSeparator()
    .addItem("Adicionar Fornecedor", "adicionarFornecedorPrompt")
    .addSeparator()
    //.addItem('Atualizar Rendimentos', 'atualizarRendimentosPrompt')//
    .addItem("Verificar Estoque", "verificarEstoque")
    .addItem("Verificar Boletos", "verificarBoletos")
    .addSeparator()
    .addItem("Buscar Serviço", "buscarServicoPrompt")
    .addItem("Buscar Estoque", "buscarEstoquePrompt")
    .addItem("Buscar Boleto por ID", "buscarBoletoPorIDPrompt")
    .addItem("Buscar Despesa por ID", "buscarDespesaPorIDPrompt") // Adiciona a função de buscar despesa
    .addSeparator()
    .addItem("Listar Boletos Vencidos", "buscarBoletosVencidos")
    .addItem("Listar Boletos Pagos", "buscarBoletosPagos")
    .addItem("Listar Boletos a Vencer", "buscarBoletosAVencer")
    .addSeparator()
    .addToUi();
}

// Função para adicionar novas despesas via prompt com ID gerado automaticamente com prefixo
function adicionarDespesaPorPrompt() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaDespesas = planilha.getSheetByName("Despesas");

  var ui = SpreadsheetApp.getUi();

  // Gera o próximo ID automaticamente com prefixo
  var prefixo = "DES-"; // Prefixo para o ID
  var ultimaLinha = abaDespesas.getLastRow();
  var ultimoId = abaDespesas.getRange(ultimaLinha, 1).getValue(); // Coluna A (ID da despesa)
  var numeroAtual = 0;

  // Verifica se o último ID existe e começa com o prefixo
  if (typeof ultimoId === "string" && ultimoId.startsWith(prefixo)) {
    var numeroParte = ultimoId.substring(prefixo.length); // Extrai a parte numérica do ID
    numeroAtual = parseInt(numeroParte, 10); // Converte para número
    numeroAtual = isNaN(numeroAtual) ? 0 : numeroAtual; // Garante que o número seja válido
  }

  var novoNumero = numeroAtual + 1;
  var novoId = prefixo + String(novoNumero).padStart(3, "0"); // Formata o ID com 3 dígitos

  // Solicitar a categoria da despesa
  var categoriaResponse = ui.prompt(
    "Adicionar Despesa",
    "Digite a categoria da despesa (ex: Alimentação, Transporte):",
    ui.ButtonSet.OK_CANCEL
  );
  if (categoriaResponse.getSelectedButton() != ui.Button.OK) return;
  var categoria = categoriaResponse.getResponseText();

  // Solicitar a descrição da despesa
  var descricaoResponse = ui.prompt(
    "Adicionar Despesa",
    "Digite a descrição da despesa:",
    ui.ButtonSet.OK_CANCEL
  );
  if (descricaoResponse.getSelectedButton() != ui.Button.OK) return;
  var descricao = descricaoResponse.getResponseText();

  // Solicitar a data da despesa
  var dataResponse = ui.prompt(
    "Adicionar Despesa",
    "Digite a data da despesa (formato: DD-MM-AAAA):",
    ui.ButtonSet.OK_CANCEL
  );

  if (dataResponse.getSelectedButton() != ui.Button.OK) return;

  // Pegar a resposta do usuário
  var dataInput = dataResponse.getResponseText();

  // Verificar se o formato da data está correto (DD-MM-AAAA)
  var regexData = /^\d{2}-\d{2}-\d{4}$/;
  if (!regexData.test(dataInput)) {
    ui.alert(
      "Erro",
      "Formato de data inválido. Use o formato DD-MM-AAAA.",
      ui.ButtonSet.OK
    );
    return;
  }

  // Converter a string da data em um objeto Date
  var partesData = dataInput.split("-");
  var dia = parseInt(partesData[0], 10);
  var mes = parseInt(partesData[1], 10) - 1; // O mês em JavaScript é baseado em zero
  var ano = parseInt(partesData[2], 10);

  // Criar o objeto Date com os valores fornecidos
  var dataDespesa = new Date(ano, mes, dia);

  // Verificar se a data é válida
  if (
    dataDespesa.getDate() !== dia ||
    dataDespesa.getMonth() !== mes ||
    dataDespesa.getFullYear() !== ano
  ) {
    ui.alert(
      "Erro",
      "Data inválida. Verifique se a data está correta.",
      ui.ButtonSet.OK
    );
    return;
  }

  // Agora `dataDespesa` terá a data correta informada pelo usuário

  // Solicitar o valor da despesa
  var valorResponse = ui.prompt(
    "Adicionar Despesa",
    "Digite o valor da despesa (ex: 100.00):",
    ui.ButtonSet.OK_CANCEL
  );
  if (valorResponse.getSelectedButton() != ui.Button.OK) return;
  var valor = parseFloat(valorResponse.getResponseText());

  // Solicitar observações adicionais
  var observacoesResponse = ui.prompt(
    "Adicionar Despesa",
    "Digite observações adicionais (opcional):",
    ui.ButtonSet.OK_CANCEL
  );
  if (observacoesResponse.getSelectedButton() != ui.Button.OK) return;
  var observacoes = observacoesResponse.getResponseText();

  // Inserir a despesa na próxima linha disponível
  abaDespesas.getRange(ultimaLinha + 1, 1).setValue(novoId); // Coluna A: ID da despesa (gerado automaticamente)
  abaDespesas.getRange(ultimaLinha + 1, 2).setValue(categoria); // Coluna B: Categoria
  abaDespesas.getRange(ultimaLinha + 1, 3).setValue(descricao); // Coluna C: Descrição
  abaDespesas.getRange(ultimaLinha + 1, 4).setValue(dataDespesa); // Coluna D: Data
  abaDespesas.getRange(ultimaLinha + 1, 5).setValue(valor); // Coluna E: Valor
  abaDespesas.getRange(ultimaLinha + 1, 6).setValue(observacoes); // Coluna F: Observações

  // Confirmação
  SpreadsheetApp.getUi().alert("Despesa adicionada com sucesso! ID: " + novoId);
}

// Função para buscar despesas por ID e exibir em um balão de busca
function buscarDespesaPorIDPrompt() {
  var ui = SpreadsheetApp.getUi();
  var resposta = ui.prompt(
    "Buscar Despesa",
    "Digite o ID da despesa que deseja buscar:",
    ui.ButtonSet.OK_CANCEL
  );

  if (resposta.getSelectedButton() == ui.Button.OK) {
    var idDespesa = resposta.getResponseText();
    buscarDespesaPorID(idDespesa);
  }
}

// Função para buscar despesas por ID
function buscarDespesaPorID(idDespesa) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaDespesas = planilha.getSheetByName("Despesas");

  var ultimaLinha = abaDespesas.getLastRow();
  var intervalo = abaDespesas.getRange(2, 1, ultimaLinha - 1, 6);

  var dados = intervalo.getValues();

  var resultado = [];

  for (var i = 0; i < dados.length; i++) {
    var id = dados[i][0]; // Coluna A: ID da despesa

    if (id == idDespesa) {
      var categoria = dados[i][1]; // Coluna B: Categoria
      var descricao = dados[i][2]; // Coluna C: Descrição
      var dataDespesa = dados[i][3]; // Coluna D: Data
      var valor = dados[i][4]; // Coluna E: Valor
      var observacoes = dados[i][5]; // Coluna F: Observações

      resultado.push({
        ID: id,
        Categoria: categoria,
        Descrição: descricao,
        Data: dataDespesa,
        Valor: valor,
        Observações: observacoes,
      });
    }
  }

  if (resultado.length > 0) {
    Logger.log("Despesa encontrada: " + JSON.stringify(resultado));
    SpreadsheetApp.getUi().alert(
      "Despesa encontrada:\n" + JSON.stringify(resultado)
    );
  } else {
    Logger.log("Despesa com ID " + idDespesa + " não encontrada.");
    SpreadsheetApp.getUi().alert(
      "Despesa com ID " + idDespesa + " não encontrada."
    );
  }
}

// Função para adicionar novos boletos via prompt com ID gerado automaticamente com prefixo
function adicionarBoletoPorPrompt() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var abaPendencias = planilha.getSheetByName("Pendências");

  var ui = SpreadsheetApp.getUi();

  // Gera o próximo ID automaticamente com prefixo
  var prefixo = "BOL-"; // Prefixo para o ID
  var ultimaLinha = abaPendencias.getLastRow();
  var ultimoId = abaPendencias.getRange(ultimaLinha, 1).getValue(); // Coluna A (ID do boleto)
  var numeroAtual = 0;

  // Verifica se o último ID existe e começa com o prefixo
  if (typeof ultimoId === "string" && ultimoId.startsWith(prefixo)) {
    var numeroParte = ultimoId.substring(prefixo.length); // Extrai a parte numérica do ID
    numeroAtual = parseInt(numeroParte, 10); // Converte para número
    numeroAtual = isNaN(numeroAtual) ? 0 : numeroAtual; // Garante que o número seja válido
  }

  var novoNumero = numeroAtual + 1;
  var novoId = prefixo + String(novoNumero).padStart(3, "0"); // Formata o ID com 3 dígitos

  // Solicitar o nome da empresa
  var empresaResponse = ui.prompt(
    "Adicionar Boleto",
    "Digite o nome da empresa responsável:",
    ui.ButtonSet.OK_CANCEL
  );
  if (empresaResponse.getSelectedButton() != ui.Button.OK) return;
  var empresa = empresaResponse.getResponseText();

  // Solicitar a descrição do boleto
  var descricaoResponse = ui.prompt(
    "Adicionar Boleto",
    "Digite a descrição do boleto:",
    ui.ButtonSet.OK_CANCEL
  );
  if (descricaoResponse.getSelectedButton() != ui.Button.OK) return;
  var descricao = descricaoResponse.getResponseText();

  // Solicitar a data de vencimento
  var dataResponse = ui.prompt(
    "Adicionar Boleto",
    "Digite a data de vencimento (formato: DD-MM-AAAA):",
    ui.ButtonSet.OK_CANCEL
  );

  if (dataResponse.getSelectedButton() != ui.Button.OK) return;

  // Pegar a resposta do usuário
  var dataInput = dataResponse.getResponseText();

  // Verificar se o formato da data está correto (DD-MM-AAAA)
  var regexData = /^\d{2}-\d{2}-\d{4}$/;
  if (!regexData.test(dataInput)) {
    ui.alert(
      "Erro",
      "Formato de data inválido. Use o formato DD-MM-AAAA.",
      ui.ButtonSet.OK
    );
    return;
  }

  // Converter a string da data em um objeto Date
  var partesData = dataInput.split("-");
  var dia = parseInt(partesData[0], 10);
  var mes = parseInt(partesData[1], 10) - 1; // O mês em JavaScript é baseado em zero
  var ano = parseInt(partesData[2], 10);

  // Criar o objeto Date com os valores fornecidos
  var dataVencimento = new Date(ano, mes, dia);

  // Verificar se a data é válida
  if (
    dataVencimento.getDate() !== dia ||
    dataVencimento.getMonth() !== mes ||
    dataVencimento.getFullYear() !== ano
  ) {
    ui.alert(
      "Erro",
      "Data inválida. Verifique se a data está correta.",
      ui.ButtonSet.OK
    );
    return;
  }

  // Agora `dataVencimento` terá a data correta informada pelo usuário

  // Solicitar o status inicial do boleto (ex: Pendente, Pago)
  var statusResponse = ui.prompt(
    "Adicionar Boleto",
    "Digite o status do boleto (ex: Pendente, Pago):",
    ui.ButtonSet.OK_CANCEL
  );
  if (statusResponse.getSelectedButton() != ui.Button.OK) return;
  var status = statusResponse.getResponseText();

  // Inserir o boleto na próxima linha disponível
  abaPendencias.getRange(ultimaLinha + 1, 1).setValue(novoId); // Coluna A: ID do boleto (gerado automaticamente)
  abaPendencias.getRange(ultimaLinha + 1, 2).setValue(empresa); // Coluna B: Empresa
  abaPendencias.getRange(ultimaLinha + 1, 3).setValue(descricao); // Coluna C: Descrição
  abaPendencias.getRange(ultimaLinha + 1, 4).setValue(dataVencimento); // Coluna D: Data de vencimento
  abaPendencias.getRange(ultimaLinha + 1, 5).setValue(status); // Coluna E: Status
  abaPendencias.getRange(ultimaLinha + 1, 6).setValue(""); // Coluna F: Observações (Inicialmente vazio)

  // Confirmação
  SpreadsheetApp.getUi().alert("Boleto adicionado com sucesso! ID: " + novoId);
}

// Função para adicionar um novo produto
function adicionarProduto(peças, marcasPeças, quantidade, preco_in, preco_fin) {
  var aba = obterAba("Estoque");

  var ultimaLinha = aba.getLastRow() + 1;
  var dataAtual = new Date();
  var precoTotal = quantidade * preco_fin; // Atualizar para usar o preço final
  var id = "EST_" + (ultimaLinha - 1);

  var range = aba.getRange(ultimaLinha, 1, 1, 8);
  range.setValues([
    [
      id,
      peças,
      marcasPeças,
      quantidade,
      preco_in,
      preco_fin,
      dataAtual,
      precoTotal,
    ],
  ]);
}

// Função para atualizar a quantidade de um produto
function atualizarQuantidade(id, novaQuantidade) {
  var aba = obterAba("Estoque");
  var intervalo = aba.getRange(2, 1, aba.getLastRow() - 1, 1);
  var valores = intervalo.getValues();

  for (var i = 0; i < valores.length; i++) {
    if (valores[i][0] == id) {
      var precoUnitarioFin = aba.getRange(i + 2, 6).getValue(); // Atualizar para usar o preço final
      var precoTotal = novaQuantidade * precoUnitarioFin;

      aba.getRange(i + 2, 4).setValue(novaQuantidade);
      aba.getRange(i + 2, 8).setValue(precoTotal);
      aba.getRange(i + 2, 7).setValue(new Date());

      break;
    }
  }
}

// Função para adicionar um novo serviço
function adicionarServico(
  marcaVeiculos,
  placaVeiculos,
  cliente,
  descricaoServicos,
  funcionarioServico,
  dataServico,
  horarioServico,
  precoServico,
  feedback
) {
  var abaServicos = obterAba("Serviços");

  var ultimaLinhaServico = abaServicos.getLastRow() + 1;
  var id = "SER_" + (ultimaLinhaServico - 1);

  var range = abaServicos.getRange(ultimaLinhaServico, 1, 1, 10); // Atualizado para 10 colunas
  range.setValues([
    [
      id,
      marcaVeiculos,
      placaVeiculos,
      cliente,
      descricaoServicos,
      funcionarioServico,
      dataServico,
      horarioServico,
      precoServico,
      feedback,
    ],
  ]);
}

// Função para atualizar um serviço
function atualizarServico(
  id,
  marcaVeiculos,
  placaVeiculos,
  cliente,
  descricaoServicos,
  funcionarioServico,
  dataServico,
  horarioServico,
  precoServico,
  feedback
) {
  var aba = obterAba("Serviços");
  var intervalo = aba.getRange(2, 1, aba.getLastRow() - 1, 1);
  var valores = intervalo.getValues();

  for (var i = 0; i < valores.length; i++) {
    if (valores[i][0] == id) {
      aba.getRange(i + 2, 2).setValue(marcaVeiculos);
      aba.getRange(i + 2, 3).setValue(placaVeiculos);
      aba.getRange(i + 2, 4).setValue(cliente);
      aba.getRange(i + 2, 5).setValue(descricaoServicos);
      aba.getRange(i + 2, 6).setValue(funcionarioServico);
      aba.getRange(i + 2, 7).setValue(dataServico);
      aba.getRange(i + 2, 8).setValue(horarioServico);
      aba.getRange(i + 2, 9).setValue(precoServico);
      aba.getRange(i + 2, 10).setValue(feedback);

      break;
    }
  }
}

// Função para adicionar um novo fornecedor
function adicionarFornecedor(nome, contato, telefone, endereco) {
  var aba = obterAba("Fornecedores");

  var ultimaLinha = aba.getLastRow() + 1;
  var id = "FOR_" + (ultimaLinha - 1); // ID é gerado com base na última linha

  var range = aba.getRange(ultimaLinha, 1, 1, 5);
  range.setValues([[id, nome, contato, telefone, endereco]]);
}

// Função para atualizar os rendimentos
function atualizarRendimentos(lucroPecas, lucroServicos, funcionariosAtivos) {
  var abaRendimentos = obterAba("Rendimentos");

  var ultimaLinhaRendimentos = abaRendimentos.getLastRow() + 1;
  var id = "REN_" + (ultimaLinhaRendimentos - 1);

  var range = abaRendimentos.getRange(ultimaLinhaRendimentos, 1, 1, 4);
  range.setValues([[id, lucroPecas, lucroServicos, funcionariosAtivos]]);
}

// Função auxiliar para obter uma aba e verificar se existe
function obterAba(nome) {
  var aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nome);
  if (!aba) {
    throw new Error('Aba "' + nome + '" não encontrada.');
  }
  return aba;
}

// Função para verificar o estoque e enviar notificação se necessário
function verificarEstoque() {
  var abaEstoque = obterAba("Estoque");
  var intervalo = abaEstoque.getRange(2, 1, abaEstoque.getLastRow() - 1, 8); // Pega todas as colunas relevantes
  var valores = intervalo.getValues();

  var mensagem = "Alerta de Estoque:\n\n";
  var alerta = false;

  for (var i = 0; i < valores.length; i++) {
    var idPeca = valores[i][0];
    var nomePeca = valores[i][1];
    var marcaPeca = valores[i][2];
    var quantidade = valores[i][3];
    var precoUnitario = valores[i][4];
    var LucroTotal = valores[i][7]; // Atualizado para usar o preço total
    var dataUltimaAtualizacao = valores[i][6];

    if (quantidade <= 5) {
      mensagem +=
        "ID da Peça: " +
        idPeca +
        "\n" +
        "Nome da Peça: " +
        nomePeca +
        "\n" +
        "Marca da Peça: " +
        marcaPeca +
        "\n" +
        "Quantidade: " +
        quantidade +
        "\n" +
        "Preço Unitário: " +
        precoUnitario.toFixed(2) +
        "\n" +
        "Lucro Total: " +
        LucroTotal.toFixed(2) +
        "\n" +
        "Data da Última Atualização: " +
        Utilities.formatDate(
          dataUltimaAtualizacao,
          Session.getScriptTimeZone(),
          "dd/MM/yyyy"
        ) +
        "\n\n";
      alerta = true;
    }
  }

  if (alerta) {
    enviarNotificacao(mensagem);
  }
}

// Funções para solicitações de entrada de dados via prompts
function adicionarProdutoPrompt() {
  var ui = SpreadsheetApp.getUi();
  var peças = ui.prompt("Nome da Peça").getResponseText();
  var marcasPeças = ui.prompt("Marca da Peça").getResponseText();
  var quantidade = ui.prompt("Quantidade").getResponseText();
  var preco_in = ui.prompt("Preço Unitário de Compra").getResponseText();
  var preco_fin = ui.prompt("Preço Unitário de Venda").getResponseText();

  adicionarProduto(
    peças,
    marcasPeças,
    parseInt(quantidade),
    parseFloat(preco_in),
    parseFloat(preco_fin)
  );
}

function atualizarQuantidadePrompt() {
  var ui = SpreadsheetApp.getUi();
  var id = ui.prompt("ID da Peça").getResponseText();
  var novaQuantidade = ui.prompt("Nova Quantidade").getResponseText();

  atualizarQuantidade(id, parseInt(novaQuantidade));
}

function adicionarServicoPrompt() {
  var ui = SpreadsheetApp.getUi();
  var marcaVeiculos = ui.prompt("Marca do Veículo").getResponseText();
  var placaVeiculos = ui.prompt("Placa do Veículo").getResponseText();
  var cliente = ui.prompt("Nome do Cliente").getResponseText();
  var descricaoServicos = ui.prompt("Descrição dos Serviços").getResponseText();
  var funcionarioServico = ui.prompt("Funcionário").getResponseText();
  var dataServico = ui.prompt("Data do Serviço (DD/MM/YYYY)").getResponseText();
  var horarioServico = ui.prompt("Horário do Serviço").getResponseText();
  var precoServico = ui.prompt("Preço do Serviço").getResponseText();
  var feedback = ui.prompt("Feedback").getResponseText();

  adicionarServico(
    marcaVeiculos,
    placaVeiculos,
    cliente,
    descricaoServicos,
    funcionarioServico,
    dataServico,
    horarioServico,
    parseFloat(precoServico),
    feedback
  );
}

function atualizarServicoPrompt() {
  var ui = SpreadsheetApp.getUi();
  var id = ui.prompt("ID do Serviço").getResponseText();
  var marcaVeiculos = ui.prompt("Marca do Veículo").getResponseText();
  var placaVeiculos = ui.prompt("Placa do Veículo").getResponseText();
  var cliente = ui.prompt("Nome do Cliente").getResponseText();
  var descricaoServicos = ui.prompt("Descrição dos Serviços").getResponseText();
  var funcionarioServico = ui.prompt("Funcionário").getResponseText();
  var dataServico = ui.prompt("Data do Serviço (DD/MM/YYYY)").getResponseText();
  var horarioServico = ui.prompt("Horário do Serviço").getResponseText();
  var precoServico = ui.prompt("Preço do Serviço").getResponseText();
  var feedback = ui.prompt("Feedback").getResponseText();

  atualizarServico(
    id,
    marcaVeiculos,
    placaVeiculos,
    cliente,
    descricaoServicos,
    funcionarioServico,
    dataServico,
    horarioServico,
    parseFloat(precoServico),
    feedback
  );
}

function adicionarFornecedorPrompt() {
  var ui = SpreadsheetApp.getUi();
  var nome = ui.prompt("Nome do Fornecedor").getResponseText();
  var contato = ui.prompt("Contato").getResponseText();
  var telefone = ui.prompt("Telefone").getResponseText();
  var endereco = ui.prompt("Endereço").getResponseText();

  adicionarFornecedor(nome, contato, telefone, endereco);
}

function atualizarRendimentosPrompt() {
  var ui = SpreadsheetApp.getUi();
  var lucroPecas = ui.prompt("Lucro Total com Peças").getResponseText();
  var lucroServicos = ui.prompt("Lucro Total com Serviços").getResponseText();
  var funcionariosAtivos = ui
    .prompt("Número de Funcionários Ativos")
    .getResponseText();

  atualizarRendimentos(
    parseFloat(lucroPecas),
    parseFloat(lucroServicos),
    parseInt(funcionariosAtivos)
  );
}

function buscarServicoPrompt() {
  var ui = SpreadsheetApp.getUi();
  var id = ui.prompt("ID do Serviço").getResponseText();
  buscarServico(id);
}

function buscarEstoquePrompt() {
  var ui = SpreadsheetApp.getUi();
  var id = ui.prompt("ID da Peça").getResponseText();
  buscarEstoque(id);
}
