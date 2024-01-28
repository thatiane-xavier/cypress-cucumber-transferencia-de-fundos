import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
const moment = require('moment-timezone');

const randomValues = Array.from({ length: 3 }, () => (Math.random() * 1000).toFixed(2));
let currentTransactionsData = [];

Given('que estou logado no site {string} com as credenciais:', (url, dataTable) => {
    const [username, password] = dataTable.rawTable[1];
    cy.login(username, password);
});

When("realizo 3 transações de transferência com valores aleatórios na seção \"Transfer Funds\"", () => {
    randomValues.forEach((value) => {
        cy.makeTransfer("800002", "800003", value);
    })
});

And("aplico um filtro na seção \"View Recent Transactions\" para visualizar minhas transações", () => {
    const currentDate = moment().tz('America/Guatemala').format('YYYY-MM-DD'); //Fuso horário da apicação
    cy.get("#MenuHyperLink2").click();
    cy.get("#startDate").type(currentDate);
    cy.get("#endDate").type(currentDate);
    cy.get('#Form1').submit();
})

Then("minhas transferências aparecem na listagem", () => {
    cy.get("#_ctl0__ctl0_Content_Main_MyTransactions").find("tr").each(($row) => {
        const transactionID = $row.find("td:nth-child(1)").text();
        const transactionTime = $row.find("td:nth-child(2)").text();
        const transactionAmount = $row.find("td:nth-child(5)").text();

        randomValues.forEach((value) => {
            if (transactionAmount.includes(value)) {
                currentTransactionsData.push({
                    transactionID: transactionID,
                    transactionTime: transactionTime,
                    transactionAmount: transactionAmount,
                });
            }
        }); 
    });

    cy.wrap(currentTransactionsData).should('have.lengthOf', 6); //3 transações de saída e 3 transações de entrada
});

And("minhas transferencias são salvas em um arquivo JSON de modo incremental", () => {
    cy.readFile('./cypress/jsons/transferencias.json').then((fileData) => {
        let transactions = fileData;
        transactions = [...currentTransactionsData, ...transactions];
        cy.writeFile('./cypress/jsons/transferencias.json', transactions);
    });
})


