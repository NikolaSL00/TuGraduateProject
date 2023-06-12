import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Spacer from "./Spacer";
import SelectDropdown from "react-native-select-dropdown";

const AuthForm = ({ errorMessage, onSubmit, submitButtonText, signup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [userLocation, setUserLocation] = useState("Изберете локация");
  const [repeatPasswordError,setRepeatPasswordError]=useState(null);
  const cities = ["Varna", "Sofia", "Plovdiv"];

  const handleValueChange = (value) => {
    setUserLocation(value);
  };

  return (
      <View style={styles.view}>
      <Spacer></Spacer>
      <Input
        label="Имейл"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        secureTextEntry
        label="Парола"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {signup ? (
        <>
        <Input
          secureTextEntry
          label="Повтори парола"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
         <SelectDropdown
            data={cities}
            onSelect={handleValueChange}
            buttonTextAfterSelection={() => userLocation}
            rowTextForSelection={(item) => item}
            buttonStyle={styles.selectStyle}
            defaultButtonText={userLocation}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"#444"}
                  size={18}
                />
              );
            }}
          />
        </>
      ) : null}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      {repeatPasswordError ? (
        <Text style={styles.errorMessage}>{repeatPasswordError}</Text>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => {if(password==repeatPassword){onSubmit({ email, password,userLocation })}
        else{
          setRepeatPasswordError("Паролите не съвпадат");
        }}}
          buttonStyle={styles.button}
        />
      </Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 1,
    alignSelf:"center"
  },
  button: {
    backgroundColor: "rgba(0, 153, 51,0.4)", //light green
    marginHorizontal: 10,
  },
  view: { marginHorizontal: 15 },
  selectStyle: {
    alignSelf:"center",
    width: 320,
  },
});

export default AuthForm;
