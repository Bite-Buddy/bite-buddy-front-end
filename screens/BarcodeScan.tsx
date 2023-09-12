import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, {useState, useEffect} from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { searchByBarcode } from '../utilities/fetchRequests';
import { useNavigation } from "@react-navigation/native";

export default function BarcodeScan() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanData, setScanData] = useState();

  useEffect(() => {
    (async() => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permissions to Bite Buddy.</Text>
      </View>
    );
  }

  async function handleBarCodeScanned({type, data}) {
    setScanData(data);
    console.log(`Data: ${data}`);
    const barcodedata = await searchByBarcode(data);
    const name = barcodedata.title;
    console.log("name,", name)
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner 
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
        />
      {scanData && <Button title='Scan Again?' onPress={() => setScanData(undefined)} />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
