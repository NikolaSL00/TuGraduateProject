import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";
import axios from "axios";
import api from "../api/baseUrl";
import { NativeModules } from "react-native";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "signout":
      return { token: null, errorMessage: "" };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("MainFlow", { screen: "Search" }); //   navigate("MainFlow",{SearchScreen});
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      const response = await api.post("api/users/signup", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userEmail", response.data.userEmail);
      await AsyncStorage.setItem(
        "userLocationCity",
        response.data.userLocationCity
      );

      dispatch({ type: "signin", payload: response.data.token });
      navigate("MainFlow", { screen: "Search" });
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something get wrong with sign up",
      });
    }
  };

const signin =
  (dispatch) =>
  async ({ email, password }) => {
    try {
      const response = await api.post("api/users/signin", { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userEmail", response.data.userEmail);
      await AsyncStorage.setItem(
        "userLocationCity",
        response.data.userLocationCity
      );

      dispatch({ type: "signin", payload: response.data.token });
      navigate("MainFlow", { screen: "Search" });
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something get wrong with sign in",
      });
      console.log(err.response.data);
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
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
