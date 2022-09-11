const createTodo = (title: string, completed = false) => {
  return {
    id: 0,
    title,
    completed,
  };
};

describe("Persistency", () => {
  after(() => {
    cy.clearLocalStorage("todo");
  });

  describe("Reading", () => {
    before(() => {
      const todos = [
        createTodo("First"),
        createTodo("Second", true),
        createTodo("Third", true),
        createTodo("Fourth"),
        createTodo("Fifth"),
      ];

      const content = JSON.stringify(todos);
      localStorage.setItem("todos", content);

      cy.visit("/");
    });

    it("Loads previously created todos", () => {
      cy.get(".todo").should("have.length", 5);
    });
  });

  describe("Write", () => {
    before(() => {
      cy.visit("/");
    });

    it("Remembers the created todos", () => {
      cy.get(".todo").should("have.length", 0);
      cy.get(".new-todo").type("Add the first todo{enter}");
      cy.get(".todo").should("have.length", 1);
      cy.reload();
      cy.get(".todo").should("have.length", 1);
    });
  });
});
