describe("Giving credit to author", () => {
  it("Performs a smoke test on the app", () => {
    cy.visit("/");
    cy.contains("p", "Written by Evan You");
  });
});
