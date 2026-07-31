describe("Login", () => {

  it("user can login", () => {

    cy.visit("http://localhost:5173/login");


    cy.get("[data-cy=email]")
      .type("john@gmail.com");


    cy.get("[data-cy=password]")
      .type("john1234");


    cy.get("[data-cy=login-button]")
      .click();


    // ตรวจว่าหน้าเปลี่ยน
    cy.url()
      .should("include", "/dashboard");


    // ตรวจ token
    cy.window()
      .then((win) => {

        const token =
          win.localStorage.getItem("token");

        expect(token)
          .to.exist;

      });

  });


  it("shows error with wrong password",()=>{

    cy.visit("http://localhost:5173/login");


    cy.get("[data-cy=email]")
      .type("test@example.com");


    cy.get("[data-cy=password]")
      .type("wrongpassword");


    cy.get("[data-cy=login-button]")
      .click();


    cy.get("[data-cy=login-error]")
    .should("exist")
    .and("not.be.empty");

  });

});

describe("Backend Overview", () => {

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



  it("gets overview", () => {

  cy.request({

    method: "GET",

    url: `${url}/overview`,

    headers: {
      Authorization: `Bearer ${token}`
    }

  }).then((res) => {


    expect(res.status)
      .eq(200);


    expect(res.body)
      .to.be.an("object");


    expect(res.body)
      .to.have.keys(
        "overdue",
        "high",
        "medium",
        "low"
      );


  });

});

});