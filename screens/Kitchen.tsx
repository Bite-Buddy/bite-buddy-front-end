import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { getFoodList } from "../fetchRequests"

export default function Kitchen() {
  const today = new Date();
  const navigation = useNavigation();
  //Creting a mock foodList
  const mockYesterDay = new Date();
  const mockThreeDaysAgo = new Date();
  const mockSevenDaysAgo = new Date();
  mockYesterDay.setDate(mockYesterDay.getDate() - 1);
  mockThreeDaysAgo.setDate(mockThreeDaysAgo.getDate() - 3);
  mockSevenDaysAgo.setDate(mockSevenDaysAgo.getDate() - 7);
  const mockList = [
    { name: "Milk", date: mockYesterDay },
    { name: "Eggs", date: mockYesterDay },
    { name: "Strawberries", date: mockThreeDaysAgo },
    { name: "Cheese", date: mockYesterDay },
    { name: "Greek Yogurt", date: mockSevenDaysAgo }]

  //Initial state is set as an empty array
  const [foodList, setFoodList] = useState<{ name: string, date: Date }[] | null>(null);
  useEffect(() => { setFoodList(mockList) }, [])

  /**Once fetch requst module is implemeted, code below should replace the mock setup. */
  // useEffect(() => {
  //   const fetchFoodList = async () => {
  //     try {
  //       const initalFoodList = await getFoodList(userId, kitchenId);
  //       setFoodList(initalFoodList);
  //     } catch (e) {
  //       console.error("Error fetching food list: ", e)
  //     }
  //   }
  // }, [])

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text style={styles.heading}>Kitchen</Text>
        <ScrollView>
          <View>
            {foodList === null ? <Text>"No item stored"</Text>
              : foodList.map((foodProduct) => {
                //Calculate the day offset of te bought day from today
                const dayOffSet = Math.floor((today.getTime() - foodProduct.date.getTime()) / (24 * 60 * 60 * 1000))
                return (
                  <View style={styles.list} key={`foodProduct${foodProduct.name}`}>
                    <Text style={styles.name}>{foodProduct.name}</Text>
                    <Text style={styles.date}>Added {dayOffSet} day{dayOffSet > 1 ?? "s"} ago</Text>
                  </View>
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
