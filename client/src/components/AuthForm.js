import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Spacer from "./Spacer";
import SelectDropdown from "react-native-select-dropdown";

const AuthForm = ({ errorMessages, formElements }) => {
  return (
    <View style={styles.view}>
      <Spacer></Spacer>
      {formElements.map((element, index) => {
        if (element.type == "input") {
          const inputProps = {
            key: index,
            label: element.label,
            value: element.value,
            onChangeText: element.onChangeText,
            autoCapitalize: element.autoCapitalize,
            autoCorrect: element.autoCorrect,
          };

          if (element.secureTextEntry) {
            inputProps.secureTextEntry = true;
          }

          return <Input {...inputProps} />;
        }
        if (element.type == "selectDropdown") {
          return (
            <SelectDropdown
              key={index}
              data={element.data}
              onSelect={element.onSelect}
              buttonTextAfterSelection={() => element.buttonTextAfterSelection}
              rowTextForSelection={(item) => item}
              buttonStyle={styles.selectStyle}
              defaultButtonText={element.defaultButtonText}
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
          );
        }
        if (element.type == "button") {
          return (
            <Button
              key={index}
              title={element.title}
              onPress={element.onSubmit}
              buttonStyle={styles.button}
            />
          );
        }
      })}
      {errorMessages.map((element, index) => {
        return (
          <Text key={index} style={styles.errorMessage}>
            {element}
          </Text>
        );
      })}

      <Spacer></Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 10,
    alignSelf: "center",
    textAlign: "center",
  },
  button: {
    backgroundColor: "rgba(0, 153, 51,0.4)", //light green
    marginHorizontal: 10,
  },
  view: { marginHorizontal: 15 },
  selectStyle: {
    alignSelf: "center",
    width: 320,
  },
});

export default AuthForm;
