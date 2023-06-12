import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";

import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import SeeOnMapScreen from "./src/screens/SeeOnMapScreen"; //suzdava problemi v web
import AccountScreen from "./src/screens/AccountScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import ShoppingListScreen from "./src/screens/ShoppingListScreen";
import CheapestStoreScreen from "./src/screens/CheapestStoreScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import ProductRecognizerMiddleScreen from "./src/screens/ProductRecognizerMiddleScreen";
import { setNavigator } from "./src/navigationRef";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BarcodeScannerScreen from "./src/screens/BarcodeScannerScreen";
import TakeImageScreen from "./src/screens/TakeImageScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SearchProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
    <Stack.Screen name="SeeOnMapScreen" component={SeeOnMapScreen} />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AccountScreen" component={AccountScreen} />
    <Stack.Screen
      name="ChangePasswordScreen"
      component={ChangePasswordScreen}
    />
  </Stack.Navigator>
);

const ShoppingListStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ShoppingListScreen" component={ShoppingListScreen} />
    <Stack.Screen name="CheapestStoreScreen" component={CheapestStoreScreen} />
  </Stack.Navigator>
);

const ProductRecognizerScreenStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProductRecognizerMiddleScreen"
      component={ProductRecognizerMiddleScreen}
    />
    <Stack.Screen
      name="BarcodeScannerScreen"
      component={BarcodeScannerScreen}
    />
    <Stack.Screen name="TakeImageScreen" component={TakeImageScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#52525C",
      style: { backgroundColor: "transparent" },
    }}
  >
    <Tab.Screen
      name="Търси"
      component={SearchProductStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Акаунт"
      component={AccountStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-circle-outline" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Списък за пазар"
      component={ShoppingListStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="list-circle-outline" size={size} color={color} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Скенер"
      component={ProductRecognizerScreenStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="barcode-scan"
            size={size}
            color={color}
          />
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

const App = React.forwardRef((props, ref) => (
  <NavigationContainer ref={ref}>
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="ResolveAuth"
        component={ResolveAuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signin"
        component={SigninScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MainFlow"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
));

export default () => {
  const navigatorRef = React.useRef();

  React.useEffect(() => {
    setNavigator(navigatorRef.current);
  }, []);

  return (
    <AuthProvider>
      <App ref={navigatorRef} />
    </AuthProvider>
  );
};
