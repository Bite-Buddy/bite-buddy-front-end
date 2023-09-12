import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { getKitchenByID } from "../utilities/fetchRequests"
import { useAtom } from "jotai";
import { kitchensAtom, currentKitchenAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { IKitchen } from "../utilities/interfaces";

export default function Kitchen() {
  const today = new Date();
  const navigation = useNavigation();
  //Initial state is set as an empty array
  interface IfoodItem { name: string, bought_on: Date, id: string | number }
  // const [foodList, setFoodList] = useState<IfoodItem[] | null>(null);
  const [kitchens, setKitchens] = useAtom(kitchensAtom)
  const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom)
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)

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
        let modList = await kitchenInfo.food_list.map(item => { return { ...item, "bought_on": new Date(item.bought_on)} })
        // setFoodList(modList)
        console.log('setting', modList)
        setCurrentFoodList(modList)
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
        <Text style={styles.heading}>My Kitchens</Text>
        <ScrollView>
          <View>
            <View>
              {kitchens.map(kitchen => {
              return (
                <Pressable key={`selectableKitchen${kitchen.id}`} style={styles.list} onPress={() => selectKitchen(kitchen)}>
                  <Text style={styles.kitchen}>
                    {kitchen.name}
                  </Text>
                </Pressable>
              )})}
            </View>
          </View>

        </ScrollView>
      </View>
      <View>
        <Pressable style={styles.button} onPress={() => navigation.navigate('AddKitchen')}>
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
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  kitchen: {
    fontSize: 18,
    fontWeight: "bold"
  },
  heading: {
    fontSize: 20,
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
    backgroundColor: '#EFCA46',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 60,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#4dd377',
    width: 50,
    height: 50,
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 20
  },
  icon: {
    fontSize: 36
  }
})
