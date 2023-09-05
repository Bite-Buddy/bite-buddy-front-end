import React, { useRef } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

type Props = {
  name: string,
  boughtOn: Date
};

export default function FoodInput({ boughtOn, name }: Props) {
  return (
    <View style={styles.formBox}>
      <Text style={styles.verticallySpaced}>Name</Text>
      <TextInput style={styles.userInput} placeholder="Type the name of item" defaultValue={name} />
      <Text style={styles.verticallySpaced}>Bought on</Text>
      <TextInput
        style={styles.userInput}
        defaultValue={boughtOn.toLocaleString()} //Need to change it to calender input instead of text
      />
    </View>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    alignSelf: 'stretch',
  },
  formBox: {
    padding: 10,
    paddingTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  userInput: {
    height: 40,
    marginBottom: 15,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  /**Copied below from the other component, not sure the intention */
  // mt20: {
  //   marginTop: 20,
  // },
});
