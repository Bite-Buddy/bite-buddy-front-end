import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { invitesAtom } from "../utilities/store/atoms";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { getByDatabaseID, getKitchenByID } from "../utilities/fetchRequests";
import { useState, useEffect } from "react";

export default function ReceivedInvites() {
    const [invites, setInvites] = useAtom(invitesAtom)
    const [inviteNames, setInviteNames] = useState<string[]>([]);

    const fetchFoodNames = async () => {
      try {
        if (invites) {
            let kitchenIds = invites.map((invite => invite.kitchen_id))
            let kitchenInfo = kitchenIds.map((id => getKitchenByID(id)))
            let kitchenNames = await Promise.all(kitchenInfo.map(async (kitchen) => {
              return (await kitchen).name
            }));
            setInviteNames(kitchenNames)
          }
        }
      catch (error){ 
        console.log(error);
        throw error;
      }
    }


    return (
        <View style={styles.container}>
          <View style={styles.verticallySpaced}>
            <Text>Received Invites</Text>
          </View>
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: '#F8E8AF',
      padding: 20,
      margin: 0,
  
    },
    verticallySpaced: {
      flex: 1,
      borderWidth: 0,
      borderRadius: 20,
      marginBottom: 20,
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
      marginTop: 10,
      marginBottom: 0,
      flex: 1,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center',
    },
    name: {
      padding: 2,
      fontSize: 15,
      fontWeight: "bold",
      marginTop: 5,
      marginLeft: 10,
    },
    date: {
      padding: 0,
      fontSize: 15,
      marginTop: 10,
      marginLeft: 30,
      marginRight: 10
    },
    list: {
      flexDirection: "row",
      backgroundColor: '#EFCA46',
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
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: '#4dd377',
      width: 50,
      height: 50,
      justifyContent: "center",
      borderRadius: 50,
      marginTop: 20
    },
    icon: {
      fontSize: 36
    }
  })