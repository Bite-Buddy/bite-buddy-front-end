import { Pressable, StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { currentFoodItemAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { deleteFoodById, updateFoodById } from "../utilities/fetchRequests"
import { IFood } from "../utilities/interfaces";



export default function EditFood() {
const navigation = useNavigation();
const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom)
const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
const [name, setName] = useState("")
const [boughtOn, setBoughtOn] = useState(new Date())
const [loading, setLoading] = useState(false)


useEffect(() => {
  console.log('effect')
  if (currentFoodItem) {
    console.log('setting current food', currentFoodItem)
    setName(currentFoodItem.name)
    setBoughtOn(new Date(currentFoodItem.bought_on))
  }

}, [currentFoodItem])


async function updateFoodItem() {
  if (!currentFoodItem) return;
  const response = await updateFoodById(currentFoodItem.id, {name: name, bought_on: boughtOn})
  let foodListClone: IFood[] = JSON.parse(JSON.stringify(currentFoodList))
  foodListClone = foodListClone.map(food => {
    return  {...food, bought_on: new Date(food.bought_on), updated_on: new Date(food.updated_on)}
  })
  let target = foodListClone.find(food => food.id === currentFoodItem.id)
  if (target) {
    target.name = response.foodResponse.name
    target.bought_on = new Date(response.foodResponse.bought_on)
  } 
  console.log('clone', foodListClone)
  setCurrentFoodList(foodListClone)
  setCurrentFoodItem(null)
  navigation.navigate("Kitchen Details")
}

async function deleteFoodItem() {
  setLoading(true)
  if (!currentFoodItem) return;
  const response = await deleteFoodById(currentFoodItem.id);
  setCurrentFoodItem(null)
  let foodListClone: IFood[] = JSON.parse(JSON.stringify(currentFoodList))
  foodListClone = foodListClone.map(food => {
    return  {...food, bought_on: new Date(food.bought_on), updated_on: new Date(food.updated_on)}
  })
  setCurrentFoodList(foodListClone.filter(food => food.id !== response.foodResponse.id)
  )
  setLoading(false)
  navigation.navigate('Kitchen Details')
}

  return (
    <View style={styles.container}>
    <View style={styles.verticallySpaced}>
      <Text style={styles.headline}>Edit Food</Text>
      <Input
            label="Name"
            onChangeText={(text) => setName(text)}
            value={name}
            autoCapitalize={'none'}
          />
      <Input
            label="Bought on"
            onChangeText={(text) => setBoughtOn(new Date(text))}
            value={boughtOn.toLocaleString()}
            autoCapitalize={'none'}
          />
      <Pressable style={styles.button} disabled={loading} onPress={() => updateFoodItem()} ><Text style={styles.buttonText}>Update Food</Text></Pressable>
    </View>
    <View>
      <Pressable style={styles.button} disabled={loading} onPress={() => deleteFoodItem()} ><Text style={styles.buttonText}>Delete Food</Text></Pressable>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
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
