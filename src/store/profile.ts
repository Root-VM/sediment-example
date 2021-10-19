import { RematchDispatch } from "@rematch/core";
import { authToken } from "../api/auth";
import { deleteToken } from "../api/auth";
import TokenProvider from "../providers/tokenProvider";
import { Profile } from "../interfaces/profile";

type State = {
  profile: Profile;
};

const defaultData = {
  user_id: 0,
  email: "undefined",
  first_name: "undefined",
  last_name: "",
  is_admin_user: false,
  number_of_customers: 0,
};

const model = {
  state: {
    ...defaultData,
  },
  reducers: {
    setProfile: (state: State, payload: Profile) => {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch: RematchDispatch<any>) => ({
    async getProfileAndToken(data: {
      name: string;
      password: string;
      stayLogin: boolean;
    }) {
      const formData = new FormData();
      formData.append("username", data.name);
      formData.append("password", data.password);
      dispatch.common.saveLoginType(data.stayLogin);

      const response = await authToken(formData);

      if (response && response?.token) {
        TokenProvider.setToken(response.token);

        delete response.token;
      } else {
        return { error: response };
      }
      dispatch.profile.setProfile(response);

      return response;
    },
    async removeProfileAndToken() {
      // logout request
      await deleteToken();

      // locale cleaning
      TokenProvider.removeToken();

      dispatch.profile.setProfile(defaultData);
    },
  }),
};

export default model;
