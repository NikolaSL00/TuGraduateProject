import React, { useState } from "react";
import { View, StyleSheet, ScrollView,Text } from "react-native";

import { useRoute } from "@react-navigation/native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]


const StatisticsScreen = () => {
  const route = useRoute();
    return (<ScrollView><BarChart data = {data} />
    <LineChart data = {data} />
    <PieChart data = {data} />
    </ScrollView>)
};

StatisticsScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
 
});

export default StatisticsScreen;
