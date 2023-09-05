import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();
  function navigate(destination) {
    navigation.navigate(destination)
  }
  return (
    <View style={styles.header}>
      <Button title="Kitchen" color='#EFCA46' onPress={() => navigate('Kitchen')} />
      <Button title="List" color='#EFCA46' onPress={() => navigate('List')} />
      <Button title="Profile" color='#EFCA46' onPress={() => navigate('Profile')} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
   width: '100%',
   height: '100%',
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   backgroundColor: '#EFCA46',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  },
  button: {
    color: 'black',
  }
})
