import { StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { currentKitchenAtom, kitchensAtom } from "../utilities/store/atoms";
import { updateKitchenById, deleteKitchenById } from "../utilities/fetchRequests";
import { IKitchen } from "../utilities/interfaces";

export default function KitchenManagement() {
const navigation = useNavigation();
const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom)
const [kitchens, setKitchens] = useAtom(kitchensAtom)
const [name, setName] = useState("")
const [loading, setLoading] = useState(false)

useEffect(() => {
  if (currentKitchen) setName(currentKitchen.name)
}, [currentKitchen])

  async function submitKitchen() {
    setLoading(true)
    if (!currentKitchen) return;
    const response = await updateKitchenById(currentKitchen.id, name);
    const kitchensClone: IKitchen[] = JSON.parse(JSON.stringify(kitchens))
    let target = kitchensClone.find(kitchen => kitchen.id === currentKitchen.id)
    if (target) target.name = response.kitchenResponse.name
    setKitchens(kitchensClone)
    const currentKitchenClone = JSON.parse(JSON.stringify(currentKitchen))
    currentKitchenClone.name = response.kitchenResponse.name
    setCurrentKitchen(currentKitchenClone)
    setLoading(false)
    navigation.navigate('Kitchen Details')
  }

  async function deleteKitchen() {
    setLoading(true)
    if (!currentKitchen) return;
    const response = await deleteKitchenById(currentKitchen.id);
    setCurrentKitchen(null)
    const kitchensClone: IKitchen[] = JSON.parse(JSON.stringify(kitchens))
    setKitchens(kitchensClone.filter(kitchen => kitchen.id !== response.kitchenResponse.id))
    setLoading(false)
    navigation.navigate('Kitchen')
  }

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text>Change Kitchen Name</Text>
        <Input
              label="Name"
              onChangeText={(text) => setName(text)}
              value={name}
              placeholder="My Kitchen"
              autoCapitalize={'none'}
            />
            <Button title="Submit" disabled={loading} onPress={() => submitKitchen()} />
      </View>
      <View>
      <Button title="Delete Kitchen" disabled={loading} onPress={() => deleteKitchen()} />
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
})
