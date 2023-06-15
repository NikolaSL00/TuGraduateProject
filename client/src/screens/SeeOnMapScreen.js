import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import api from "../api/baseUrl";

const SeeOnMapScreen = () => {
  const route = useRoute();
  let { locations } = route.params;
  // console.log(locations);
  // coordinates = [].concat(...coordinates);
  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState([
    { latitude: 0, longitude: 0 },
  ]);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [closestCoordinates, setClosestCoordinates] = useState(null);

  const getLocations = async () => {
    try {
      const response = await api.post("/api/main/getLocations", {
        locationsIds: locations,
      });
      // console.log(response.data);

      let locationsCoordinatesArrays = response.data.map(
        (location) => location.coordinates
      );

      const coordinatesArray = [].concat(
        ...locationsCoordinatesArrays.map((nestedArray) =>
          nestedArray.map(({ latitude, longitude }) => ({
            latitude,
            longitude,
          }))
        )
      );

      setCoordinates(coordinatesArray);

      // setCoordinates(locationsCoordinates);
      // console.log(locationsCoordinates);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLocations();
  }, [locations]);

  useFocusEffect(
    React.useCallback(() => {
      const getCurrentLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.log("Permission to access location was denied.");
            return;
          }

          const location = await Location.getCurrentPositionAsync({});

          const { latitude, longitude } = location.coords;

          setCurrentCoordinates({ latitude, longitude });
          console.log({ latitude, longitude });
        } catch (err) {
          console.log(err);
        }
      };
      getCurrentLocation();
    }, [coordinates])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (currentCoordinates && coordinates) {
        const findClosestObject = async (object, array) => {
          let distances = array.map((item) => {
            return Math.sqrt(
              Math.pow(item.latitude - object.latitude, 2) +
                Math.pow(item.longitude - object.longitude, 2)
            );
          });
          const closest = array[distances.indexOf(Math.min(...distances))];
          setClosestCoordinates(closest);
          console.log("closest", closestCoordinates);
          setIsLoading(false);
        };
        findClosestObject(currentCoordinates, coordinates);
      }
    }, [currentCoordinates, coordinates])
  );

  const content = (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates[0].latitude,
            longitude: coordinates[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {closestCoordinates &&
            coordinates.map((location, index) =>
              location == closestCoordinates ? (
                <Marker
                  key={index}
                  coordinate={location}
                  pinColor={"green"}
                  title={"Най-близък магазин"}

                  //   title={location.title}
                  //   description={location.description}
                />
              ) : (
                <Marker
                  key={index}
                  coordinate={location}
                  title={"Обект на магазина"}
                  //   description={location.description}
                />
              )
            )}
          {currentCoordinates && (
            <Marker
              coordinate={currentCoordinates}
              title={"Вашето местоположение"}
              pinColor={"navy"}
            />
          )}
        </MapView>
      </View>
    </ScrollView>
  );

  return isLoading ? (
    <ActivityIndicator size="large" style={styles.activityIndicator} />
  ) : (
    content
  );
};

SeeOnMapScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SeeOnMapScreen;
