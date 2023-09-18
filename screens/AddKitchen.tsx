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
  const [error, setError] = useState<string>("");
  const [user, setUser] = useAtom(userAtom);
  const [kitchens, setKitchens] = useAtom(kitchensAtom);
  const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom);
  const navigation = useNavigation();


  async function submitKitchen() {
    setLoading(true);
    if (name === "") {
      setError("*required");
      setLoading(false)
      return;
    }
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.verticallySpaced}>Name</Text>
        {error !== "" && <Text style={{ color: "darkred" }}>{"  " + error}</Text>}
      </View>
      <TextInput style={styles.userInput}
        onChangeText={(text: string) => setName(text)}
        textAlign="left"
        value={name}
        placeholder="My Kitchen"
      />
      <Pressable style={styles.button} disabled={loading} onPress={() => submitKitchen()} ><Text style={styles.buttonText}>Create Kitchen</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    padding: 12,
    backgroundColor: "#FFF",
    flex: 1
  },
  headline: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
  },
  userInput: {
    height: 40,
    marginBottom: 15,
    padding: 5,
    borderColor: "lightgray",
    borderWidth: 1,
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: '#FFD43A',
    height: 40,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
})
