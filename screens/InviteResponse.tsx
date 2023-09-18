import { Modal, Pressable, StyleSheet, ScrollView, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { invitesAtom, currentInviteAtom, inviteNamesAtom } from "../utilities/store/atoms";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { acceptInvite, deleteInvite } from "../utilities/fetchRequests";
import { useState, useEffect } from "react";
import { IInvite, IReceivedInvite } from "../utilities/interfaces";
import ReceivedInvites from "./ReceivedInvites";

export default function InviteResponse() {
    const [currentInvite, setCurrentInvite] = useAtom(currentInviteAtom);
    const [inviteNames, setInviteNames] = useAtom(inviteNamesAtom); 

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
        <View style={styles.verticallySpaced}>
        <Text>Accept invite to {getName()}?</Text>
        <Pressable style={styles.button} onPressIn={() => handleAccept(currentInvite.id)}>
          <Text style={styles.buttonText}>Accept Invite</Text>
        </Pressable>
        <Pressable style={styles.button} onPressIn={() => handleReject(currentInvite.id)}>
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