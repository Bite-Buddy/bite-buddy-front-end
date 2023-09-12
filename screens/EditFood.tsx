import { Pressable, StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from 'jotai'
import { useState, useEffect, useMemo, SetStateAction } from 'react'
import { currentFoodItemAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { deleteFoodById, updateFoodById } from "../utilities/fetchRequests"
import { IFood } from "../utilities/interfaces";
import { Calendar } from "react-native-calendars";



export default function EditFood() {
  const navigation = useNavigation();
  const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom);
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom);
  const [name, setName] = useState("");
  const [boughtOn, setBoughtOn] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  //Initial state setup
  useEffect(() => {
    const initialDate = currentFoodItem && new Date(currentFoodItem.bought_on)
    initialDate && setSelectedDate(`${initialDate.getFullYear()}-${initialDate.getMonth() - 1}-${initialDate.getDate()}`)
  }, [])

  //Watch changes in currentFoodItem and selectedDate
  useEffect(() => {
    if (currentFoodItem) {
      setName(currentFoodItem.name)
      setBoughtOn(new Date(selectedDate))
    }
  }, [currentFoodItem, selectedDate])

  async function updateFoodItem() {
    if (!currentFoodItem) return;
    const response = await updateFoodById(currentFoodItem.id, { name: name, bought_on: boughtOn })
    let foodListClone: IFood[] = JSON.parse(JSON.stringify(currentFoodList))
    foodListClone = foodListClone.map(food => {
      return { ...food, bought_on: new Date(food.bought_on), updated_on: new Date(food.updated_on) }
    })
    let target = foodListClone.find(food => food.id === currentFoodItem.id)
    if (target) {
      target.name = response.foodResponse.name
      target.bought_on = new Date(response.foodResponse.bought_on)
    }
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
      return { ...food, bought_on: new Date(food.bought_on), updated_on: new Date(food.updated_on) }
    })
    setCurrentFoodList(foodListClone.filter(food => food.id !== response.foodResponse.id)
    )
    setLoading(false)
    navigation.navigate('Kitchen Details')
  }

  //Mark selected date on calendar
  const marked = useMemo(() => {
    if (selectedDate !== "") {
      return {
        [selectedDate]: {
          selected: true,
          disableTouchEvent: true,
          selectedColor: 'orange',
          selectedTextColor: 'red',
        }
      }
    }
  }, [selectedDate]);

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
        <Text style={styles.verticallySpaced}>Bought on</Text>
        <Pressable style={styles.userInput}
          onPress={() => {
            setShowCalendar(true)
            marked;
          }}>
          <Text >{boughtOn.toLocaleString()}</Text>
        </Pressable >
        {showCalendar && <Calendar
          enableSwipeMonths
          current={selectedDate}
          style={styles.calendar}
          onDayPress={(day) => {
            setSelectedDate(day.dateString)
            setShowCalendar(false);
          }}
          markedDates={marked}
        />}
        <Button title="Update" disabled={loading} onPress={() => updateFoodItem()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Delete Food Item" disabled={loading} onPress={() => deleteFoodItem()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Cancel" disabled={loading} onPress={() => navigation.navigate("Kitchen Details")} />
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
  calendar: {
    marginBottom: 10,
  },
  userInput: {
    height: 40,
    marginBottom: 15,
    padding: 5,
    borderColor: "lightgray",
    borderWidth: 1,
  },
})
