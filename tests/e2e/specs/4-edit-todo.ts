describe("Edit todo", () => {
  before(() => {
    cy.visit("/");
    cy.get(".new-todo").type("Fix me{enter}");
  });

  it("Edits the todo", () => {
    cy.contains(".todo label", "Fix me");
    cy.get(".todo label").dblclick();
    cy.get(".todo .edit").type(" under the moon light{enter}");
    cy.contains(".todo label", "Fix me under the moon light");
  });
});
