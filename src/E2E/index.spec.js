import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

let app;

describe("/api/auth", () => {
  beforeAll(() => {
    mongoose // Connect to the databse
      .connect("mongodb://localhost:27017/express_learning_test")
      .then(() => console.log("Connected to Database"))
      .catch((err) => console.log(err));

    app = createApp();
  });

  it("Should Return 401 Status Code when not Logged In", async () => {
    const response = await request(app).get("/api/auth/status");
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
