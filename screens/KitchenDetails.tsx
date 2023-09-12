import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useAtomValue, useAtom } from 'jotai'
import { currentKitchenAtom, currentFoodListAtom, currentFoodItemAtom } from "../utilities/store/atoms";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from "react";
import { updateFoodById } from "../utilities/fetchRequests";


export default function KitchenDetails() {
  const today = new Date();
  const navigation = useNavigation();
  const currentKitchen = useAtomValue(currentKitchenAtom);
  // const currentFoodList = useAtomValue(currentFoodListAtom);
  const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom)
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
  const [inStock, setinStock] = useState(true)


  function handleFoodSelect(selectedFood) {
    console.log(selectedFood)
    setCurrentFoodItem(selectedFood)
    navigation.navigate('Edit Food')
  }

  async function handleAddToShopping(selectedFood) {
    if (!selectedFood) return;
    const response = await updateFoodById(selectedFood.id, {inStock: false})
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
    console.log('clone', foodListClone)
    setCurrentFoodList(foodListClone)
    setCurrentFoodItem(null)
    
  }



  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.verticallySpaced}>
            {!currentFoodList.length ? <Text>"No item stored"</Text>
            //calculate the day offset of the bought item
              : currentFoodList.filter((foodItem) => foodItem.inStock === true).map((foodItem) => {
                //Calculate the day offset of te bought day from today
                const dayOffSet = Math.floor((today.getTime() - foodItem.bought_on.getTime()) / (24 * 60 * 60 * 1000))
                return (
                  <Pressable style={styles.list} key={`foodItem${foodItem.id}`} onPress={() => { handleFoodSelect(foodItem) }} >
                    <Text style={styles.name}>{foodItem.name}</Text>
                    <Text style={styles.name}>{foodItem.inStock}</Text>
                    <Text style={styles.date}>Added {dayOffSet} day{dayOffSet > 1 ?? "s"} ago</Text>
                    <Pressable style={styles.button} title="List" onPress={() => handleAddToShopping(foodItem)}>
                       <Text style={styles.text}><FontAwesome5 name="list-alt" size={24} color="black" /></Text>
                    </Pressable>
                  </Pressable>
                  
                );
              })}
          </View>
        </View>
      </ScrollView>
      <View>
        <Pressable style={styles.button} onPress={() => navigation.navigate('AddFood')}>
          <Text style={styles.text}><MaterialCommunityIcons name="plus" size={30} color="black" /></Text>
        </Pressable>
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
  },
  button: {
    color: 'black',
    display: 'flex',
    alignItems: 'center',
  },
  text: {}
})
