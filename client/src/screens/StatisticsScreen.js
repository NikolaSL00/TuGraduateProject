import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { LineChart, BarChart, StackedBarChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../api/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StatisticsScreen = () => {
  const route = useRoute();
  const { productUrl } = route.params;
  const { storeName } = route.params;

  console.log(productUrl);
  console.log(storeName);
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));

  const showPicker = () => {
    setIsPickerShow(true);
  };

  return (
    <ScrollView>
      {/* Display the selected date */}
      <View style={styles.pickedDateContainer}>
        <Text style={styles.pickedDate}>{date.toUTCString()}</Text>
      </View>
      <View style={styles.btnContainer}>
        <Button title="Show Picker" color="purple" onPress={showPicker} />
      </View>

      {isPickerShow && (
        <DateTimePicker
          value={date}
          mode={"date"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={onChange}
          style={styles.datePicker}
        />
      )}
    </ScrollView>
  );
};

StatisticsScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({});

export default StatisticsScreen;
