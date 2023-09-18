import { Modal, Pressable, StyleSheet, ScrollView, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { invitesAtom, currentInviteAtom, inviteNamesAtom } from "../utilities/store/atoms";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { acceptInvite, deleteInvite } from "../utilities/fetchRequests";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IInvite, IReceivedInvite } from "../utilities/interfaces";
import ReceivedInvites from "./ReceivedInvites";

export default function InviteResponse() {
    const [currentInvite, setCurrentInvite] = useAtom(currentInviteAtom);
    const [inviteNames, setInviteNames] = useAtom(inviteNamesAtom); 
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    async function handleAccept(id: number) {
        await acceptInvite(id);
        alert("Invite accepted!")
        navigation.navigate(ReceivedInvites);
        
    }

    async function handleReject(id: number) {
        await deleteInvite(id)
        alert("Invite rejected!")
        navigation.navigate(ReceivedInvites);
    }

    function getName() {
        if (currentInvite) {
            const currentKitchen = inviteNames.filter((invite) => invite.id === currentInvite.id)
            return currentKitchen[0].name;
        }
    }

    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalWindow}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to reject this invite?</Text>
            <View style={styles.buttons}>
              <Pressable style={[styles.button, { backgroundColor: "gray" }]} onPress={() => { setModalVisible(false) }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Cancel</Text></Pressable>
              <Pressable style={[styles.button, { backgroundColor: "#FD5D5D" }]} onPress={() => { handleReject(currentInvite.id) }}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Delete<MaterialCommunityIcons name="delete-alert-outline" size={20} /></Text></Pressable>

            </View>
          </View>
        </View>
      </Modal >
        <View style={styles.verticallySpaced}>
        <Text>Accept invite to {getName()}?</Text>
        <Pressable style={styles.button} onPressIn={() => handleAccept(currentInvite.id)}>
          <Text style={styles.buttonText}>Accept Invite</Text>
        </Pressable>
        <Pressable style={styles.button} onPressIn={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Reject Invite</Text>
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
        button: {
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