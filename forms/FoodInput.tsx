import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { createFood } from '../utilities/fetchRequests'
import { currentKitchenAtom } from '../utilities/store/atoms';
import { useAtomValue } from 'jotai';
import { useNavigation } from '@react-navigation/native';

type Props = {
  mode: string, //"Create" or "Edit"
  initialItemName: string
  kitchenId: string
  id: string
}
type Items = {
  name: string,
  boughtOn: Date,
  error: string
}[]

export default function FoodInput({ mode, initialItemName, kitchenId }: Props) {
  const today = new Date();
  const navigation = useNavigation();
  const [items, setItems] = useState<Items>([{ name: initialItemName, boughtOn: today, error: "" }]);
  const [response, setResponse] = useState<string>("")
  const currentKitchen = useAtomValue(currentKitchenAtom)

  //Check empty input
  function isValid(): boolean {
    const someEmpty = items.some(item => item.name === "");
    //Update error message if there is any empty input
    if (someEmpty) {
      const currItems = [...items]
        .map(item => {
          return {
            name: item.name,
            boughtOn: item.boughtOn,
            error: item.name === "" ? "*required" : ""
          }
        });
      //Update items array state
      setItems(currItems)
    }
    return someEmpty;
  }

  const handleSubmit = (): void => {
    console.log('submit')
    if (!isValid) return
    console.log('valid')
    if (mode === "Create" && currentKitchen) {
      Promise.all(items.map(item => { createFood(currentKitchen.id, {name: item.name, bought_on: item.boughtOn}) }))
        .then((res) => { setResponse("Kitchen updated!") })
        .catch((e) => { setResponse(e.message) });
    }
    else if (mode === "Edit") {
      //Need to implement "PATCH" request
    }
  }

  const handleCancel = (): void => {
    //Need to implement cancelling the input and goes back to the appropreate screen
  }

  const handleDelete = (): void => {
    //Need to implement "DELETE" request
  }

  function updateItem(value: string, index: number) {
    const newItems = JSON.parse(JSON.stringify(items))
    newItems[index].name = value
    console.log(newItems)
    setItems(newItems)
  }

  return (
    <>
      {items.map((item, index) => {
        return (
          <View style={styles.formBox} key={`addFoodItem${index}`}>
            <Text style={styles.verticallySpaced}>{`Name ${item.error && item.error}`}</Text>
            <TextInput style={styles.userInput} placeholder="Type the name of item" value={item.name} onChangeText={(value) => updateItem(value, index)} />
            <Text style={styles.verticallySpaced}>Bought on</Text>
            <TextInput
              style={styles.userInput}
              value={item.boughtOn.toLocaleString()} //Need to change it to calender input instead of text
            />
          </View>)
      })}
      {
        mode === "Create" && <View style={styles.more}>
          <Button
            title="more+"
            onPress={() => { setItems([...items, { name: "", boughtOn: today, error: "" }]) }} /></View>
      }
      <View style={styles.buttons}>
        <Button title={mode} onPress={handleSubmit} />
        {mode === "Edit" ?? <Button title="delete" onPress={isValid ?? handleDelete} />
        }
        <Button title="Cancel" onPress={() => navigation.navigate("Kitchen")} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    alignSelf: "stretch",
  },
  formBox: {
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
  },
  userInput: {
    height: 40,
    marginBottom: 15,
    padding: 5,
    borderColor: "lightgray",
    borderWidth: 1,
  },
  more: {
    margin: 10
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  }
  /**Copied below from the other component, not sure the intention */
  // mt20: {
  //   marginTop: 20,
  // },
});
