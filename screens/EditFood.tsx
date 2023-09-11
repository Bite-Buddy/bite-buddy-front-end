import { StyleSheet, View } from "react-native";
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
  // setLoading(true)
  // if (!currentFoodItem) return;
  // const response = await deleteFoodById(currentFoodItem.id);
  // setCurrentKitchen(null)
  // const kitchensClone: IKitchen[] = JSON.parse(JSON.stringify(kitchens))
  // setKitchens(kitchensClone.filter(kitchen => kitchen.id !== response.kitchenResponse.id))
  // setLoading(false)
  // navigation.navigate('Kitchen')
}

  return (
    <View style={styles.container}>
    <View style={styles.verticallySpaced}>
      <Text>Edit Food Item</Text>
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
          <Button title="Update" disabled={loading} onPress={() => updateFoodItem()} />
    </View>
    <View>
    <Button title="Delete Food Item" disabled={loading} onPress={() => deleteFoodItem()} />
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
})
