Feature: Transferência de Fundos

  Scenario: Realização de 3 transações de transferência, verificação e armazenamento
    Given que estou logado no site "http://demo.testfire.net/bank/transfer.jsp" com as credenciais:
      | Usuario | Senha    |
      | jsmith  | Demo1234 |
    When realizo 3 transações de transferência com valores aleatórios na seção "Transfer Funds"
    And aplico um filtro na seção "View Recent Transactions" para visualizar minhas transações
    Then minhas transferências aparecem na listagem
    And minhas transferencias são salvas em um arquivo JSON de modo incremental



