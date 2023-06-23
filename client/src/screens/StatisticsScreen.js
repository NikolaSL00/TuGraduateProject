import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { Button, ButtonGroup, Text } from "react-native-elements";

import api from "./../api/baseUrl.js";

const StatisticsScreen = () => {
  const route = useRoute();
  const { productUrl } = route.params;
  const { storeName } = route.params;
  const { productTitle } = route.params;
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchDate, setSearchDate] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // const searchDate = "2023-06-10T10:07:20.225Z";
  const prepareSearchDate = (value) => {
    setSelectedIndex(value);
    if (value == 0) {
      const datetime = new Date();
      datetime.setDate(datetime.getDate() - 7);
      setSearchDate(datetime.toISOString());
    }
    if (value == 1) {
      const datetime = new Date();
      datetime.setDate(datetime.getDate() - 31);
      setSearchDate(datetime.toISOString());
    }
    if (value == 2) {
      const datetime = new Date();
      datetime.setDate(datetime.getDate() - 182);
      setSearchDate(datetime.toISOString());
      console.log(datetime);
    }
    if (value == 3) {
      const datetime = new Date();
      datetime.setDate(datetime.getDate() - 365);
      setSearchDate(datetime.toISOString());
    }
  };

  const getProductPrices = async () => {
    try {
      const response = await api.post("/api/stats/getPricesForProducts", {
        storeName,
        productUrl,
        searchDate,
      });
      console.log(response.data);
      if (response.data.prices && response.data.prices.length > 0) {
        setData(response.data.prices);
      }
      if (response.data.dates && response.data.dates.length > 0) {
        setLabels(response.data.dates);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const datetime = new Date();
    datetime.setDate(datetime.getDate() - 31);
    setSearchDate(datetime.toISOString());
  }, []);
  useEffect(() => {
    setIsLoading(true);
    getProductPrices();
  }, [route, searchDate]);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.productTitle}>{productTitle}</Text>
        <View style={styles.divider} />
        <Text style={styles.chooseText}>Изберете период</Text>
      </View>
      <View>
        <ButtonGroup
          buttons={["1 седмица", "1 месец", "6 месеца", "1 година"]}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            prepareSearchDate(value);
          }}
          selectedButtonStyle={styles.selectedButton}
          containerStyle={{ marginBottom: 20, borderRadius: 10 }}
        />
      </View>
      {data.length > 0 && labels.length > 0 && isLoading == false ? (
        <View style={{ backgroundColor: "#e6eeff", marginTop: 30 }}>
          <Text
            style={{
              alignSelf: "flex-start",
              marginLeft: 20,
              marginBottom: 10,
              marginTop: 5,

              fontWeight: "bold",
              color: "#858593",
            }}
          >
            Цена
          </Text>
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: data,
                  strokeWidth: 2,
                },
              ],
            }}
            yAxisSuffix={" лв"}
            width={Dimensions.get("window").width - 20}
            height={300}
            chartConfig={{
              backgroundColor: "#e6eeff",
              backgroundGradientFrom: "#e6eeff",
              backgroundGradientTo: "#e6eeff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(26, 98, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginLeft: 10,
              marginTop: 10,
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "bold",
              color: "#858593",
              marginTop: -23,
              marginBottom: 5,
            }}
          >
            Дата
          </Text>
        </View>
      ) : null}
      {isLoading === true ? (
        <ActivityIndicator style={{ marginTop: 200 }} />
      ) : null}
    </ScrollView>
  );
};

StatisticsScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  chooseText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 3,
    marginTop: 10,
    marginBottom: 10,
    color: "#858593",
    alignSelf: "center",
    textAlign: "center",
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 3,
    marginTop: 10,
    marginBottom: 10,
    color: "#54545f",
    alignSelf: "center",
    textAlign: "center",
  },

  selectedButton: {
    backgroundColor: "#80aaff",
  },

  container: {
    backgroundColor: "white",
  },
  buttonContainerStyle: {
    width: 200,
    marginHorizontal: 50,
    marginVertical: 10,
  },
  divider: {
    height: 0.4,
    backgroundColor: "gray",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default StatisticsScreen;
