import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const SeeOnMapScreen = () => {
  const route = useRoute();
  let { coordinates } = route.params;
  coordinates = [].concat(...coordinates);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [closestCoordinates, setClosestCoordinates] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      console.log("coordinates", coordinates);
      const getCurrentLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.log("Permission to access location was denied.");
            return;
          }
          console.log("current");

          const location = await Location.getCurrentPositionAsync({});
          console.log("current2");

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
        };
        findClosestObject(currentCoordinates, coordinates);
      }
    }, [currentCoordinates, coordinates])
  );

  return (
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
});

export default SeeOnMapScreen;
