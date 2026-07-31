describe("Frontend Login", () => {

  const url = "http://localhost:5173";


  it("connects", () => {

    cy.visit(`${url}/login`);

  });


  it("login success", () => {

    cy.visit(`${url}/login`);


    cy.get("input[type='email']")
      .type("john@gmail.com");


    cy.get("input[type='password']")
      .type("john1234");


    cy.get("button[type='submit']")
      .click();


    cy.url()
      .should("include", "/dashboard");


    cy.window()
      .then((win) => {

        const token =
          win.localStorage.getItem("token");


        expect(token)
          .to.exist;

      });

  });


  it("login failed", () => {

    cy.visit(`${url}/login`);


    cy.get("input[type='email']")
      .type("test@example.com");


    cy.get("input[type='password']")
      .type("wrongpassword");


    cy.get("button[type='submit']")
      .click();


    cy.contains(
      "Invalid email or password"
    )
    .should("exist");

  });


});

describe("Frontend Overview", () => {

  const url = "http://localhost:5173";


  beforeEach(() => {

    cy.visit(`${url}/login`);


    cy.get("input[type='email']")
      .type("john@gmail.com");


    cy.get("input[type='password']")
      .type("john1234");


    cy.get("button[type='submit']")
      .click();


    cy.url()
      .should("include", "/dashboard");


  });


  it("connects overview page", () => {

  cy.visit("http://localhost:5173/dashboard");


  cy.window()
    .then((win)=>{

      const token =
        win.localStorage.getItem("token");

      expect(token)
        .to.exist;

    });


  it("connects overview data on dashboard", () => {

  cy.visit(
    "http://localhost:5173/dashboard"
  );


  cy.contains("Overview")
    .should("exist");

});
});

});