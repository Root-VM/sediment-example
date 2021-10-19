import { expect } from "@jest/globals";
import GlobalDataInit from "./common";
import { authToken, deleteToken } from "../api/auth";
import TokenProvider from "../providers/tokenProvider";

new GlobalDataInit();

describe("auth methods", () => {
  test("check if auth validation is returned", async () => {
    const formData = new FormData();
    const result = await authToken(formData);

    // if we dont set correct data so will det validation message
    expect.stringContaining(result["detail"]);
  });

  test("has been removed token", async () => {
    TokenProvider.init(true);
    const result = await deleteToken();

    // must return undefined
    expect(result).toBeUndefined();
    expect(TokenProvider.getToken()).toBeNull();
  });
});
