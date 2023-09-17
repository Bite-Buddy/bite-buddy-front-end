import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Button, Text } from "react-native-elements";
import { ListItem } from '@rneui/themed';
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IFood } from "../utilities/interfaces";
import { getKitchenByID, updateFoodById } from "../utilities/fetchRequests";
import { currentKitchenAtom, currentFoodListAtom, currentFoodItemAtom } from "../utilities/store/atoms";
import { useAtomValue, useAtom } from 'jotai'

export default function KitchenDetails() {
  const today = new Date();
  const navigation = useNavigation();
  const currentKitchen = useAtomValue(currentKitchenAtom);
  // const currentFoodList = useAtomValue(currentFoodListAtom);
  const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom)
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
  const [inStock, setinStock] = useState(true)

  useEffect(() => {
    fetchFoodList();
  }, [currentKitchen])

  function handleFoodSelect(selectedFood: IFood) {
    console.log(selectedFood)
    setCurrentFoodItem(selectedFood)
    navigation.navigate('Edit Food')
  }

  const fetchFoodList = async () => {
    console.log('fetching foodlist', currentKitchen)
    if (currentKitchen) {
      try {
        let kitchenInfo = await getKitchenByID(currentKitchen.id);
        let modList = await kitchenInfo.food_list.map(item => { return { ...item, "bought_on": new Date(item.bought_on) } })
        // setFoodList(modList)
        console.log('setting', modList)
        setCurrentFoodList(modList)
      } catch (e) {
        console.error("Error fetching food list: ", e)
      }
    }
  }

  async function handleAddToShopping(selectedFood: IFood) {
    if (!selectedFood) return;
    const response = await updateFoodById(selectedFood.id, { inStock: false })
    let foodListClone: IFood[] = JSON.parse(JSON.stringify(currentFoodList))
    foodListClone = foodListClone.map(food => {
      return { ...food, inStock: food.inStock, bought_on: new Date(food.bought_on), updated_on: new Date(food.updated_on) }
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
  //<Text style={styles.date}>Added {dayOffSet} day{dayOffSet > 1 ?? "s"} ago</Text>
  async function handleSwipe(item: IFood) {
    await handleAddToShopping(item)
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <View>
          </View>
          <View style={styles.verticallySpaced}>
            {!currentFoodList.length ? <Text style={styles.noItem}>No items in stock</Text>
              //calculate the day offset of the bought item
              : currentFoodList.filter((foodItem) => foodItem.inStock === true).map((foodItem) => {
                //Calculate the day offset of te bought day from today
                const dayOffSet = Math.floor((today.getTime() - foodItem.bought_on.getTime()) / (24 * 60 * 60 * 1000))
                return (
                  <ListItem.Swipeable style={styles.list}
                    leftWidth={ScreenWidth / 2}
                    key={`foodItem${foodItem.id}`}
                    leftContent={(reset) => (
                      <Button
                        title="Adding to shopping list"
                        onPress={() => reset()}
                        buttonStyle={{ height: 75, backgroundColor: '#4dd377', borderRadius: 7, marginTop: 5, marginLeft: 10, marginRight: 20, padding: 2 }}
                      />
                    )}
                    onSwipeEnd={() => handleSwipe(foodItem)}
                  >
                    <ListItem.Content>
                      <Pressable key={`foodItem${foodItem.id}`} onPress={() => { handleFoodSelect(foodItem) }} >
                        <ListItem.Title>
                          <Text style={styles.name} ellipsizeMode={"tail"} numberOfLines={1}>{foodItem.name}</Text>
                        </ListItem.Title>
                        <ListItem.Subtitle>
                          <Text style={styles.date}>
                            Added {dayOffSet === 0
                              ? "today"
                              : dayOffSet === 1
                                ? "yesterday"
                                : `${dayOffSet} days ago`}
                          </Text>
                        </ListItem.Subtitle>
                      </Pressable>
                    </ListItem.Content>
                  </ListItem.Swipeable>


                );
              })}
          </View>
        </View>
      </ScrollView>
      <View>
        <Pressable style={styles.button2} onPress={() => navigation.navigate('AddFood')}>
          <Text style={styles.text}><MaterialCommunityIcons style={styles.icon} name="plus" size={30} color="black" /></Text>
        </Pressable>
      </View>
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
    padding: 10,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
    marginRight: 30,
    marginLeft: 10,
    width: 150,
  },
  noItem: {
    fontSize: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 40

  },
  date: {
    padding: 0,
    fontSize: 15,
    marginTop: 10,
    marginLeft: 0,
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
    height: 75,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    fontSize: 15,

  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,

  },
  button2: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: 1,
    backgroundColor: '#4dd377',
    width: 50,
    height: 50,
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 20,
  },
  icon: {
    fontSize: 36
  }
})
