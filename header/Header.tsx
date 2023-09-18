import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';




export default function Header() {
  const navigation = useNavigation();
  function navigate(destination) {
    navigation.navigate(destination)
  }
  return (
    <View style={styles.header}>
      <Pressable style={styles.button} title="Kitchen" onPress={() => navigation.navigate("Kitchen Settings", { screen: 'Kitchen' })}>
      <Text style={styles.text}><MaterialCommunityIcons name="fridge-outline" size={30} color="black" /></Text>
      </Pressable>
      <Pressable style={styles.button} title="List" onPress={() => navigate('List')}>
      <Text style={styles.text}><FontAwesome5 name="list-alt" size={24} color="black" /></Text>
      </Pressable>
      <Pressable style={styles.button} title="Profile" onPress={() => navigate('Profile')}>
      <Text style={styles.text}><Ionicons name="person-circle" size={33} color="black" /></Text>
      </Pressable>
    </View>
  )
}

{/* <Button title="List" color='#EFCA46' onPress={() => navigate('List')} />
<Button title="Profile" color='#EFCA46' onPress={() => navigate('Profile')} /> */}

const styles = StyleSheet.create({
  header: {
   width: '100%',
   height: '100%',
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   backgroundColor: '#FFD43A',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    marginLeft: 10,
    marginRight: 10,
    
  },
  button: {
    color: '#1D1D1D',
    

  }
})
