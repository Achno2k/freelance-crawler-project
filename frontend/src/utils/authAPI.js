const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// API functions
const authAPI = {
  login: async (credentials) => {
    // console.log("Credentials", credentials)
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    // console.log("formData", formData);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  signup: async (userData) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Signup failed');
    return data;
  },

  logout: () => {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    deleteCookie('token_type');
  },

  storeTokens: (tokens) => {
    setCookie('access_token', tokens.access_token, 1); 
    setCookie('refresh_token', tokens.refresh_token, 7); 
    setCookie('token_type', tokens.token_type, 7);
  },

  getTokens: () => ({
    accessToken: getCookie('access_token'),
    refreshToken: getCookie('refresh_token'),
    tokenType: getCookie('token_type'),
  }),

  isAuthenticated: () => !!getCookie('access_token')
};

export default authAPI;






