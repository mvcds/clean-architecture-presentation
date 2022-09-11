describe("Create todos", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".new-todo").type("Add the first todo{enter}");
  });

  it("Shows the filteres", () => {
    cy.get(".filters").should("be.visible");
  });

  describe("First todo", () => {
    it("Counts how many todos exist", () => {
      cy.get(".todo-count").should("be.visible").contains("1 item left");
    });
  });

  describe("Second todo", () => {
    it("Updates the counter", () => {
      cy.get(".new-todo").type("And then the second{enter}");
      cy.get(".todo-count").should("be.visible").contains("2 items left");
    });
  });
});
