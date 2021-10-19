import TokenProvider from "../providers/tokenProvider";
import env from "@beam-australia/react-env";

export const request = async (data: {
  url: string;
  method: string;
  body?: any;
}) => {
  const token = TokenProvider.getToken();
  const headers = token ? { Authorization: `Token ${token}` } : undefined;

  try {
    const response = await fetch(`${env("API_URL")}/api/v2${data.url}`, {
      method: data.method,
      headers,
      body: data.body,
    });

    if (response.status === 401) {
      location.href = "/login";
      return null;
    }

    return await response.json();
  } catch (error) {
    return error;
  }
};
