import { Linking, Pressable, StyleSheet, View } from "react-native";
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

async function invitesHandler() {
  navigation.navigate("ReceivedInvites")
}

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text style={styles.header}>Profile</Text>
        <Pressable style={styles.button} onPressIn={() => invitesHandler()}>
          <Text style={styles.buttonText}>Received Invites</Text>
        </Pressable>
        <Pressable style = {styles.button} onPressIn={() => Linking.openURL("https://sites.google.com/view/bitebuddyprivacy/help")}>
          <Text style={styles.buttonText}>Help Page</Text>
        </Pressable>
        <Pressable style = {styles.button} onPressIn={() => Linking.openURL("https://sites.google.com/view/bitebuddyprivacy/privacy")}>
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </Pressable>
        <Pressable style = {styles.button} onPressIn={() => Linking.openURL("https://sites.google.com/view/bitebuddyprivacy/service")}>
          <Text style={styles.buttonText}>Terms of Service</Text>
        </Pressable>
        <Pressable style = {styles.button} onPressIn={() => Linking.openURL("https://sites.google.com/view/bitebuddyprivacy/contact")}>
          <Text style={styles.buttonText}>Contact</Text>
        </Pressable>
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
    paddingTop: 20,
    padding: 12,
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
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
    marginHorizontal: 20,
    backgroundColor: '#FFD43A',
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
