import {View, Text, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import Spacer from '../components/Spacer';


const ProductRecognizerMiddleScreen = () => {
    const navigation = useNavigation();



    return  <View style={styles.container}>
            <Text>Избери</Text>

            <Button title='Пакетирана храна' onPress={() => navigation.navigate('BarcodeScannerScreen')}/>
            <Spacer/>
            <Button title='Плодове и зеленчуци' onPress={() => navigation.navigate('TakeImageScreen')}/>
        </View>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // borderColor: 'black',
        // borderWidth: 10,
    }
});

export default ProductRecognizerMiddleScreen;