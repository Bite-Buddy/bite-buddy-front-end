import { StyleSheet, View, FlatList, SafeAreaView, RefreshControl } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useAtom, useAtomValue } from "jotai";
import { currentKitchenAtom } from "../utilities/store/atoms";
import { getUsersByKitchen } from "../utilities/fetchRequests";
import { useState, useEffect } from "react";

export default function KitchenMembers() {
const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom)
const [emailList, setEmailList] = useState([])
console.log(emailList)

useEffect(() => {
  if (currentKitchen) {
    getUsers()
  }
}, [currentKitchen])

const getUsers = async () => {
  try {
    if (currentKitchen) {
      let kitchenInfo = await getUsersByKitchen(currentKitchen.id);
      let newEmailList = kitchenInfo.map((member) => member.email);
      setEmailList(newEmailList);
    }
  }
  catch (error) {
    console.error(error);
    throw(error)
  }
}

const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
      <Text style={styles.heading}>Kitchen Members</Text>
        {emailList.map((user, i) => {
          return (
          <View key={`kitchenMembers${i}`}>
            <Text style={styles.item}>{user}</Text>
          </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    padding: 12,
    backgroundColor: "#FFF",
    flex: 1
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  item: {
    padding: 20,
    fontSize: 18,
    marginTop: 5,
    textAlign: 'center',
  },
  heading: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 0,
    flex: 1,
    fontWeight: 'bold',
    color: '#1D1D1D',
    textAlign: 'center',
  },
})
