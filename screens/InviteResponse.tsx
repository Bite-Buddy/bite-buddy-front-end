import { Modal, Pressable, StyleSheet, ScrollView, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { invitesAtom, currentInviteAtom } from "../utilities/store/atoms";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { acceptInvite, deleteInvite } from "../utilities/fetchRequests";
import { useState, useEffect } from "react";
import { IInvite, IReceivedInvite } from "../utilities/interfaces";

export default function InviteResponse() {
    const [currentInvite, setCurrentInvite] = useAtom(currentInviteAtom);
    console.log(currentInvite)

    async function handleAccept(id: number) {
        return await acceptInvite(id)
    }

    async function handleReject(id: number) {
        return await deleteInvite(id)
    }

    const navigation = useNavigation();
    return (
        <View style={styles.container}>
        <View style={styles.verticallySpaced}>
            <Text>Kitchen Members</Text>
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