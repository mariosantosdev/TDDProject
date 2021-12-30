const app = require("../src/app");
const supertest = require("supertest");
const faker = require("faker");

const request = supertest(app);

describe("SignUp User", () => {
  it("Should sign up user with success", () => {
    let name = faker.name;
    let email = faker.internet.email();
    let password = faker.internet.password();
    let user = { name, email, password };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body.email).toEqual(email);
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});
