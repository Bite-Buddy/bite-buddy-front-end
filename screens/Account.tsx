import { Pressable, StyleSheet, View, Image } from "react-native";
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
      <View style={styles.authTop}>
        <Text style={styles.heading}>Welcome to</Text>
        <Image style={styles.logoH} source={require('../assets/header.png')}/>
        
        </View>
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
    backgroundColor: '#FFF',
    margin: 0,

  },
  authTop: {
    backgroundColor: '#FFD43A',
    alignItems: 'center',
    paddingBottom: 0,
    paddingTop: 80,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    height: 500,
    // flex: 1,
  },
  logoH: {
    alignItems: 'center',
  },
  verticallySpaced: {
  },
  mt20: {
    marginTop: 20,
  },
  kitchen: {
    fontSize: 18,
    fontWeight: "bold"
  },
  heading: {
    fontSize: 20,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#1D1D1D',
    textAlign: 'center',
  },
  name: {
    padding: 2,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 0,
    marginLeft: 10,
    
  },
  date: {
  },
  list: {
    flexDirection: "row",
    backgroundColor: '#FFD43A',
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
    borderWidth: 1,
    height: 50,
    borderRadius: 4,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginHorizontal: 'auto',
    width: 300,
    paddingHorizontal: 20,
  },
})