import { expect } from "@jest/globals";
import GlobalDataInit from "./common";
import TokenProvider from "../providers/tokenProvider";

new GlobalDataInit();

describe("token provider", () => {
  const tokenValue = "token_example_value";

  test("getting token from localeStore", () => {
    TokenProvider.init(true);
    TokenProvider.setToken(tokenValue);
    expect.stringContaining(TokenProvider.getToken());
    expect(TokenProvider.getToken()).toEqual(tokenValue);
  });

  test("is token Null after localeStore removing ", () => {
    TokenProvider.removeToken();
    expect(TokenProvider.getToken()).toBeNull();
  });

  test("getting token from sessionStore", () => {
    TokenProvider.init(false);
    TokenProvider.setToken(tokenValue);
    expect.stringContaining(TokenProvider.getToken());
    expect(TokenProvider.getToken()).toEqual(tokenValue);
  });

  test("is token Null after sessionStore removing", () => {
    TokenProvider.removeToken();
    expect(TokenProvider.getToken()).toBeNull();
  });
});
