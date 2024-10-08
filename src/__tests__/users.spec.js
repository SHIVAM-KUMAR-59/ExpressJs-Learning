import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { users } from "../utils/constants.mjs";
import * as validator from "express-validator";
import * as helpers from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

// Mock express-validator package
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "Invalid Credentials" }]),
  })),

  // Mock matchedData function
  matchedData: jest.fn(() => ({
    name: "test",
    email: "test@gmail.com",
    password: "password",
  })),
}));

// Mock the hashPassword function
jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

// Mock the user object
jest.mock("../mongoose/schemas/user.mjs");

const mockRequest = {
  findUserIndex: 1,
};

const mockResponse = {
  // Creates a mock function. Optionally takes a mock implementation.
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe("get users", () => {
  it("Should get user by Id", () => {
    getUserByIdHandler(mockRequest, mockResponse); // Function under test
    // Test to make sure user is actually found and sent back
    // The expect function is used every time you want to test a value.
    expect(mockResponse.send).toHaveBeenCalled(); // toHaveBeenCalled() Ensures that a mock function is called.
    expect(mockResponse.send).toHaveBeenCalledWith(users[1]); // toHaveBeenCalledWith() Ensure that a mock function is called with specific arguments.
    expect(mockResponse.send).toHaveBeenCalledTimes(1); // toHaveBeenCalledTimes() Ensures that a mock function is called an exact number of times.
  });

  it("Should call sendStatus() with status code of 404 when user is not found", () => {
    const copyMockRequest = {
      ...mockRequest,
      findUserIndex: 100,
    };
    getUserByIdHandler(copyMockRequest, mockResponse); // Function under test
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

describe("Create Users", () => {
  // Unit Test if the validation result function returns empty objetc
  const mockRequest = {};
  it("Should Return a Status of 400 when there are errors", async () => {
    await createUserHandler(mockRequest, mockResponse); // Function  under test
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([
      { msg: "Invalid Credentials" },
    ]);
  });

  it("Should Return Statuss of 201 and User Created", async () => {
    // To override the isEmpty written before
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    // To override the save method on the user object and mock the data in it
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce({
        id: 1,
        name: "test",
        email: "test@gmail.com",
        password: "hashed_password",
      });

    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith("password");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
    expect(User).toHaveBeenCalledWith({
      name: "test",
      email: "test@gmail.com",
      password: "hashed_password",
    });
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 1,
      name: "test",
      email: "test@gmail.com",
      password: "hashed_password",
    });
  });

  it("Should Send Status of 404 when Database Failed to save User", async () => {
    // To override the isEmpty written before
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    // To override the save method on the user object and give error
    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() => Promise.reject("Failed to Save User"));

    await createUserHandler(mockRequest, mockResponse);
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
