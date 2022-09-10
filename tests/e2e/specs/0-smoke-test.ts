describe("Smoke Test", () => {
  before(() => {
    cy.visit("/");
  });

  it("Presents a title", () => {
    cy.contains("h1", "todos");
  });

  it("Cannot select non-existing todos", () => {
    cy.get("#toggle-all").should("not.be.visible");
  });

  it("Allow new todos", () => {
    cy.get(".new-todo");
  });

  it("Hides message about remaining todos", () => {
    cy.get(".todo-count").should("not.be.visible");
  });

  it("Hides the filters", () => {
    cy.get(".filters").should("not.be.visible");
  });

  it("Hides the button to complete all todos", () => {
    cy.get(".clear-completed").should("not.be.visible");
  });

  it("Informs how to edit todos", () => {
    cy.contains("p", "Double-click to edit a todo");
  });

  it("Gives credits to the original program", () => {
    cy.contains("p", "Written by Evan You");
    cy.contains("p", "Part of TodoMVC");
  });
});
