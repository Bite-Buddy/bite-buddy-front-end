import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Button } from 'react-native';
import FoodInput from '../forms/FoodInput'


export default function AddFood() {
    type Items = {
        name: string,
        boughtOn: Date
    }[]
    const today = new Date();
    const [items, setItems] = useState<Items>([{ name: "", boughtOn: today }]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headline}>Add New Item</Text>
            {items.map((item, index) => { return <FoodInput key={index} name={item.name} boughtOn={item.boughtOn} /> })}
            <Button
                onPress={() => { setItems([...items, { name: "", boughtOn: today }]) }}
                title={"+"} />
        </ScrollView>
    );
};

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
