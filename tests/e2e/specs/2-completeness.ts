describe("Completeness", () => {
  before(() => {
    cy.visit("/");
    cy.get(".new-todo").type("Complete my first todo{enter}");
    cy.get(".toggle").check();
  });

  describe("With one todo", () => {
    it("Checks the input for all toggles", () => {
      cy.get("#toggle-all").should("be.checked");
    });

    it("Updates the counter", () => {
      cy.get(".todo-count").should("be.visible").contains("0 items left");
    });

    it("Shows the button to complete all todos", () => {
      cy.get(".clear-completed").should("be.visible");
    });
  });

  describe("With two todos", () => {
    before(() => {
      cy.get(".new-todo").type("Adds a second todo{enter}");
    });

    describe("When one is still active", () => {
      it("Checks the input for all toggles", () => {
        cy.get("#toggle-all").should("be.not.checked");
      });

      it("Updates the counter", () => {
        cy.get(".todo-count").should("be.visible").contains("1 item left");
      });

      it("Shows the button to complete all todos", () => {
        cy.get(".clear-completed").should("be.visible");
      });
    });

    describe("When all todos are complete", () => {
      before(() => {
        cy.get(".toggle").check();
      });

      it("Checks the input for all toggles", () => {
        cy.get("#toggle-all").should("be.checked");
      });

      it("Updates the counter", () => {
        cy.get(".todo-count").should("be.visible").contains("0 items left");
      });

      it("Shows the button to complete all todos", () => {
        cy.get(".clear-completed").should("be.visible");
      });
    });
  });

  describe("Clear all", () => {
    before(() => {
      cy.get(".clear-completed").click();
    });

    it("Cannot select non-existing todos", () => {
      cy.get("#toggle-all").should("not.be.visible");
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
  });
});
