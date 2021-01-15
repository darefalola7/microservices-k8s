// require("leaked-handles");
import request from "supertest";
import { app } from "../../app";

it("faild when an email that not exists is supplied ", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "passord",
    })
    .expect(400);
});

it("returns a cookie when correct credentials is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app).post("/api/users/signin").send({
    email: "test@test.com",
    password: "password",
  });
  //     .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
