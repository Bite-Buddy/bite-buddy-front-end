import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Button, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import { currentFoodListAtom, currentKitchenAtom } from '../utilities/store/atoms';
import { createFood } from '../utilities/fetchRequests';

type Items = {
    name: string,
    boughtOn: Date,
    error: string,
    showCalendar: boolean
}[]

export default function AddFood() {
    const navigation = useNavigation();
    const today = new Date();
    const blankItem = { name: "", boughtOn: today, error: "", showCalendar: false }
    const currentKitchen = useAtomValue(currentKitchenAtom)
    const [items, setItems] = useState<Items>([blankItem]);
    const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom)
    const [message, setMessage] = useState<string>("") //Currently not using, but will be implemented
    const INITIAL_DATE = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const [selectedDate, setSelectedDate] = useState<string>("");

    const marked = useMemo(() => {
        if (selectedDate !== "") {
            return {
                [selectedDate]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: 'orange',
                    selectedTextColor: 'red',
                }
            }
        }
    }, [selectedDate]);

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
                        error: item.name === "" ? "*required" : "",
                        showCalendar: false
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

    function updateItem(value: string | boolean, index: number, key: string) {
        const newItems = JSON.parse(JSON.stringify(items));
        if (key === "boughtOn" && typeof value === "string") {
            newItems[index][key] = new Date(value);
            newItems[index].showCalendar = false;
        }
        else {
            newItems[index][key] = value;
            if (key === "showCalendar") { setSelectedDate(INITIAL_DATE) }
        }
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
                        <TextInput style={styles.userInput}
                            placeholder="Type the name of item"
                            value={item.name}
                            onChangeText={(value) => updateItem(value, index, "name")} />
                        <Text style={styles.verticallySpaced}>Bought on</Text>
                        <Pressable style={styles.userInput}
                            onPress={() => updateItem(true, index, "showCalendar")}>
                            <Text >{item.boughtOn.toLocaleString()}</Text>
                        </Pressable >
                        {item.showCalendar && <Calendar
                            enableSwipeMonths
                            current={INITIAL_DATE}
                            style={styles.calendar}
                            onDayPress={(day) => {
                                updateItem(day.dateString, index, "boughtOn")
                            }}
                            markedDates={marked}
                        />}
                    </View>)
            })}
            <View style={styles.more}>
                <Button
                    title="more+"
                    onPress={() => { setItems([...items, { name: "", boughtOn: today, error: "", showCalendar: false }]) }} /></View>
            <View style={styles.buttons}>
                <Button title="Create" onPress={handleSubmit} />
                <Button title="Cancel" onPress={() => navigation.navigate("Kitchen Details")} />
                <Button title="Scan" onPress={() => navigation.navigate("Barcode Scan")}/>
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
    },
    calendar: {
        marginBottom: 10,
    },
    text: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'lightgrey',
        fontSize: 16,
    }
    /**Copied below from the other component, not sure the intention */
    // mt20: {
    //   marginTop: 20,
    // },
})
