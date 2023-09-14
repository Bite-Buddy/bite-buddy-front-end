import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { supabase } from "../supabaseService";
import { useNavigation } from "@react-navigation/native";

export default function Account() {
  const navigation = useNavigation();
  function createKitchen() {
    navigation.navigate("AddKitchen")
  }

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text style={styles.heading}>Welcome to BiteBuddy</Text>
        <Pressable style={styles.button} onPress={() => createKitchen()} ><Text style={styles.name} >Create a Kitchen</Text></Pressable>
      </View>
    </View>
  )
}

/* <Button 
title="Sign Out" 
onPress={() => 
{supabase.auth.signOut();
navigation.navigate("Auth")}}
/> */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F8E8AF',
    padding: 20,
    margin: 0,

  },
  verticallySpaced: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  kitchen: {
    fontSize: 18,
    fontWeight: "bold"
  },
  heading: {
    fontSize: 40,
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
    marginTop: 0,
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
    backgroundColor: '#EFCA46',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: "center",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 60,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  button: {
    backgroundColor: '#EFCA46',
    height: 40,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 400
  },
})