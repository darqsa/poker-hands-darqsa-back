import "../loadEnv";
import bcrypt from "bcryptjs";
import { createToken, compareHash, createHash, verifyToken } from "./auth";
import { UserPayload } from "../server/types/interfaces";

const mockJwtPayload = { id: "", iat: 1512341253 };

const mockSign = jest.fn().mockReturnValue("#");
const mockVerify = jest.fn().mockReturnValue(mockJwtPayload);

jest.mock("jsonwebtoken", () => ({
  sign: (payload: UserPayload) => mockSign(payload),
  verify: (token: string) => mockVerify(token),
}));

describe("Given a hashCreate function", () => {
  describe("When instantiated with a password as an argument", () => {
    test("Then it should call bcrypt with said password and a salt of 10, and return its returned value", () => {
      const password = "admin";
      const salt = 10;

      bcrypt.hash = jest.fn().mockReturnValue("#");

      const returnedValue = createHash(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a createToken function", () => {
  describe("When called with a payload as an argument", () => {
    test("Then it should call jwt and return its returned value", () => {
      const mockToken: UserPayload = {
        id: "1234",
        username: "aaa",
      };

      const returnedValue = createToken(mockToken);

      expect(mockSign).toHaveBeenCalledWith(mockToken);
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a hashCompare function", () => {
  describe("When called with two strings (a hash and a hash  to compare)", () => {
    test("Then it should call bcrypt compare with said arguments and return its returned value", () => {
      const hashToCompare = "#";
      const hash = "#";

      bcrypt.compare = jest.fn().mockReturnValue("#");

      const returnedValue = compareHash(hashToCompare, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(hashToCompare, hash);
      expect(returnedValue).toBe("#");
    });
  });
});

describe("Given a verifyToken function", () => {
  describe("When called with a strings (a token)", () => {
    test("Then it should call jwt to verify it matches the secret and return a valid payload object", () => {
      const returnedValue = verifyToken("token");

      expect(mockVerify).toHaveBeenCalledWith("token");
      expect(returnedValue).toBe(mockJwtPayload);
    });
  });
});
