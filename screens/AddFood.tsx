import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useAtom, useAtomValue } from 'jotai';
import { currentFoodListAtom, currentKitchenAtom } from '../utilities/store/atoms';
import { createFood, searchByBarcode } from '../utilities/fetchRequests';
import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from "expo-barcode-scanner";
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
    const [cameraGranted, setCameraGranted] = useState<boolean>(false);
    const [useScanner, setUseScanner] = useState<boolean>(false);
    const [scanData, setScanData] = useState<string>();
    const [focusIndex, setFocusIndex] = useState<number | null>(0);
    const [scanNextStr, setScanNextStr] = useState<string>("")
    const [showScanNextModal, setShowScanNextModal] = useState<boolean>(false);

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
        setScanData(data);//Scanned raw serial number
        const barcodedata = await searchByBarcode(data.toString());//Get fetch request to the barcode database API
        const name = barcodedata.title;//Product's name | undefined
        if (name) {
            const itemsClone = JSON.parse(JSON.stringify(items))
            if (focusIndex !== null) { }
            console.log("name,", name)
            setItems(itemsClone)
        }
        else { }
        // setListBlockMargin(50)
    };

    function handleScanNext() {
        setScanData(undefined)
        isValid() && setItems([blankItem, ...items])
    }

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
        }
        console.log(newItems)
        setItems(newItems)
    }

    return (
        <View style={styles.root}>
            {/**Block 1 */}
            <View style={[styles.block1_headline, { backgroundColor: "pink", }]}>
                <Text style={styles.headlineText}>Add New Item</Text>
                <Text style={[styles.headlineText, { marginVertical: 10, color: "green" }]}>
                    Press <MaterialCommunityIcons name='barcode-scan' size={15} /> button to scan barcode
                </Text>
            </View>
            {/**Block 2 */}
            <Modal
                animationType="none"
                transparent={true}
                visible={showScanNextModal}
                onRequestClose={() => setShowScanNextModal(false)}>
                <View style={styles.modalWindow}>
                    <View style={styles.modalView}>
                        <Text style={styles.headlineText}>{scanNextStr}</Text>
                        <View style={styles.buttons}>
                            <Pressable style={[styles.button, { backgroundColor: "yellow" }]}>
                                <Text style={[styles.buttonText, { color: "white" }]}>
                                    Yes<MaterialCommunityIcons name="delete-alert-outline" size={20} /></Text></Pressable>
                            <Pressable style={[styles.button, { backgroundColor: "gray" }]} onPress={() => { setShowScanNextModal(false) }}>
                                <Text style={[styles.buttonText, { color: "white" }]}>
                                    Cancel</Text></Pressable>

                        </View>
                    </View>
                </View>
            </Modal >
            {useScanner && cameraGranted && (
                <View style={styles.block2_scanner}>
                    {scanData &&
                        <Pressable style={styles.buttonScanNext} onPress={() => handleScanNext} >
                            <Text style={styles.buttonText}>Scan next?</Text>
                        </Pressable>}
                    <BarCodeScanner
                        style={styles.scanner}
                        onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
                    />
                </View>)}
            {!cameraGranted && (
                <View style={styles.block2_scanner}>
                    <Text>Please grant camera permissions to Bite Buddy.</Text>
                    <StatusBar style="auto" />
                </View>)}
            <View>
                <Pressable
                    style={[styles.button, { backgroundColor: "gray", borderColor: "gray", borderWidth: 0.5 }]}
                    onPress={() => { setItems([blankItem, ...items]) }} >
                    <Text style={[styles.buttonText, { color: "white" }]}>
                        <MaterialCommunityIcons name="form-textbox" size={15} /> Insert Another Entry</Text>
                </Pressable>
            </View>
            <ScrollView style={styles.scrollBlok}>
                <View>
                    {items.map((item, index) => {
                        return (
                            <View style={[
                                styles.formBox,
                                { borderWidth: index === focusIndex ? 5 : 1 },
                                { borderColor: index === focusIndex ? "darkred" : "darkgray" }]}
                                key={`addFoodItem${index}`}>
                                <Text style={styles.verticallySpaced}>{`Name ${item.error && item.error}`}</Text>
                                <View style={styles.namefield}>
                                    <TextInput style={styles.userInput}
                                        onFocus={() => {
                                            setFocusIndex(index)
                                            setUseScanner(false)
                                        }}
                                        placeholder={"Type here, or scan barcode."}
                                        value={item.name}
                                        onChangeText={(value) => formatItems(value, index, "name")} />
                                    <View style={{ marginHorizontal: 20, paddingLeft: 10 }}>
                                        <Pressable style={{ alignItems: 'center' }}
                                            onPress={() => {
                                                setFocusIndex(index)
                                                setUseScanner(true)
                                            }}>
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
                                />}
                            </View>
                        )
                    })}
                </View>
            </ScrollView >
            {/**block 4*/}
            <View style={styles.block4_buttonBlock}>
                <View style={styles.buttons}>
                    <Pressable style={styles.button} onPress={handleSubmit} >
                        <Text style={[styles.buttonText, { maxWidth: 200 }]} ellipsizeMode="tail" numberOfLines={1}>Add to {currentKitchen?.name}</Text>
                    </Pressable>
                    <Pressable style={[styles.button, { backgroundColor: "lightgray" }]}
                        onPress={() => navigation.navigate("Kitchen Details")} >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
    },
    block1_headline: {
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
    scrollBlok: {
        flexGrow: 1,
        padding: 10,//might not need this
    },
    block2_scanner: {
        marginVertical: 10,
    },
    scanner: {
        width: '100%',
        height: 200
    },
    modalWindow: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        marginTop: 20,
    },
    modalView: {
        margin: 30,
        backgroundColor: '#ddd',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 2,
        },
    },
    modalText: {
        margin: 10,
        marginBottom: 20,
        fontSize: 17,
        textAlign: "center",
    },
    block3_listContainer: {
    },
    block4_buttonBlock: {
        margin: 20,
        verticalAlign: "middle",
        borderStyle: "dotted",
        borderTopWidth: 1,
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
        flex: 1,
        marginBottom: 15,
        padding: 5,
        borderColor: "lightgray",
        borderWidth: 1,
    },
    namefield: {
        flexDirection: 'row',
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
