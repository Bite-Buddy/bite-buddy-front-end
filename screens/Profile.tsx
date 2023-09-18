import { Linking, Pressable, StyleSheet, View, Modal } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabaseService";
import { deleteUserFromDatabase } from "../utilities/fetchRequests";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAtom } from "jotai";
import { userAtom } from "../utilities/store/atoms";
import { useState } from "react";

export default function Profile() {
const [user, setUser] = useAtom(userAtom);
const [modalVisible, setModalVisible] = useState<boolean>(false);
const navigation = useNavigation();

async function signOutHandler() {
  navigation.navigate("Auth");
}
async function deleteHandler() {
  await deleteUserFromDatabase(user.id);
  navigation.navigate("Auth");
}

async function invitesHandler() {
  navigation.navigate("ReceivedInvites")
}

  return (
    <View style={styles.container}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalWindow}>
          <View style={styles.modalView}>
            <Text style={styles.headline}>Your account will be deleted!</Text>
            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
            <View style={styles.buttons}>
              <Pressable style={[styles.button, { backgroundColor: "gray" }]} onPress={() => { setModalVisible(false) }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Cancel</Text></Pressable>
              <Pressable style={[styles.button, { backgroundColor: "#FD5D5D" }]} onPress={() => { deleteHandler() }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Delete</Text></Pressable>

            </View>
          </View>
        </View>
      </Modal >
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
        <Pressable style={styles.buttonD} onPressIn={() => setModalVisible(true)}>
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
    paddingHorizontal: 15,
    backgroundColor: '#FFD43A',
    height: 40,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonText: {
    fontWeight: "bold"
  },
  headline: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 20,
  },
  buttonD: {
    marginHorizontal: 20,
    backgroundColor: '#FD5D5D',
    height: 40,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 180
  },
  modalWindow: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
  },
  modalView: {
    margin: 30,
    backgroundColor: '#ddd',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  modalText: {
    margin: 10,
    marginBottom: 20,
    fontSize: 17,
    textAlign: "center",
  },
})
