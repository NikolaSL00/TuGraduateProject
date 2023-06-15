import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, Dimensions } from "react-native";

import { useRoute } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";

const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

const StatisticsScreen = () => {
  const route = useRoute();
  return (
    <ScrollView>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={Dimensions.get("window").width - 16}
        height={220}
        yAxisLabel={"Rs"}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
};

StatisticsScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({});

export default StatisticsScreen;
