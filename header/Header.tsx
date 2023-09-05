import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";


export default function Header() {
  const navigation = useNavigation();
  function navigate(destination) {
    navigation.navigate(destination)
  }
  return (
    <View style={styles.header}>
      <Pressable style={styles.button} title="Kitchen" onPress={() => navigate('Kitchen')}>
      <Text style={styles.text}>Kitchen</Text>
      </Pressable>
      <Pressable style={styles.button} title="List" onPress={() => navigate('List')}>
      <Text style={styles.text} Icon={{ type: 'font-awesome', name: 'envelope' }}>List</Text>
      </Pressable>
      <Pressable style={styles.button} title="Profile" onPress={() => navigate('Profile')}>
      <Text style={styles.text}>Profile</Text>
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
   backgroundColor: '#EFCA46',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    marginLeft: 10,
    marginRight: 10,
    
  },
  button: {
    color: 'black',
    

  }
})
