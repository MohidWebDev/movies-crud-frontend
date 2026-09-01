import * as authApi from "./authApi";

let accessToken: string | null = null;
let onTokenRefreshed: ((token: string | null) => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setTokenRefreshCallback = (cb: (token: string | null) => void) => {
  onTokenRefreshed = cb;
};

export const authFetch = async (
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> => {
  const withAuthHeader = (token: string | null): RequestInit => ({
    ...init,
    headers: {
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let res = await fetch(input, withAuthHeader(accessToken));

  if (res.status === 401) {
    try {
      const { accessToken: newToken } = await authApi.refresh();
      setAccessToken(newToken);
      onTokenRefreshed?.(newToken);
      res = await fetch(input, withAuthHeader(newToken));
    } catch {
      setAccessToken(null);
      onTokenRefreshed?.(null);
    }
  }

  return res;
};
