import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabaseService";

export default function Profile() {
const navigation = useNavigation();

async function signOutHandler() {
  navigation.navigate("Auth");
}
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text>Profile</Text>
        <Pressable onPressIn={() => signOutHandler()}>
          <Text>Sign Out</Text>
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
