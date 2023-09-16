import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Button, Pressable } from 'react-native';
import { Input } from "react-native-elements";
// import { useStateValue } from '../store/State'
import { userAtom, kitchensAtom, currentKitchenAtom } from '../utilities/store/atoms'
import { useAtom } from 'jotai'
import { createKitchen } from '../utilities/fetchRequests'
import { useNavigation } from "@react-navigation/native";


export default function AddKitchen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [kitchens, setKitchens] = useAtom(kitchensAtom);
  const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom);
  const navigation = useNavigation();


  async function submitKitchen() {
    setLoading(true);
    console.log(user);
    const newKitchen = await createKitchen(user.id, name);
    console.log("The new kitchen is:", newKitchen);
    setKitchens(kitchens.concat(newKitchen.kitchen));
    setCurrentKitchen(newKitchen.kitchen);
    navigation.navigate("Kitchen");
  }
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headline}>Create a New Kitchen</Text>
            <Input
              label="Name"
              onChangeText={(text) => setName(text)}
              value={name}
              placeholder="My Kitchen"
              autoCapitalize={'none'}
            />
            <Pressable style={styles.button} disabled={loading} onPress={() => submitKitchen()} ><Text style={styles.buttonText}>Create Kitchen</Text></Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    headline: {
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
      backgroundColor: '#EFCA46',
      height: 40,
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontWeight: "bold"
    },
})
