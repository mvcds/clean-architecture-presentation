describe("Delete todo", () => {
  before(() => {
    cy.visit("/");
    cy.get(".new-todo").type("Delete me{enter}");
    //We need to force it because Cypress doesn't allow clicks on invisible elements
    //The problem is that Cypress does not have a "hover" function
    cy.get(".todo .destroy").click({ force: true });
  });

  it("Does not find any todo", () => {
    cy.get(".todo").should("not.exist");
  });
});
