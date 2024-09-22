Automação de Planilhas Google com Google Apps Script
Este repositório contém scripts desenvolvidos em Google Apps Script para automatizar diversos processos de controle financeiro e de estoque em planilhas do Google Sheets. As funcionalidades implementadas incluem verificação e envio de alertas de estoque, busca de informações sobre serviços e peças, formatação automática de planilhas, controle de boletos e gestão de despesas. A seguir, uma breve descrição dos principais scripts:

Scripts:
ALFA.JS:
Centraliza várias funções de gerenciamento e adição de itens (produtos, serviços, fornecedores, boletos e despesas). Este script cria um menu personalizado no Google Sheets para facilitar a execução das operações, como adicionar novos serviços, atualizar quantidades de produtos e verificar o estoque ou status de boletos​(STYLE).

BOLETO.JS:
Automação do controle de boletos, incluindo a verificação de vencimentos, busca por boletos por ID e status, e categorização automática de boletos como "Ativo", "Vencido" ou "Pago"​(BOLETO).

BUSCA.JS:
Implementa funções de busca no Google Sheets, permitindo a consulta de serviços e peças por ID, exibindo os resultados diretamente na interface do usuário​(BUSCA).

EMAIL.JS:
Verifica o estoque de peças e envia notificações por e-mail caso a quantidade de algum item esteja abaixo do mínimo estabelecido. Inclui também a geração de mensagens de alerta detalhadas​(EMAIL).

STYLE.JS:
Aplica formatações profissionais às planilhas, como cabeçalhos com cores e fontes específicas e cores alternadas para facilitar a leitura dos dados​(STYLE).

Como utilizar:
Copie os scripts para o editor de Google Apps Script vinculado à sua planilha do Google Sheets.
Ajuste os parâmetros e nomes das abas conforme necessário.
Execute os scripts diretamente no Google Sheets para automatizar seus processos de controle financeiro e gerencial.
