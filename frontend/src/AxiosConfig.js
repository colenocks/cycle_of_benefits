import axios from "axios";
const env = process.env.NODE_ENV;
export const clientRequest = (token = null) => {
  const defaultOptions = {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    baseURL:
      env === "production"
        ? process.env.REACT_APP_BASE_URL
        : "http://localhost:5000",
  };

  return {
    get: (url, options = {}) =>
      axios.get(url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) =>
      axios.post(url, data, { ...defaultOptions, ...options }),
    put: (url, data, options = {}) =>
      axios.put(url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) =>
      axios.delete(url, { ...defaultOptions, ...options }),
  };
};
