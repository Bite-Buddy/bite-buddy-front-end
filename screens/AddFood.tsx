import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Button, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import { currentFoodListAtom, currentKitchenAtom } from '../utilities/store/atoms';
import { createFood } from '../utilities/fetchRequests';
import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from "expo-barcode-scanner";
import { searchByBarcode } from '../utilities/fetchRequests';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Items = {
    name: string,
    boughtOn: Date,
    error: string,
    showCalendar: boolean,
    focus: boolean
}[]

function dateToSrting(date: Date) {
    const datestr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return datestr
}

export default function AddFood() {
    const navigation = useNavigation();
    const today = new Date();
    const initialDateStr = dateToSrting(today);
    const blankItem = { name: "", boughtOn: today, error: "", showCalendar: false, focus: true }
    const currentKitchen = useAtomValue(currentKitchenAtom);
    const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom);
    const [items, setItems] = useState<Items>([blankItem]);
    const [selectedDateStr, setSelectedDateStr] = useState<string>("");
    const [cameraGranted, setCameraGranted] = useState<boolean>(false);
    const [useScanner, setUseScanner] = useState<boolean>(false);
    const [scanData, setScanData] = useState<string>();
    const [listBlockMargin, setListBlockMargin] = useState<number>(0);
    const [focusIndex, setFocusIndex] = useState<number | null>(0);

    useEffect(() => {
        (async function getCameraPermission() {
            const { status, canAskAgain } = await BarCodeScanner.requestPermissionsAsync();
            if (status === "granted") { setCameraGranted(status === "granted"); }
            else if (canAskAgain) { console.log("Permission denied... Ask again.") }
            else { console.log("Permission denied forever... Can't ask again.") }
        })()
    }, []);

    async function handleBarCodeScanned({ data }: { data: string }) {
        console.log('Hanldling scan')
        setScanData(data);
        console.log(`Data: ${data}`);
        const barcodedata = await searchByBarcode(parseInt(data));
        const name = barcodedata.title;
        const itemsClone = JSON.parse(JSON.stringify(items))
        if (focusIndex) itemsClone[focusIndex].name = name
        console.log("name,", name)
        console.log(itemsClone)
        setItems(itemsClone)
        setListBlockMargin(50)
    };

    const marked = useMemo(() => {
        if (selectedDateStr !== "") {
            return {
                [selectedDateStr]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: 'orange',
                    selectedTextColor: 'red',
                }
            }
        }
    }, [selectedDateStr]);

    //Check if all items name are not blank
    function isValid(): boolean {
        console.log("Checking validation.---")
        const someEmpty = items.some(item => item.name === "");
        //Update error message if there is any empty input
        if (someEmpty) {
            const currItems = [...items]
                .map((item, index) => {
                    if (item.name === "") {
                        setFocusIndex(index)
                        item.error = "required"
                    }
                    return item
                });
            //Update items array state
            setItems(currItems)
        }
        console.log("There is an empty field", someEmpty);
        console.log("Sooooo, is it valid?", !someEmpty);
        return !someEmpty;
    }

    const handleSubmit = (): void => {
        console.log("Handling submit")
        //Checks validation. If not validate, gets out from this block.
        if (!isValid() || !currentKitchen) return

        //POST request to add all items to the server.
        Promise.all(items.map(item => createFood(currentKitchen.id, { name: item.name, bought_on: item.boughtOn })))
            .then((res) => {
                const preparedFoodList = res.map(response => {
                    return {
                        ...response.food,
                        bought_on: new Date(response.food.bought_on),
                        updated_on: new Date(response.food.updated_on)
                    }
                })
                setCurrentFoodList(currentFoodList.concat(preparedFoodList));
            })
            .catch((e) => { console.error(e) })
            .finally(() => navigation.navigate("Kitchen Details")); //Currently not using, but will be implemented
    }

    function formatItems(value: string | boolean, index: number, key: string) {
        console.log("Formatting items");
        console.log(`value: ${value}, index: ${index}, key: ${key}`);
        let newItems = JSON.parse(JSON.stringify(items));
        if (key === "boughtOn" && typeof value === "string") {
            /**This is probably causing a problem with the boughtOn date formating in the Calendar component.
             * Currently it is patched with alternative not ideal operation.*/
            newItems[index][key] = new Date(value);
            newItems[index].showCalendar = false;
        }
        else {
            newItems[index][key] = value;
            if (key === "showCalendar") { setSelectedDateStr(initialDateStr) }
        }
        console.log(newItems)
        setItems(newItems)
    }

    return (
        <View style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                {/**Block 1 */}
                <View style={styles.block1_headline}>
                    <Text style={styles.headlineText}>Add New Item</Text>
                    <Text style={[styles.headlineText, { marginVertical: 10, color: "green" }]}>Press <MaterialCommunityIcons name='barcode-scan' size={15} /> button to scan barcode </Text>
                </View>
                {/**Block 2 */}
                {scanData &&
                    <Pressable style={styles.buttonScanNext} onPress={() => {
                        setScanData(undefined)
                        isValid() && setItems([blankItem, ...items])
                    }} ><Text style={styles.buttonText}>Scan next?</Text></Pressable>}
                {useScanner && cameraGranted && (
                    <View style={styles.block2_scanner}>
                        <BarCodeScanner
                            style={styles.block2_scanner}
                            onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
                        />

                    </View>)}
                {!cameraGranted && (
                    <View>
                        <Text>Please grant camera permissions to Bite Buddy.</Text>
                        <StatusBar style="auto" />
                    </View>)
                }
                <Pressable
                    style={styles.button}
                    onPress={() => { setItems([blankItem, ...items]) }} >
                    <Text style={styles.buttonText}>
                        <MaterialCommunityIcons name="form-textbox" size={15} color="black" /> Insert Another Entry</Text>
                </Pressable>
                <View style={{ marginTop: listBlockMargin /**Need this here to change it dynamically */ }}>
                    {items.map((item, index) => {
                        return (
                            <View style={[styles.formBox, { borderWidth: index === focusIndex ? 5 : 1 }]} key={`addFoodItem${index}`}>
                                <Text style={styles.verticallySpaced}>{`Name ${item.error && item.error}`}</Text>
                                <View style={styles.namefield}>
                                    <TextInput style={styles.userInput}
                                        onFocus={() => setFocusIndex(index)}
                                        placeholder={"Type here, or scan barcode."}
                                        value={item.name}
                                        onChangeText={(value) => formatItems(value, index, "name")} />
                                    <View style={{ marginHorizontal: 20, paddingLeft: 10 }}>
                                        <Pressable style={{ alignItems: 'center' }} onPress={() => setUseScanner(!useScanner)}>
                                            <Text><MaterialCommunityIcons name='barcode-scan' size={25} /></Text>
                                            <Text>scan</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <Text style={styles.verticallySpaced}>Bought on</Text>
                                <Pressable style={styles.userInput}
                                    onPress={() => {
                                        formatItems(true, index, "showCalendar");
                                        setFocusIndex(index);
                                    }}
                                    onBlur={() => { formatItems(false, index, "showCalendar") }}>
                                    <Text >{dateToSrting(new Date(item.boughtOn))/**This is a temporary solution */}</Text>
                                </Pressable >
                                {item.showCalendar && <Calendar
                                    enableSwipeMonths
                                    current={initialDateStr}
                                    style={styles.calendar}
                                    onDayPress={(day) => { formatItems(day.dateString, index, "boughtOn") }}
                                    markedDates={marked}
                                />}
                            </View>
                        )
                    })}
                </View>
                {/**block 4*/}
                <View style={styles.block4_buttonBlock}>
                    <View style={styles.buttons}>
                        <Pressable style={styles.button} onPress={handleSubmit} >
                            <Text style={[styles.buttonText, { maxWidth: 200 }]} ellipsizeMode="tail" numberOfLines={1}>Add to {currentKitchen?.name}</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={() => navigation.navigate("Kitchen Details")} >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        flexGrow: 2,
        marginTop: 0, //might not need this
        padding: 10,//might not need this
        marginBottom: 0,//might not need this
    },
    block1_headline: {
        flex: 1,
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    headlineText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    block2_scanner: {
        height: 250,
    },
    block3_listContainer: {
    },
    block4_buttonBlock: {
    },
    verticallySpaced: {
        alignSelf: "stretch",
    },
    scanner: {
        width: '100%'
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
        flex: 1,
        height: 40,
        marginBottom: 15,
        padding: 5,
        borderColor: "lightgray",
        borderWidth: 1,
    },
    namefield: {
        flexDirection: 'row',
    },
    more: {
        margin: 10
    },
    calendar: {
        marginBottom: 10,
    },
    text: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'lightgrey',
        fontSize: 16,
    },
    buttons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    button: {
        backgroundColor: '#EFCA46',
        height: 40,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    buttonScanNext: {
        backgroundColor: '#EFCA46',
        height: 40,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    buttonText: {
        fontWeight: "bold",
        textAlignVertical: "center",
    },

    /**Copied below from the other component, not sure the intention */
    // mt20: {
    //   marginTop: 20,
    // },
})
