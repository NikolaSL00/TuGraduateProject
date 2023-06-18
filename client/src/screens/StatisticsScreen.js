import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

const StatisticsScreen = () => {
  const route = useRoute();
  const { productUrl } = route.params;
  const { storeName } = route.params;

  return <ScrollView></ScrollView>;
};

StatisticsScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({});

export default StatisticsScreen;
