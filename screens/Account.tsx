import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { supabase } from "../supabaseService";
import { useNavigation } from "@react-navigation/native";

export default function Account() {
const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text style={styles.heading}>Welcome to BiteBuddy</Text>
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
    backgroundColor: '#696666',
    padding: 20,
    margin: 0,
  },
  verticallySpaced: {
    flex: 1,
    backgroundColor: '#EFCA46',
    borderWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  mt20: {
    marginTop: 20,
  },
  heading: {
    fontSize: 50,
    flex: 0.3,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
   
  }
})