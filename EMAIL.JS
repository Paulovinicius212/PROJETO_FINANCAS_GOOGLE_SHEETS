// Função principal para verificar o estoque
function verificarEstoque() {
  const abaEstoque = obterAba("Estoque");
  if (!abaEstoque) {
    Logger.log('Aba "Estoque" não encontrada.');
    return;
  }

  const valores = obterValoresEstoque(abaEstoque);
  const mensagem = gerarMensagemDeAlerta(valores);

  if (mensagem) {
    enviarNotificacao(mensagem);
  }
}

// Função para obter a aba do Google Sheets
function obterAba(nomeAba) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nomeAba);
}

// Função para obter os valores da aba de estoque
function obterValoresEstoque(abaEstoque) {
  const intervalo = abaEstoque.getRange(2, 1, abaEstoque.getLastRow() - 1, 8); // Pega todas as colunas relevantes
  return intervalo.getValues();
}

// Função para gerar a mensagem de alerta
function gerarMensagemDeAlerta(valores) {
  let mensagem = "Alerta de Estoque:\n\n";
  let alerta = false;

  valores.forEach((valor) => {
    const [
      idPeca,
      nomePeca,
      marcaPeca,
      quantidade,
      precoUnitario,
      ,
      dataUltimaAtualizacao,
      lucroTotal,
    ] = valor;

    // Certifica-se de que quantidade é um número e se a data é válida
    if (typeof quantidade === "number" && quantidade <= 5) {
      // Verifica se precoUnitario e precoTotal são números
      const precoUnitarioFormatado = isNaN(precoUnitario)
        ? "N/A"
        : precoUnitario.toFixed(2);
      const lucroTotalFormatado = isNaN(lucroTotal)
        ? "N/A"
        : lucroTotal.toFixed(2);

      // Certifica-se de que a data é válida
      const dataFormatada =
        dataUltimaAtualizacao instanceof Date
          ? Utilities.formatDate(
              dataUltimaAtualizacao,
              Session.getScriptTimeZone(),
              "dd/MM/yyyy"
            )
          : "Data inválida";

      mensagem +=
        `ID da Peça: ${idPeca}\n` +
        `Nome da Peça: ${nomePeca}\n` +
        `Marca da Peça: ${marcaPeca}\n` +
        `Quantidade: ${quantidade}\n` +
        `Preço Unitário: ${precoUnitarioFormatado}\n` +
        `Lucro Total: ${lucroTotalFormatado}\n` +
        `Data da Última Atualização: ${dataFormatada}\n\n`;
      alerta = true;
    }
  });

  return alerta ? mensagem : null;
}

// Função para enviar notificação por e-mail
function enviarNotificacao(mensagem) {
  const destinatario = "Otopvinicius@gmail.com"; // Substitua pelo seu e-mail
  const assunto = "Alerta de Estoque - Peças Abaixo do Mínimo";

  MailApp.sendEmail(destinatario, assunto, mensagem);
}
