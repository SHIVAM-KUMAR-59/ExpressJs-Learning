import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

let app;

describe("create user and login", () => {
  beforeAll(() => {
    mongoose // Connect to the databse
      .connect("mongodb://localhost:27017/express_learning_test")
      .then(() => console.log("Connected to Database"))
      .catch((err) => console.log(err));

    app = createApp();
  });

  it("Should Create the User", async () => {
    const response = await request(app).post("/api/users").send({
      name: "adam123",
      email: "adam@gmail.com",
      password: "password",
    });

    expect(response.statusCode).toBe(201);
  });

  it("Should Log the User in and visit visit /api/auth/status and Return Authenticated User", async () => {
    const response = await request(app)
      .post("/api/auth")
      .send({
        name: "adam123",
        password: "password",
      })
      .then((res) =>
        request(app)
          .get("/api/auth/status")
          .set("Cookie", res.headers["set-cookie"])
      );

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("adam123");
    expect(response.body.email).toBe("adam@gmail.com");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
