const app = require("../src/app");
const supertest = require("supertest");
const faker = require("faker");

const request = supertest(app);

describe("SignUp User", () => {
  let name = faker.name.firstName();
  let email = faker.internet.email();
  let password = faker.internet.password();
  let user = { name, email, password };

  it("Should sign up user with success", () => {
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

  it("Should prevent sign up clone user", () => {
    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.messageError).toEqual(
          "Already exist user with it email."
        );
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should prevent sign up with empty 'name' field", () => {
    return request
      .post("/user")
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.messageError).toEqual('Field "Name" is missing.');
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should prevent sign up with empty 'email' field", () => {
    return request
      .post("/user")
      .send({ name, password })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.messageError).toEqual('Field "Email" is missing.');
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should prevent sign up with empty 'password' field", () => {
    return request
      .post("/user")
      .send({ email, name })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.messageError).toEqual('Field "Password" is missing.');
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});
