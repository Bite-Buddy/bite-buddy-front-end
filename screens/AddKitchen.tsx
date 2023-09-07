import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Button } from 'react-native';
import { Input } from "react-native-elements";
import { useStateValue } from '../store/State'

export default function AddKitchen() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [{ kitchens }, dispatch] = useStateValue();

  async function submitKitchen() {
    setLoading(true)
    // TODO: send post request
    
    // Add kitchen to application state
    dispatch({
      type: 'addKitchen',
      newKitchen: {name: name}
    })
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
            <Button title="Submit" disabled={loading} onPress={() => submitKitchen()} />
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
    }
})
