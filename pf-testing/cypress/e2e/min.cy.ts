// cypress/e2e/min.cy.ts

describe("Backend", () => {

  const url = "http://localhost:3001";
  let token = "";


  before(() => {

    cy.request({
      method: "POST",
      url: `${url}/auth/login`,
      body: {
        email: "john@gmail.com",
        password: "john1234"
      }
    }).then((res) => {

      expect(res.status)
        .eq(200);

      token = res.body.token;

    });

  });


  it("checks overview response", () => {

    cy.request({

      method: "GET",

      url: `${url}/overview`,

      headers: {
        Authorization:
          `Bearer ${token}`
      }

    }).then((res) => {

      expect(res.status)
        .eq(200);


      expect(res.body)
        .to.be.an("object");

    });

  });

});



describe("Frontend", () => {

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


  it("connects dashboard", () => {


    cy.intercept(
      "GET",
      "/api/events"
    ).as("events");


    cy.visit(`${url}/dashboard`);


    cy.wait("@events")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);


  });

});