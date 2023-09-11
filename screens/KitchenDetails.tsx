import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useAtomValue } from 'jotai'
import { currentKitchenAtom, currentFoodListAtom } from "../utilities/store/atoms";
import { MaterialCommunityIcons } from '@expo/vector-icons';



export default function KitchenDetails() {
  const today = new Date();
  const navigation = useNavigation();
  const currentKitchen = useAtomValue(currentKitchenAtom);
  const currentFoodList = useAtomValue(currentFoodListAtom);

  return (
    <View style={styles.container}>
        <ScrollView>
          <View>
            <View style={styles.verticallySpaced}>
                   {!currentFoodList.length ? <Text>"No item stored"</Text>
              : currentFoodList.map((foodItem) => {
                //Calculate the day offset of te bought day from today
                const dayOffSet = Math.floor((today.getTime() - foodItem.bought_on.getTime()) / (24 * 60 * 60 * 1000))
                return (
                  <Pressable style={styles.list} key={`foodItem${foodItem.id}`} onPress={() => { handleFoodSelect(foodItem) }} >
                    <Text style={styles.name}>{foodItem.name}</Text>
                    <Text style={styles.date}>Added {dayOffSet} day{dayOffSet > 1 ?? "s"} ago</Text>
                  </Pressable>
                );
              })}
          </View>
        </View>
      </ScrollView>
      <View>
        <Pressable style={styles.button} onPress={() => navigation.navigate('AddFood')}>
          <Text style={styles.text}><MaterialCommunityIcons name="plus" size={30} color="black" /></Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#696666',
    padding: 20,
    margin: 0,

  },
  verticallySpaced: {
    flex: 1,
    // height: 30,
    // backgroundColor: '#EFCA46',
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  heading: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 0,
    flex: 1,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  name: {
    padding: 2,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 10,
  },
  date: {
    padding: 0,
    fontSize: 15,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 10
  },
  list: {
    flexDirection: "row",
    backgroundColor: 'white',
    borderWidth: 0,
    justifyContent: 'space-between',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 50,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  button: {
    color: 'black',
    display: 'flex',
    alignItems: 'center',
  },
  text: {}
})
