import createDataContext from "./createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigationRef";
import api from "../api/baseUrl";

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
  async ({ email, password,userLocation }) => {
    try {
      console.log("AUTH CONTEXT")
      const response = await api.post("api/users/signup", { email, password,userLocation });
      console.log("response",response.data)
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
        payload: err.response.data.errors[0].message,
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
        payload: err.response.data.errors[0].message,
      });
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
