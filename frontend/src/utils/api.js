// Base API utility supporting standard requests and automatic token appending

export const getGeminiKey = () => {
  return localStorage.getItem('user_gemini_api_key') || '';
};

export const setGeminiKey = (key) => {
  if (key) {
    localStorage.setItem('user_gemini_api_key', key);
  } else {
    localStorage.removeItem('user_gemini_api_key');
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errMsg = 'An error occurred during this request.';
    try {
      const data = await response.json();
      errMsg = data.message || errMsg;
    } catch (e) {
      // JSON parsing failed, use defaults
    }
    throw new Error(errMsg);
  }
  
  try {
    return await response.json();
  } catch (error) {
    return null; // Empty response body
  }
};

export const api = {
  get: async (url) => {
    const token = localStorage.getItem('user_jwt_token');
    const headers = {
      'Content-Type': 'application/json',
      'x-gemini-key': getGeminiKey()
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { method: 'GET', headers });
    return handleResponse(response);
  },

  post: async (url, body) => {
    const token = localStorage.getItem('user_jwt_token');
    const headers = {
      'Content-Type': 'application/json',
      'x-gemini-key': getGeminiKey()
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  upload: async (url, file) => {
    const token = localStorage.getItem('user_jwt_token');
    const headers = {
      'x-gemini-key': getGeminiKey()
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });
    return handleResponse(response);
  }
};
