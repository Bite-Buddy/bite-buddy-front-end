import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, Input, Button } from "react-native-elements";
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { currentFoodItemAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { deleteFoodById, updateFoodById } from "../utilities/fetchRequests"
import { IFood } from "../utilities/interfaces";
import { AntDesign } from '@expo/vector-icons'; 




export default function List() {
  const navigation = useNavigation();
  const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom)
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
  const [name, setName] = useState("")
  const [boughtOn, setBoughtOn] = useState(new Date())
  const [loading, setLoading] = useState(false)
  
  async function handleAddToKitchen(selectedFood) {
    if (!selectedFood) return;
    const response = await updateFoodById(selectedFood.id, {inStock: true})
    let foodListClone: IFood[] = JSON.parse(JSON.stringify(currentFoodList))
    foodListClone = foodListClone.map(food => {
      return  {...food, inStock: food.inStock, bought_on: new Date(food.bought_on), updated_on: new Date(food.updated_on)}
    })
    let target = foodListClone.find(food => food.id === selectedFood.id)
    if (target) {
      target.inStock = response.foodResponse.inStock
      target.name = response.foodResponse.name
      target.bought_on = new Date(response.foodResponse.bought_on)
    } 
    setCurrentFoodList(foodListClone)
    setCurrentFoodItem(null)
  }

  return (
    <View style={styles.container}>
            <ScrollView>
      <View style={styles.verticallySpaced}>
        <View style={styles.verticallySpaced}>
            {!currentFoodList.filter(food => food.inStock === false).length ? <Text style={styles.noItem}>The shopping list is empty</Text>
              : currentFoodList.filter((foodItem) => foodItem.inStock === false).map((foodItem) => {
                return (
                  <Pressable style={styles.list} key={`foodItem${foodItem.id}`} >
                    <Text style={styles.name}>{foodItem.name}</Text>
                    <Pressable style={styles.button} onPress={() => handleAddToKitchen(foodItem)}>
                      <Text style={styles.text}><AntDesign name="checksquare" size={24} color="#4dd377" /></Text>
                    </Pressable>
                  </Pressable>
                );
              })}              
          </View>
      </View>
      </ScrollView>
    </View>
  )
 }


 const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F8E8AF',
    padding: 20,
    margin: 0,

  },
  noItem: {
    fontSize: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 40

  },
  verticallySpaced: {
    flex: 1,
    // height: 30,
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  heading: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 0,
    flex: 1,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  name: {
    padding: 2,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 10,
  },
  date: {
    padding: 0,
    fontSize: 15,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 10
  },
  list: {
    flexDirection: "row",
    backgroundColor: 'white',
    borderWidth: 0,
    justifyContent: 'space-between',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 50,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    padding: 2,
    fontSize: 15,
    fontWeight: "bold",

  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  text: {}
})
