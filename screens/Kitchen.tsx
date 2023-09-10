import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { getKitchenByID } from "../utilities/fetchRequests"
import { useAtom } from "jotai";
import { kitchensAtom, currentKitchenAtom } from "../utilities/store/atoms";
import { IKitchen } from "../utilities/interfaces";
import { Drawer } from 'expo-router/drawer';


export default function Kitchen() {
  const today = new Date();
  const navigation = useNavigation();
  //Initial state is set as an empty array
  interface IfoodItem { name: string, bought_on: Date, id: string | number }
  const [foodList, setFoodList] = useState<IfoodItem[] | null>(null);
  const [kitchens, setKitchens] = useAtom(kitchensAtom)
  const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom)

  useEffect(() => {
    if (currentKitchen) {
      fetchFoodList()
    }
  }, [currentKitchen])

  /**Fetch the foodList that belongs to thiskitchen */
  const fetchFoodList = async () => {
    console.log('fetching foodlist', currentKitchen)
    if (currentKitchen) {
      try {
        let kitchenInfo = await getKitchenByID(currentKitchen.id);
        let modList = await kitchenInfo.food_list.map(item => { return { "bought_on": new Date(item.bought_on), "name": item.name, "id": item.id } })
        setFoodList(modList)
      } catch (e) {
        console.error("Error fetching food list: ", e)
      }
    }
  }

  function selectKitchen(kitchen: IKitchen) {
    navigation.navigate("Kitchen Settings");
    setCurrentKitchen(kitchen);
  }

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text style={styles.heading}>{currentKitchen ? currentKitchen.name : 'Select a Kitchen'}</Text>
        <ScrollView>
          <View>
            <View>
              {kitchens.map(kitchen => {
              return (
                <Pressable key={`selectableKitchen${kitchen.id}`} style={styles.button} onPress={() => selectKitchen(kitchen)}>
                  <Text style={styles.text}>
                    {kitchen.name}
                  </Text>
                </Pressable>
              )})}
            </View>
            {foodList === null ? <Text>"No item stored"</Text>
              : foodList.map((foodItem) => {
                //Calculate the day offset of te bought day from today
                const dayOffSet = Math.floor((today.getTime() - foodItem.bought_on.getTime()) / (24 * 60 * 60 * 1000))
                return (
                  <Pressable style={styles.list} key={`foodItem${foodItem.id}`}>
                    <Text style={styles.name}>{foodItem.name}</Text>
                    <Text style={styles.date}>Added {dayOffSet} day{dayOffSet > 1 ?? "s"} ago</Text>
                  </Pressable>
                );
              })}
          </View>

        </ScrollView>
      </View>
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
    backgroundColor: '#EFCA46',
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
