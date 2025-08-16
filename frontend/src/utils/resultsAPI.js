import authAPI from "./authAPI.js";

export const fetchProjectResults = async () => {
  try {
    console.log("trying to get the response from the frontend")
    console.log("AccessToken:", authAPI.getTokens().accessToken)
    console.log(import.meta.env.VITE_BACKEND_BASE_URL)
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/results/info`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authAPI.getTokens().accessToken}`
      }
    });

    console.log("Response", response)
    // console.log(response.json())
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("inside the api.js file")
    console.log(data)
    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error: Unable to connect to server');
    }
    throw new Error(`Failed to fetch project results: ${error.message}`);
  }
};

// /**
//  * Generic API request helper
//  * @param {string} endpoint - API endpoint path
//  * @param {Object} options - Fetch options (method, headers, body, etc.)
//  * @returns {Promise<any>} Response data
//  */
// export const apiRequest = async (endpoint, options = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };
  
//   const config = { ...defaultOptions, ...options };
  
//   try {
//     const response = await fetch(url, config);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     if (error.name === 'TypeError') {
//       throw new Error('Network error: Unable to connect to server');
//     }
//     throw error;
//   }
// };