import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import IDOMParser from 'advanced-html-parser';

const BarcodeScannerScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
      }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        console.log(`Searching for the barcode ${data}`);

        alert(`Bar code with type ${type} and data ${data} has been scanned!`);

        try {
            const response = await axios.get(`https://barcode.bg/barcode/BG/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B7%D0%B0-%D0%B1%D0%B0%D1%80%D0%BA%D0%BE%D0%B4.htm?barcode=${data}`);
        
            const htmlDoc = IDOMParser.parse(response.data);
            const title = htmlDoc.documentElement.querySelector('title').textContent;
            
            // gets the title of the page, which is simmilar to first el of productTags
            const [productTitle, barcode] = title.split(' - Баркод: ');
            console.log(productTitle);

            // get all possible labels for the product
            // sometimes the second is better then the first
            const metaTagContent = htmlDoc.documentElement.querySelectorAll('meta')[1].getAttribute('content');
            const productTags = metaTagContent.split(': ')[1].split(';');
            console.log(productTags);
             
        } catch(err) {
            console.log(err);
        }
    };
    
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
      
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    }
});

export default BarcodeScannerScreen;