// require("leaked-handles").set({
//   fullStack: true, // use full stack traces
//   timeout: 10000, // run every 30 seconds instead of 5.
//   debugSockets: true, // pretty print tcp thrown exceptions.
// });
import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  // console.log(response.body);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send({})
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
