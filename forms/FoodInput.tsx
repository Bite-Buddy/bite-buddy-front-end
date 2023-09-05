import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

type Props = {
  mode: string, //"Create" or "Edit"
  initialItemName: string
}
type Items = {
  name: string,
  boughtOn: Date,
  error: string
}[]

export default function FoodInput({ mode, initialItemName }: Props) {
  const today = new Date();
  const [items, setItems] = useState<Items>([{ name: initialItemName, boughtOn: today, error: "" }]);

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
            error: item.name === "" ? "Name is required" : ""
          }
        });
      //Update items array state
      setItems(currItems)
    }
    return someEmpty;
  }

  const handleSubmit = (): void => {
    //Need to implement "PUT" request for "Create" mode, and PATCH request for "Edit" mode
  }

  const handleCancel = (): void => {
    //Need to implement cancelling the input and goes back to the appropreate screen
  }

  return (
    <>
      {items.map((item) => {
        return (
          <View style={styles.formBox}>
            <Text style={styles.verticallySpaced}>Name</Text>
            <TextInput style={styles.userInput} placeholder="Type the name of item" defaultValue={item.name} />
            <Text style={styles.verticallySpaced}>Bought on</Text>
            <TextInput
              style={styles.userInput}
              defaultValue={item.boughtOn.toLocaleString()} //Need to change it to calender input instead of text
            />
          </View>)
      })}
      {
        mode === "Create"
        ?? <Button
          title="more+"
          onPress={() => { setItems([...items, { name: "", boughtOn: today, error: "" }]) }} />
      }
      <Button title={mode} onPress={isValid ?? handleSubmit} />
      <Button title="Cancel" onPress={handleCancel} />
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
  /**Copied below from the other component, not sure the intention */
  // mt20: {
  //   marginTop: 20,
  // },
});
