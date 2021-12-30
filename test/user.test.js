const app = require("../src/app");
const supertest = require("supertest");
const faker = require("faker");

const request = supertest(app);

const mainUser = {
  name: "Mário Santos",
  email: "mariosantos@email.com",
  password: "123456",
};

beforeAll(() => {
  return request
    .post("/user")
    .send(mainUser)
    .then((res) => {})
    .catch((error) => console.log(error));
});

afterAll(() => {
  return request
    .delete(`/user/${mainUser.email}`)
    .then((res) => {})
    .catch((error) => console.log(error));
});

describe("SignUp User", () => {
  it("Should sign up user with success", () => {
    let name = faker.name.firstName();
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

  it("Should prevent sign up clone user", () => {
    return request
      .post("/user")
      .send(mainUser)
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
      .send({ email: mainUser.email, password: mainUser.password })
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
      .send({ name: mainUser.name, password: mainUser.password })
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
      .send({ email: mainUser.email, name: mainUser.name })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.messageError).toEqual('Field "Password" is missing.');
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});

describe("SignIn User", () => {
  it("Should return a token when sign in is success.", () => {
    return request
      .post("/auth")
      .send({ email: mainUser.email, password: mainUser.password })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should prevent sign in with empty 'email' field.", () => {
    return request
      .post("/auth")
      .send({ password: mainUser.password })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.messageError).toBeDefined();
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should prevent sign in with empty 'password' field.", () => {
    return request
      .post("/auth")
      .send({ email: mainUser.email })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.messageError).toBeDefined();
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should prevent sign in with invalid 'email'.", () => {
    return request
      .post("/auth")
      .send({ email: "email@invalid.com", password: mainUser.password })
      .then((res) => {
        expect(res.statusCode).toBe(403);
        expect(res.body.messageError).toEqual("Email or password is invalid.");
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should prevent sign in with invalid 'password'.", () => {
    return request
      .post("/auth")
      .send({ email: mainUser.email, password: "invalidPassword" })
      .then((res) => {
        expect(res.statusCode).toBe(403);
        expect(res.body.messageError).toEqual("Email or password is invalid.");
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});
