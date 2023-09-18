import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai'
import { useState, useEffect, useMemo } from 'react'
import { currentFoodItemAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { deleteFoodById, updateFoodById } from "../utilities/fetchRequests"
import { IFood } from "../utilities/interfaces";

export default function EditFood() {
  const navigation = useNavigation();
  const [currentFoodItem, setCurrentFoodItem] = useAtom(currentFoodItemAtom);
  const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom);
  const [name, setName] = useState("");
  const [boughtOn, setBoughtOn] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  //Initial state setup
  useEffect(() => {
    const initialDate = currentFoodItem && new Date(currentFoodItem.bought_on)
    initialDate && setSelectedDate(`${initialDate.getFullYear()}-${initialDate.getMonth() + 1}-${initialDate.getDate()}`)
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
    navigation.navigate("Kitchen")
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
    navigation.navigate('Kitchen')
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
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalWindow}>
          <View style={styles.modalView}>
            <Text style={styles.headline}>{`${currentFoodItem?.name} will be deleted!`}</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this item?</Text>
            <View style={styles.buttons}>
              <Pressable style={[styles.button, { backgroundColor: "gray" }]} onPress={() => { setModalVisible(false) }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Cancel</Text></Pressable>
              <Pressable style={[styles.button, { backgroundColor: "red" }]} onPress={() => { deleteFoodItem() }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Delete<MaterialCommunityIcons name="delete-alert-outline" size={20} /></Text></Pressable>

            </View>
          </View>
        </View>
      </Modal >
      <View style={styles.verticallySpaced}>
        <Text style={styles.headline}>Edit Food</Text>
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
          <Text >{`${boughtOn.getFullYear()}-${boughtOn.getMonth() + 1}-${boughtOn.getDate()}`}</Text>
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
        <Pressable style={styles.button} disabled={loading} onPress={() => updateFoodItem()} ><Text style={styles.buttonText}>Update Food</Text></Pressable>
      </View>
      <View>
        <Pressable style={styles.button} disabled={loading} onPress={() => setModalVisible(true)} ><Text style={styles.buttonText}>Delete Food</Text></Pressable>
      </View>
    </View >
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
  headline: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 20,
  },
  button: {
    marginHorizontal: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFD43A',
    height: 40,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    textAlignVertical: "center"
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
  modalWindow: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
  },
  modalView: {
    margin: 30,
    backgroundColor: '#ddd',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  modalText: {
    margin: 10,
    marginBottom: 20,
    fontSize: 17,
    textAlign: "center",
  },
})
