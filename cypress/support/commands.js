Cypress.Commands.add('login', (user, password) => {
  cy.visit('/transfer.jsp');
  cy.get("#uid").type(user);
  cy.get("#passw").type(password);
  cy.get('#login').submit();
  cy.url().should('include', '/main')
});

Cypress.Commands.add('makeTransfer', (fromAccount, toAccount, amount) => {
    cy.get("#MenuHyperLink3").click();
    cy.get("#fromAccount").select(fromAccount);
    cy.get("#toAccount").select(toAccount);
    cy.get("#transferAmount").type(amount);
    cy.get('#tForm').submit();
    cy.get('#_ctl0__ctl0_Content_Main_postResp').should('contain', 'was successfully transferred');
});



