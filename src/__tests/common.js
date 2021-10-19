import fetch from "node-fetch";

export default class GlobalDataInit {
  constructor() {
    const store = localStorageMock();

    global.FormData = formDataMock;
    global.localStorage = store;
    global.sessionStorage = store;

    globalThis.fetch = fetch;

    process.env.REACT_APP_API_URL = "https://dev-ext.vigilance.sedimentum.com";
  }
}

function localStorageMock() {
  let store = {};

  return {
    clear: () => {
      store = {};
    },
    getItem: (key) => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    length: () => {
      return Object.keys(store).length;
    },
    key: (i) => {
      const keys = Object.keys(store);
      return keys[i] || null;
    },
  };
}

function formDataMock() {
  this.append = jest.fn();
}
