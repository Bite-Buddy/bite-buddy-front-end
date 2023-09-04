import { StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { supabase } from "../supabaseService";
import { useNavigation } from "@react-navigation/native";

export default function Account() {
const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Button 
        title="Sign Out" 
        onPress={() => 
        {supabase.auth.signOut();
        navigation.navigate("Auth")}}
        />
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