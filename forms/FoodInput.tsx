import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { createFood, getFoodList } from '../utilities/fetchRequests'

type Props = {
  mode: string, //"Create" or "Edit"
  initialItemName: string
  kitchenId: string
}
type Items = {
  name: string,
  boughtOn: Date,
  error: string
}[]

export default function FoodInput({ mode, initialItemName, kitchenId, userId }: Props) {
  const today = new Date();
  const [items, setItems] = useState<Items>([{ name: initialItemName, boughtOn: today, error: "" }]);
  const [response, setResponse] = useState<string>("")

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
    if (!isValid) return
    if (mode === "Create") {
      Promise.all(items.map(item => { createFood(kitchenId, item.name, item.boughtOn) }))
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

  return (
    <>
      {items.map((item, index) => {
        return (
          <View style={styles.formBox} key={index}>
            <Text style={styles.verticallySpaced}>{`Name ${item.error && item.error}`}</Text>
            <TextInput style={styles.userInput} placeholder="Type the name of item" defaultValue={item.name} />
            <Text style={styles.verticallySpaced}>Bought on</Text>
            <TextInput
              style={styles.userInput}
              defaultValue={item.boughtOn.toLocaleString()} //Need to change it to calender input instead of text
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
        <Button title={mode} onPress={isValid ?? handleSubmit} />
        {mode === "Edit" ?? <Button title="delete" onPress={isValid ?? handleDelete} />
        }
        <Button title="Cancel" onPress={handleCancel} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    alignSelf: 'stretch',
  },
  formBox: {
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
  },
  userInput: {
    height: 40,
    marginBottom: 15,
    padding: 5,
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  more: {
    margin: 10
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }
  /**Copied below from the other component, not sure the intention */
  // mt20: {
  //   marginTop: 20,
  // },
});
