import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAtom, useAtomValue } from 'jotai';
import { currentFoodListAtom, currentKitchenAtom } from '../utilities/store/atoms';
import { createFood, searchByBarcode } from '../utilities/fetchRequests';

type Item = {
    name: string,
    boughtOn: Date,
    error: string,
    showCalendar: boolean,
    focus: boolean
}

function dateToSrting(date: Date) {
    const datestr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return datestr
}

export default function AddFood() {
    const navigation = useNavigation();
    const today = new Date();
    const initialDateStr = dateToSrting(today);
    const blankItem = { name: "", boughtOn: today, error: "", showCalendar: false, focus: true }
    const scanNextMessage = useRef<string>("");
    const currentKitchen = useAtomValue(currentKitchenAtom);
    const [currentFoodList, setCurrentFoodList] = useAtom(currentFoodListAtom);
    const [items, setItems] = useState<Item[]>([blankItem]);
    const [cameraGranted, setCameraGranted] = useState<boolean>(false);
    const [useScanner, setUseScanner] = useState<boolean>(false);
    const [scanData, setScanData] = useState<string>();
    const [focusIndex, setFocusIndex] = useState<number>(0);

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
        const productName = barcodedata.title;//Product's name | undefined
        if (productName) {
            const itemsClone = JSON.parse(JSON.stringify(items))
            itemsClone[focusIndex].name = productName
            itemsClone[focusIndex].error = `Scanned barcode successfully`
            console.log("name,", productName)
            setItems(itemsClone)
            scanNextMessage.current = ""

        }
        else {
            formatItems("Scanned code is not in database", focusIndex, "error")
        }

        // setListBlockMargin(50)
    };

    function handleScanNext() {
        isValid() && setItems([blankItem, ...items])
        setScanData(undefined)
    }

    //Check if all items name are not blank
    function isValid(): boolean {
        console.log("Checking validation.---")
        const someEmpty = items.some((item: { name: string; }) => item.name === "");
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
        Promise.all(items.map((item: Item) => createFood(currentKitchen.id, { name: item.name, bought_on: item.boughtOn })))
            .then((res) => {
                const preparedFoodList = res.map((response: { food: { bought_on: string | number | Date; updated_on: string | number | Date; }; }) => {
                    return {
                        ...response.food,
                        bought_on: new Date(response.food.bought_on),
                        updated_on: new Date(response.food.updated_on)
                    }
                })
                setCurrentFoodList(currentFoodList.concat(preparedFoodList));
            })
            .catch((e) => { console.error(e) })
            .finally(() => navigation.navigate("Kitchen")); //Currently not using, but will be implemented
    }

    function formatItems(value: string | boolean, index: number, key: string) {
        console.log("Formatting items");
        console.log(`value: ${value}, index: ${index}, key: ${key}`);
        let newItems = JSON.parse(JSON.stringify(items));
        if (key === "remove") {
            newItems.splice(index, 1);
        }
        else if (key === "boughtOn" && typeof value === "string") {
            /**This is probably causing a problem with the boughtOn date formating in the Calendar component.
             * Currently it is patched with alternative not ideal operation.*/
            newItems[index][key] = new Date(value);
            newItems[index].showCalendar = false;
        }
        else {
            newItems[index][key] = value;
            if (key === "name" && value !== "") {
                newItems[index].error = ""
            }
        }
        console.log(newItems)
        setItems(newItems)
    }

    return (
        <View style={styles.root}>
            {/**Block 1 */}
            <View style={[styles.block1_headline]}>
                <Text style={styles.headlineText}>Add New Food Item(s)</Text>
            </View>
            {/**Block 2 */}
            {/* {!useScanner && <Text style={[styles.headlineText, { marginVertical: 10, color: "green" }]}>
                Press <MaterialCommunityIcons name='barcode-scan' size={15} /> button to scan barcode
            </Text>} */}
            {useScanner && cameraGranted && (
                <View style={styles.block2_scanner}>
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
                {scanData && useScanner ?
                    <Pressable style={[styles.button, { backgroundColor: "#4F7E17", height: 60 }]} onPress={() => {
                        setScanData(undefined);
                        formatItems("", focusIndex, "error");
                        handleScanNext();
                    }} >
                        <Text style={[styles.buttonText, { color: "white" }]}>
                            {items[focusIndex].error !== "required" && `${items[focusIndex].error}...\n`}
                            <MaterialCommunityIcons name='barcode-scan' size={18} />  Press here to scan next </Text>
                    </Pressable>
                    : <Pressable
                        style={[styles.button, { backgroundColor: "#FFD43A" }]}
                        onPress={() => { setItems([blankItem, ...items]) }} >
                        <Text style={[styles.buttonText, { color: "#1D1D1D" }]}>
                            Add Another Food Item</Text>
                    </Pressable>}
            </View>
            <ScrollView style={styles.scrollBlok}>
                <View>
                    {items.map((item: { error: string | string[]; name: any; boughtOn: string | number | Date; showCalendar: any; }, index: number) => {
                        return (
                            <View style={{ flexDirection: "row" }} key={`addFoodItem${index}`}>
                                <View style={{ flex: 2, alignContent: "center", alignItems: "stretch" }}>
                                    <Pressable style={{ alignItems: 'center', marginVertical: 50/**Don't know how to centerize */ }}
                                        onPress={() => { formatItems("", index, "remove") }}>
                                        <Text style={{ color: "darkred" }}><MaterialCommunityIcons name='text-box-remove' size={25} /></Text>
                                        <Text style={{ color: "darkred" }}>remove</Text>
                                    </Pressable>
                                </View>
                                <View style={[
                                    styles.formBox,
                                    { borderWidth: index === focusIndex ? 5 : 1 },
                                    { borderColor: index === focusIndex ? "#FFD43A" : "darkgray" }]}>
                                    <Text style={styles.verticallySpaced}>Name </Text>
                                    {item.error && <Text style={[styles.verticallySpaced, { color: item.error.includes("success") ? "green" : "red" }]}>{item.error}</Text>}
                                    <View style={styles.namefield}>
                                        <TextInput style={styles.userInput}
                                            textAlign="left"
                                            textAlignVertical="center"
                                            onFocus={() => {
                                                setFocusIndex(index)
                                                setUseScanner(false)
                                                setScanData(undefined)
                                                isValid()
                                            }}
                                            placeholder={"Type here, or scan barcode."}
                                            value={item.name}
                                            onChangeText={(value: string) => formatItems(value, index, "name")} />
                                        <View style={{ marginLeft: 5, paddingLeft: 10 }}>
                                            <Pressable style={{ alignItems: 'center' }}
                                                onPress={() => {
                                                    setFocusIndex(index)
                                                    setUseScanner(index === focusIndex ? !useScanner : true)
                                                }}>
                                                <Text style={{ color: focusIndex === index && useScanner ? "gray" : "#1D1D1D" }}><MaterialCommunityIcons name='barcode-scan' size={25} /></Text>
                                                <Text style={{ color: focusIndex === index && useScanner ? "gray" : "#1D1D1D" }}>
                                                    {focusIndex === index && useScanner ? "disable" : "scan"}</Text>
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
                            </View>)
                    })}
                </View>
            </ScrollView >
            {/**block 4*/}
            < View style={styles.block4_buttonBlock} >
                <View style={styles.buttons}>
                    <Pressable style={styles.button} onPress={handleSubmit} >
                        <Text style={[styles.buttonText, { maxWidth: 200 }]} ellipsizeMode="tail" numberOfLines={1}>Add All to {currentKitchen?.name}</Text>
                    </Pressable>
                    <Pressable style={[styles.button, { backgroundColor: "lightgray" }]}
                        onPress={() => navigation.navigate('Kitchen')} >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </Pressable>
                </View>
            </View >
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
        height: 150
    },
    block3_listContainer: {
    },
    verticallySpaced: {
        alignSelf: "stretch",
    },
    formBox: {
        flex: 8,
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    block4_buttonBlock: {
        margin: 20,
    },
    buttons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    button: {
        backgroundColor: '#FFD43A',
        height: 40,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 15,
        paddingRight: 15,
        marginHorizontal: 20,
    },
    buttonText: {
        fontWeight: "bold",
        textAlignVertical: "center",
        textAlign: "center",
    },
})
