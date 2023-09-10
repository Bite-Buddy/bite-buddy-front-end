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
                  <Pressable style={styles.list} key={`foodItem${foodItem.id}`}>
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
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
