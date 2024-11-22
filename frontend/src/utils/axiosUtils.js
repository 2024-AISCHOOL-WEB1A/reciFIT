import axios from "axios";

// General Axios instance (no token handling)
export const generalAxios = axios.create({
  baseURL: "/",
});

// API Axios instance (with token handling)
export const apiAxios = axios.create({
  baseURL: "/api",
  withCredentials: true, // To include HTTP-only cookies in requests
});

// Function to queue requests until token is refreshed
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  try {
    const response = await generalAxios.post("/auth/token", null, {
      withCredentials: true, // To include HTTP-only cookies in refresh requests
    });
    return response.data;
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};

// Interceptor to handle token expiration and retries
apiAxios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const { config, response } = error;

    // Check if error is due to token expiration
    if (response?.status === 401 && !config._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await refreshAccessToken(); // Refresh the token
          isRefreshing = false;
          onTokenRefreshed();
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          config._retry = true; // Mark as retried
          resolve(apiAxios(config)); // Retry the original request
        });
      });
    }

    return Promise.reject(error); // Forward other errors
  }
);
