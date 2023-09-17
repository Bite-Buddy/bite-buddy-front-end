import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, Input, Button } from "react-native-elements";
import { useAtom } from 'jotai'
import { useState, useEffect } from 'react'
import { currentFoodItemAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { deleteFoodById, updateFoodById } from "../utilities/fetchRequests"
import { IFood } from "../utilities/interfaces";
import { AntDesign } from '@expo/vector-icons'; 
import { ListItem } from "@rneui/themed";
import { ScreenWidth } from "react-native-elements/dist/helpers";




export default function List() {
  const navigation = useNavigation();
  const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom)
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
  const [name, setName] = useState("")
  const [boughtOn, setBoughtOn] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [touchStartTime, setTouchStartTime] = useState(0)
  
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

  function handleTouchStart() {
    setTouchStartTime(Date.now())
  }

  async function handleSwipe(item: IFood) {
    if ((Date.now() - touchStartTime) > 500) {
       await handleAddToKitchen(item)
    }
  }

  return (
    <View style={styles.container}>
            <ScrollView>
      <View style={styles.verticallySpaced}>
        <View style={styles.verticallySpaced}>
            {!currentFoodList.filter(food => food.inStock === false).length ? <Text style={styles.noItem}>The shopping list is empty</Text>
              : currentFoodList.filter((foodItem) => foodItem.inStock === false).map((foodItem) => {
                return (
                  <ListItem.Swipeable style={styles.list}
                    rightWidth={ScreenWidth/2}
                    minSlideWidth={50}
                    onTouchStart={handleTouchStart}
                    key={`shoppingListItem${foodItem.id}`}
                    rightContent={(reset) => (
                      <Button
                      title="Adding to kitchen"
                      onPress={() => reset()}
                      buttonStyle={{ height: 60, backgroundColor: '#4dd377', borderRadius: 7, marginTop: 5, marginLeft: 10, marginRight: 20 }}
                    />
                    )}

                    onSwipeEnd={() => handleSwipe(foodItem)}
                  >
                    <ListItem.Content>
                      <Pressable key={`foodItem${foodItem.id}`} >
                      <ListItem.Title>{foodItem.name}</ListItem.Title>
                    </Pressable>
                    </ListItem.Content>
                  </ListItem.Swipeable>
                  
                 
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
    color: 'black',
  },
  date: {
    padding: 0,
    fontSize: 15,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 10
  },
  list: {
    // flexDirection: "row",
    backgroundColor: 'white',
    
    borderWidth: 0,
    // justifyContent: 'space-between',
    marginTop: 5,
    padding: 2,
    marginLeft: 10,
    marginRight: 10,
    height: 60,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    // padding: 2,
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
