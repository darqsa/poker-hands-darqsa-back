import { CustomError } from "../server/types/interfaces";
import createCustomError from "./createCustomError";

describe("Given a createCustomError function", () => {
  describe("When invoked and gets 222 as code, 'hola' as message and the error message as private", () => {
    test("Then it should return a new error with code 222, public message and private message", () => {
      const code = 222;
      const publicMessage = "hola";
      const privateMessage = "adios";

      const fakeError = createCustomError(code, publicMessage, privateMessage);

      const expectedError = new Error() as CustomError;
      expectedError.statusCode = code;
      expectedError.publicMessage = publicMessage;
      expectedError.privateMessage = privateMessage;

      expect(fakeError).toStrictEqual(expectedError);
    });
  });
});
