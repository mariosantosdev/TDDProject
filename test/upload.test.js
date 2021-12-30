const app = require("../src/app");
const supertest = require("supertest");

const request = supertest(app);

const mainUser = {
  name: "Mário Santos",
  email: "mariosantos@email.com",
  password: "123456",
};

let token = "kdaskda";
let photoURL;

beforeAll(async () => {
  try {
    await request.post("/user").send(mainUser);

    const { body } = await request
      .post("/auth")
      .send({ email: mainUser.email, password: mainUser.password });

    token = body.token;
  } catch (error) {
    console.log(error);
  }
});

afterAll(() => {
  return request
    .delete(`/user/${mainUser.email}`)
    .then((res) => {})
    .catch((error) => console.log(error));
});

describe("Upload Images", () => {
  it("Should upload an image with success.", () => {
    return request
      .post("/upload")
      .auth(token, { type: "bearer" })
      .attach("file", "test/assets/img.jpeg")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.image.link).toBeDefined();
        photoURL = res.body.image.link;
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});
