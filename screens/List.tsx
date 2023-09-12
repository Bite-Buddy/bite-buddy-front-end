import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, Input, Button } from "react-native-elements";
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { currentFoodItemAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { deleteFoodById, updateFoodById } from "../utilities/fetchRequests"
import { IFood } from "../utilities/interfaces";


export default function List() {
  const navigation = useNavigation();
  const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom)
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
  const [name, setName] = useState("")
  const [boughtOn, setBoughtOn] = useState(new Date())
  const [loading, setLoading] = useState(false)
  console.log("lista swini", currentFoodList.filter(food => food.inStock === false))

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
      <View style={styles.verticallySpaced}>
            {!currentFoodList.filter(food => food.inStock === false).length ? <Text>"No items in the shopping list"</Text>
              : currentFoodList.filter((foodItem) => foodItem.inStock === false).map((foodItem) => {
                return (
                  <Text style={styles.list}>{foodItem.name}</Text>
                );
              })}
          </View>
      </View>
    </View>
  )
 }


 const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#696666',
    padding: 20,
    margin: 0,

  },
  verticallySpaced: {
    flex: 1,
    // height: 30,
    // backgroundColor: '#EFCA46',
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
    color: 'black',
    display: 'flex',
    alignItems: 'center',
  },
  text: {}
})
