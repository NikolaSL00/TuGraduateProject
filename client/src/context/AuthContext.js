import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";
import api from "../api/baseUrl";

const toStringArray = (objectArray) => {
  return objectArray.map((obj) => obj.message);
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: toStringArray(action.payload) };
    case "signin":
      return {
        errorMessage: [],
        token: action.payload.token,
        userLocation: action.payload.userLocation,
      };
    case "signout":
      return { token: null, errorMessage: [] };
    case "clear_error_message":
      return { ...state, errorMessage: [] };
    case "change_location":
      return { ...state, userLocation: action.payload.userLocation };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  const userLocation = await AsyncStorage.getItem("userLocationCity");

  if (token) {
    dispatch({ type: "signin", payload: { token, userLocation } });
    navigate("MainFlow", { screen: "Search" }); //   navigate("MainFlow",{SearchScreen});
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const changeUserLocation = (dispatch) => (userLocation) => {
  dispatch({
    type: "change_location",
    payload: {
      userLocation,
    },
  });
};

const signup =
  (dispatch) =>
  async ({ email, password, userLocation, callback }) => {
    try {
      const response = await api.post("api/users/signup", {
        email,
        password,
        userLocation,
      });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userEmail", response.data.userEmail);
      await AsyncStorage.setItem(
        "userLocationCity",
        response.data.userLocationCity
      );

      dispatch({
        type: "signin",
        payload: {
          token: response.data.token,
          userLocation: userLocation,
        },
      });
      navigate("MainFlow", { screen: "Search" });
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err.response.data.errors,
      });
    } finally {
      callback();
    }
  };

const signin =
  (dispatch) =>
  async ({ email, password, callback }) => {
    try {
      const response = await api.post("api/users/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userEmail", response.data.userEmail);
      await AsyncStorage.setItem(
        "userLocationCity",
        response.data.userLocationCity
      );

      dispatch({
        type: "signin",
        payload: {
          token: response.data.token,
          userLocation: response.data.userLocationCity,
        },
      });
      navigate("MainFlow", { screen: "Search" });
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: err.response.data.errors, //err.response.data.errors[0].message
      });
    } finally {
      callback();
    }
  };

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("userEmail");
  await AsyncStorage.removeItem("userLocationCity");

  dispatch({ type: "signout" });
  navigate("Signin");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signout,
    signup,
    clearErrorMessage,
    tryLocalSignin,
    changeUserLocation,
  },
  { userLocation: "", token: null, errorMessage: [] }
);
