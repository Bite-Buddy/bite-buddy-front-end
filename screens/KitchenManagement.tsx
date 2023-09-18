import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { currentKitchenAtom, kitchensAtom } from "../utilities/store/atoms";
import { updateKitchenById, deleteKitchenById } from "../utilities/fetchRequests";
import { IKitchen } from "../utilities/interfaces";
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function KitchenManagement() {
  const navigation = useNavigation();
  const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom)
  const [kitchens, setKitchens] = useAtom(kitchensAtom)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (currentKitchen) setName(currentKitchen.name)
  }, [currentKitchen])

  async function submitKitchen() {
    console.log(name)
    setLoading(true)
    if (!currentKitchen) return;
    if (name === "") {
      setError("*required");
      setLoading(false);
      return;
    }
    const response = await updateKitchenById(currentKitchen.id, name);
    const kitchensClone: IKitchen[] = JSON.parse(JSON.stringify(kitchens))
    let target = kitchensClone.find(kitchen => kitchen.id === currentKitchen.id)
    if (target) target.name = response.kitchenResponse.name
    setKitchens(kitchensClone)
    const currentKitchenClone = JSON.parse(JSON.stringify(currentKitchen))
    currentKitchenClone.name = response.kitchenResponse.name
    setCurrentKitchen(currentKitchenClone)
    setLoading(false)
    navigation.navigate('Kitchen')
  }

  async function deleteKitchen() {
    setLoading(true)

    if (!currentKitchen) return;
    const response = await deleteKitchenById(currentKitchen.id);
    setCurrentKitchen(null)
    const kitchensClone: IKitchen[] = JSON.parse(JSON.stringify(kitchens))
    const newKitchens = kitchensClone.filter(kitchen => kitchen.id !== response.kitchenResponse.id)
    setKitchens(newKitchens)
    setLoading(false)
    if (newKitchens.length) {
      setCurrentKitchen(newKitchens[0])
      navigation.navigate('All Kitchens')
    } else {
      navigation.navigate('Account')
    }
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalWindow}>
          <View style={styles.modalView}>
            <Text style={styles.headline}>{`${currentKitchen?.name} will be deleted!`}</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this kitchen?</Text>
            <View style={styles.buttons}>
              <Pressable style={[styles.button, { backgroundColor: "gray" }]} onPress={() => { setModalVisible(false) }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Cancel</Text></Pressable>
              <Pressable style={[styles.button, { backgroundColor: "red" }]} onPress={() => { deleteKitchen() }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Delete<MaterialCommunityIcons name="delete-alert-outline" size={20} /></Text></Pressable>

            </View>
          </View>
        </View>
      </Modal >
      <View style={styles.verticallySpaced}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.text}>Change Kitchen Name</Text>
          {error !== "" && <Text style={{ color: "darkred" }}>{"  " + error}</Text>}
        </View>
        <TextInput
          onChangeText={(text: string) => setName(text)}
          value={name}
          placeholder="My Kitchen"
          style={styles.userInput}
        />
        <Pressable style={styles.button} disabled={loading} onPress={() => submitKitchen()}><Text style={styles.buttonText}>Submit</Text></Pressable>
      </View>
      <View>
        <Pressable style={styles.button} disabled={loading} onPress={() => setModalVisible(true)}><Text style={styles.buttonText}>Delete</Text></Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    padding: 12,
    backgroundColor: "#FFF",
    flex: 1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  modalWindow: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
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
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
  },
  modalText: {
    margin: 10,
    marginBottom: 20,
    fontSize: 17,
    textAlign: "center",
  },
  headline: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userInput: {
    height: 40,
    marginBottom: 15,
    padding: 5,
    borderColor: "lightgray",
    borderWidth: 1,
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
    textAlignVertical: "center",
    fontSize: 16,
  },
})
