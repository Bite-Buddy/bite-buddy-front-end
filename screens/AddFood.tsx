import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import { currentFoodListAtom, currentKitchenAtom } from '../utilities/store/atoms';
import { createFood } from '../utilities/fetchRequests';

type Items = {
    name: string,
    boughtOn: Date,
    error: string
}[]

export default function AddFood() {
    const navigation = useNavigation();
    const today = new Date();
    const blankItem = { name: "", boughtOn: today, error: "" }
    const currentKitchen = useAtomValue(currentKitchenAtom)
    const [items, setItems] = useState<Items>([blankItem]);
    const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
    const [message, setMessage] = useState<string>("") //Currently not using, but will be implemented


    //Check if all items name are not blank
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
        //Checks validation. If not validate, gets out from this block.
        if (!isValid) return
        if (!currentKitchen) {
            setMessage("Kitchen is not selected.");
            return;
        }
        //POST request to add all items to the server.
        Promise.all(items.map(item => createFood(currentKitchen.id, { name: item.name, bought_on: item.boughtOn })))
            .then((res) => {
                setMessage("Kitchen updated!"); //Currently not using, but will be implemented
                const preparedFoodList = res.map(response => {
                    return {
                        ...response.food,
                        bought_on: new Date(response.food.bought_on),
                        updated_on: new Date(response.food.updated_on)
                    }
                })
                setCurrentFoodList(currentFoodList.concat(preparedFoodList));
            })
            .catch((e) => {
                console.log(e)
                setMessage(e.message)
            })
            .finally(() => navigation.navigate("Kitchen Details")); //Currently not using, but will be implemented
    }

    function updateItem(value: string, index: number, key: string) {
        const newItems = JSON.parse(JSON.stringify(items))
        newItems[index][key] = value
        console.log(newItems)
        setItems(newItems)
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headline}>Add New Item</Text>
            {items.map((item, index) => {
                return (
                    <View style={styles.formBox} key={`addFoodItem${index}`}>
                        <Text style={styles.verticallySpaced}>{`Name ${item.error && item.error}`}</Text>
                        <TextInput style={styles.userInput} placeholder="Type the name of item" value={item.name} onChangeText={(value) => updateItem(value, index, "name")} />
                        <Text style={styles.verticallySpaced}>Bought on</Text>
                        <TextInput
                            style={styles.userInput}
                            onChangeText={(value) => updateItem(value, index, "boughtOn")}
                            value={item.boughtOn.toLocaleString()} //Need to change it to calender input instead of text
                        />
                    </View>)
            })}

            <View style={styles.more}>
                <Button
                    title="more+"
                    onPress={() => { setItems([...items, { name: "", boughtOn: today, error: "" }]) }} /></View>

            <View style={styles.buttons}>
                <Button title="Create" onPress={handleSubmit} />
                <Button title="Cancel" onPress={() => navigation.navigate("Kitchen Details")} />
            </View>
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
})
