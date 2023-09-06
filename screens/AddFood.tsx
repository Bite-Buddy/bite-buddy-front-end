import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Button } from 'react-native';
import FoodInput from '../forms/FoodInput'


export default function AddFood() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headline}>Add New Item</Text>
            <FoodInput mode="Create" initialItemName="" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    headline: {
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    /**Copied below from the other component, not sure the intention */
    // mt20: {
    //   marginTop: 20,
    // },
})
