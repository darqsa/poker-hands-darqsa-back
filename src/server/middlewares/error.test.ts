import { NextFunction, Request, Response } from "express";
import { errors, ValidationError } from "express-validation";
import { CustomError } from "../types/interfaces";
import { generalError, notFoundError } from "./error";

describe("Given a notFoundError function", () => {
  describe("When receives a response object", () => {
    const req = {} as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    test("Then it should call the response method with 404", () => {
      const status = 404;

      notFoundError(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the response json method with the message 'Endpoint not found'", () => {
      const testError = { error: "Endpoint not found" };

      notFoundError(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(testError);
    });
  });
});

describe("Given a generalError function", () => {
  describe("When receives a response object", () => {
    describe("And receives an error that has 222 as errorStatus and 'pete error' as publicErrorMessage", () => {
      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn();

      test("Then it should call the response method with 222", () => {
        const status = 222;

        const error = new Error() as CustomError;
        error.statusCode = status;
        error.publicMessage = "";

        generalError(
          error,
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(status);
      });

      test("Then it should call the response json method with 'pete error'", () => {
        const message = "pete error";

        const error = new Error() as CustomError;
        error.statusCode = 1;
        error.publicMessage = message;

        const testError = { error: message };

        generalError(
          error,
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith(testError);
      });

      describe("And don't receives no public message and code", () => {
        test("Then it should call the response json method with 'General error'", () => {
          const message = "General error";

          const error = new Error() as CustomError;

          const testError = { error: message };

          generalError(
            error,
            req as Request,
            res as Response,
            next as NextFunction
          );

          expect(res.json).toHaveBeenCalledWith(testError);
        });
      });
    });

    describe("When it receives a valition error", () => {
      const error = new ValidationError(
        { body: [{ message: "error" }] } as errors,
        {}
      );

      const req = {} as Partial<Request>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const next = jest.fn();

      test("Then it should call the response status method with 400 status", () => {
        const expectedStatus = 400;
        error.statusCode = expectedStatus;

        generalError(
          error as unknown as CustomError,
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should call the response json method with the 'Invalid data' message", () => {
        const expectedErrorMessage = {
          error: "Wrong data",
        };

        generalError(
          error as unknown as CustomError,
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.json).toHaveBeenCalledWith(expectedErrorMessage);
      });
    });
  });
});
