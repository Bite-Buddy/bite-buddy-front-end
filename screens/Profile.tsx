import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabaseService";
import { deleteUserFromDatabase } from "../utilities/fetchRequests";
import { useAtom } from "jotai";
import { userAtom } from "../utilities/store/atoms";

export default function Profile() {
const [user, setUser] = useAtom(userAtom);
const navigation = useNavigation();

async function signOutHandler() {
  navigation.navigate("Auth");
}
async function deleteHandler() {
  await deleteUserFromDatabase(user.id, user.supabase_id);
  navigation.navigate("Auth");
}
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text style={styles.header}>Profile</Text>
        <Pressable style={styles.button} onPressIn={() => signOutHandler()}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
        <Pressable style={styles.button} onPressIn={() => deleteHandler()}>
          <Text style={styles.buttonText}>Delete Account</Text>
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
  header: {
    fontSize: 30
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#EFCA46',
    height: 40,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },
  buttonText: {
    fontWeight: "bold"
  },
})
