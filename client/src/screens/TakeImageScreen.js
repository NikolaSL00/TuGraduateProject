import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { manipulateAsync } from "expo-image-manipulator";
import api from "../api/baseUrl";
let camera;

const TakeImageScreen = () => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const navigation = useNavigation();

  const startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log(status);
    if (status !== "granted") {
      Alert.alert("Access denied");
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  const takePicture = async () => {
    const photo = await camera.takePictureAsync();
    const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // console.log(photo);
    setPreviewVisible(true);
    //setStartCamera(false)
    // setCapturedImage(photo);
    setCapturedImage({ ...photo, base64: base64Image });
  };

  const savePhoto = async () => {
    let baseUrl = "https://0f65-151-251-251-8.ngrok-free.app";
    let url = `${baseUrl}/api/ai/recognize`;

    const formData = new FormData();
    const manipulatorOptions = { format: "jpeg", compress: 0.8, base64: true }; // Customize the options as needed
    const resizedImage = await manipulateAsync(
      capturedImage.uri,
      [{ resize: { width: 299, height: 299 } }], // Specify the desired width and height for resizing
      manipulatorOptions
    );

    formData.append("blob", JSON.stringify(resizedImage.base64));

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Successful response
        const { prediction } = await response.json();

        navigation.navigate("Търси", {
          screen: "SearchScreen",
          params: { productTags: [prediction] },
        });
        // Process the responseData as needed
      } else {
        // Error response
        // Handle the error
        console.log("Error:", response.status);
      }
    } catch (error) {
      // Fetch error
      console.log("Fetch error:", error);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    startCamera();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        {previewVisible && capturedImage ? (
          <CameraPreview
            photo={capturedImage}
            savePhoto={savePhoto}
            retakePicture={retakePhoto}
          />
        ) : (
          <Camera
            style={{ flex: 1 }}
            ref={(r) => {
              camera = r;
            }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                backgroundColor: "transparent",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: "5%",
                  top: "10%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              ></View>
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row",
                  flex: 1,
                  width: "100%",
                  padding: 20,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: "#fff",
                    }}
                  />
                </View>
              </View>
            </View>
          </Camera>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
  // console.log("sdsfds", photo);
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                Снимай пак
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                }}
              >
                Търси
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default TakeImageScreen;
