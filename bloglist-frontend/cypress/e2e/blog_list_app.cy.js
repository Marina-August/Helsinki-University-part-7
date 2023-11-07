describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Name Surname",
      username: "namesurname",
      password: "sekret",
    };
    const user2 = {
      name: "User2",
      username: "useruser",
      password: "nosekret",
    };

    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.request("POST", "http://localhost:3003/api/users/", user2);

    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("username");
    cy.contains("password");
    cy.contains("log in").click();
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("log in").click();
      cy.get("#username").type("namesurname");
      cy.get("#password").type("sekret");
      cy.get("#login-button").click();

      cy.contains("Name Surname logged in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("log in").click();
      cy.get("#username").type("namesurname");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.contains("Wrong credentials");
      cy.get(".error")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(174, 9, 9)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "namesurname", password: "sekret" });
    });

    it("A blog can be created", function () {
      cy.visit("http://localhost:5173");
      cy.contains("new blog").click();
      cy.get("#title").type("Test title");
      cy.get("#author").type("Test author");
      cy.get("#url").type("Test url");
      cy.get("#create-button").click();
      cy.contains("Test title");
    });

    it("A user can like a blog", function () {
      cy.contains("new blog").click();

      cy.createBlog({
        title: "Test title",
        author: "Test author",
        url: "Test url",
      });

      cy.contains("Test title").parent().find("#view_button").click();

      cy.contains("Test title").parent().find("#like_button").click();

      cy.get("#likes_count").contains("likes 1");
    });

    it("A user who created a blog can delete it", function () {
      cy.contains("new blog").click();

      cy.createBlog({
        title: "Test title",
        author: "Test author",
        url: "Test url",
      });

      cy.contains("Test title").parent().find("#view_button").click();

      cy.contains("Test title").parent().find("#remove_button").click();

      cy.window().then((win) => {
        cy.stub(win, "confirm").returns(true);
      });

      cy.contains("Test title").should("not.exist");
    });

    it("Only the creator can see remove button", function () {
      cy.contains("new blog").click();

      cy.createBlog({
        title: "Test title",
        author: "Test author",
        url: "Test url",
      });

      cy.contains("logout").click();

      cy.login({ username: "useruser", password: "nosekret" });

      cy.contains("Test title").parent().find("#view_button").click();

      cy.contains("remove").should("not.exist");
    });

    it("Blogs are ordered according to likes", function () {
      cy.contains("new blog").click();

      cy.createBlog({
        title: "Test title 1",
        author: "Test author 1",
        url: "Test url 1",
      });

      cy.createBlog({
        title: "Test title 2",
        author: "Test author 2",
        url: "Test url 2",
      });

      cy.createBlog({
        title: "Test title 3",
        author: "Test author 3",
        url: "Test url 3",
      });

      cy.contains("Test title 1").parent().find("#view_button").click();

      cy.contains("Test title 1").parent().find("#like_button").click();

      cy.contains("Test title 2").parent().find("#view_button").click();

      cy.contains("Test title 2").parent().find("#like_button").click();
      cy.contains("Test title 2").parent().find("#like_button").click();

      cy.contains("Test title 3").parent().find("#view_button").click();

      cy.contains("Test title 3").parent().find("#like_button").click();
      cy.contains("Test title 3").parent().find("#like_button").click();
      cy.contains("Test title 3").parent().find("#like_button").click();

      cy.get(".blog_container").eq(0).should("contain", "Test title 3");
      cy.get(".blog_container").eq(1).should("contain", "Test title 2");
      cy.get(".blog_container").eq(2).should("contain", "Test title 1");
    });
  });
});
