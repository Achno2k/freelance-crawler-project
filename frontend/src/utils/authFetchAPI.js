import authAPI from "./authAPI"; 

export const authFetch = async (url, options = {}) => {
  const tokens = authAPI.getTokens();
  const initialOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${tokens.accessToken}`
    }
  };

  let response = await fetch(url, initialOptions);

  if (response.status === 401) {
    console.warn("Access token expired, trying refresh...");

    const refreshResponse = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refreshToken })
    });

    if (!refreshResponse.ok) {
      throw new Error("Unauthorized, please login again.");
    }

    const newTokens = await refreshResponse.json();
    authAPI.storeTokens(newTokens);

    const retryOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newTokens.accessToken}`
      }
    };

    response = await fetch(url, retryOptions);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
