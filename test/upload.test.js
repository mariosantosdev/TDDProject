const app = require("../src/app");
const supertest = require("supertest");

const request = supertest(app);

const mainUser = {
  name: "Mário Santos",
  email: "mariosantos@email.com",
  password: "123456",
};

let token = "kdaskda";
let uploadPhotoId;

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
        uploadPhotoId = res.body.image._id;
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should reject upload when not send image", () => {
    return request
      .post("/upload")
      .auth(token, { type: "bearer" })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.messageError).toBe("File is missing.");
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  it("Should reject upload when not send JWT", () => {
    return request
      .post("/upload")
      .attach("file", "test/assets/img.jpeg")
      .then((res) => {
        expect(res.statusCode).toBe(403);
        expect(res.body.messageError).toBe("Token is missing.");
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});

describe("Delete Images", () => {
  it("Should delete an image with success.", () => {
    return request
      .delete(`/upload/${uploadPhotoId}`)
      .auth(token, { type: "bearer" })
      .then((res) => {
        expect(res.statusCode).toBe(200);
      })
      .catch((err) => {
        throw new Error(err);
      });
  });

  it("Should recuse delete an image without JWT.", () => {
    return request
      .delete(`/upload/${uploadPhotoId}`)
      .then((res) => {
        expect(res.statusCode).toBe(403);
        expect(res.body.messageError).toBe("Token is missing.");
      })
      .catch((err) => {
        throw new Error(err);
      });
  });

  it("Should recuse delete an image of different user.", () => {
    const localtoken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpvY2VseW4uSGF1Y2s5MkB5YWhvby5jb20iLCJuYW1lIjoiTWF5IiwiaWQiOiI2MWNlM2Y1YmM3N2VkZjVjZDZiYTZlYTciLCJpYXQiOjE2NDA5MTA2NjksImV4cCI6MTY0MTA4MzQ2OX0.IRC2JVYoLg0DbPcCVDG3wnGMc7CcbrQQfiAKEk0nyFw";

    return request
      .post("/upload")
      .auth(token, { type: "bearer" })
      .attach("file", "test/assets/img.jpeg")
      .then((res) => {
        return request
          .delete(`/upload/${res.body.image._id}`)
          .auth(localtoken, { type: "bearer" })
          .then((res) => {
            expect(res.statusCode).toBe(403);
            expect(res.body.messageError).toBe("This upload is of other user.");
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
});
