import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
  baseURL: "https://2904-151-251-241-239.ngrok-free.app",
});

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.log("Error retrieving JWT token from AsyncStorage:", error);
    return null;
  }
};

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    console.log("Error intercepting request:", error);
    return Promise.reject(error);
  }
);

export default instance;
