const app = require("../src/app");
const supertest = require("supertest");

const request = supertest(app);

it("Should listen in port 3030", () => {
  return request
    .get("/", (res) => {
      expect(res.statusCode).toEqual(200);
    })
    .catch((error) => {
      throw new Error(error);
    });
});
