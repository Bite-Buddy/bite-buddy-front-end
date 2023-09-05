import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';

const today = new Date()

export default function AddFood() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headline}>Add New Item</Text>
      <View>
        <Text style={styles.verticallySpaced}>Name</Text>
        <TextInput
          style={styles.userInput}
          placeholder='Type the name of item'
        />
        <Text style={styles.verticallySpaced}>Bought on</Text>
        <TextInput
          style={styles.userInput}
          defaultValue={today.toISOString()}
        />
      </View>
    </ScrollView>
  );
};

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
  userInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  headline: {
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  /**Copied below from the other component, not sure the intention */
  // mt20: {
  //   marginTop: 20,
  // },
})
