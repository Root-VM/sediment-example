import TokenProvider from "../providers/tokenProvider";
import env from "@beam-australia/react-env";

export const authToken = async (data: FormData) => {
  const url = `${env("API_URL")}/api/v2/auth-token/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });

    return await response.json();
  } catch (error) {
    return error;
  }
};

export const deleteToken = async () => {
  const url = `${env("API_URL")}/api/v2/auth-token/`;
  const token = TokenProvider.getToken();
  const headers = token ? { Authorization: `Token ${token}` } : undefined;

  try {
    await fetch(url, {
      headers,
      method: "DELETE",
    });
  } catch (error) {
    return error;
  }
};
