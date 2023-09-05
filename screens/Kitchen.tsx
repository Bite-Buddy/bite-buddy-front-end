import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Kitchen() {
const navigation = useNavigation();
const foodList = [
{ name: "Milk",
  date: "Added 2 days ago"
}, 
{ name: "Eggs",
  date: "Added 1 day ago"
},
{ name: "Strawberries",
  date: "Added 2 days ago"
}, 
{ name: "Cheese",
  date: "Added 1 day ago"
},
{ name: "Greek Yogurt",
  date: "Added 2 days ago"
}, 
{ name: "Tomatoes",
  date: "Added 1 day ago"
},
{ name: "Ham",
  date: "Added 4 days ago"
}, 
{ name: "Lettuce",
  date: "Added 1 days ago"
},
{ name: "Chicken",
  date: "Added 2 days ago"
}, 
{ name: "Olives",
  date: "Added 14 days ago"
}
]
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text style={styles.heading}>Kitchen</Text>
        <ScrollView>
        <View>
          {foodList.map((foodProduct) => {
            return (
              <View style={styles.list} key={`foodProduct${foodProduct.name}`}>
                <Text style={styles.name}>{foodProduct.name}</Text>
                <Text style={styles.date}>{foodProduct.date}</Text>
                
              </View>
            );
          })}
        </View>
      
      </ScrollView>
      </View>
      <View>
      <Pressable style={styles.button} title="AddFood" onPress={() => navigation.navigate('AddFood')}>
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
    backgroundColor: '#EFCA46',
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


  }

})
