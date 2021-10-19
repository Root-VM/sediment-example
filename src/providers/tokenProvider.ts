const TOKEN_KEY = "token";

export default class TokenProvider {
  protected static storage: Storage;

  static init(stayLogin: boolean) {
    TokenProvider.storage = stayLogin ? localStorage : sessionStorage;
  }

  static setToken(token: string) {
    TokenProvider.storage.setItem(TOKEN_KEY, token);
  }

  static getToken() {
    return TokenProvider.storage.getItem(TOKEN_KEY);
  }

  static removeToken() {
    TokenProvider.storage.removeItem(TOKEN_KEY);
  }
}
