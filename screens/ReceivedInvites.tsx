import { Modal, Pressable, StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { invitesAtom, currentInviteAtom, inviteNamesAtom, userAtom } from "../utilities/store/atoms";
import { useAtom } from "jotai";
import { useNavigation } from "@react-navigation/native";
import { getByDatabaseID, getInviteById, getKitchenByID } from "../utilities/fetchRequests";
import { useState, useEffect } from "react";
import { IInvite, IReceivedInvite } from "../utilities/interfaces";

export default function ReceivedInvites() {
    const [invites, setInvites] = useAtom(invitesAtom)
    const [inviteNames, setInviteNames] = useAtom(inviteNamesAtom);
    const [refreshing, setRefreshing] = useState(false);
    const [currentInvite, setCurrentInvite] = useAtom(currentInviteAtom);
    const [user, setUser] = useAtom(userAtom)
    const navigation = useNavigation();


    useEffect(() => {
      if (invites) {
        fetchKitchenNames()
      }
    }, [invites])

    const fetchNewInvites = async () => {
      const userInfo = await getByDatabaseID(user.id);
      const userInvites = userInfo.invites;
      setInvites(userInvites)
      setRefreshing(false)
    }

    const fetchKitchenNames = async () => {
      try {
        if (invites) {
          const inviteIds = invites.map((invite) => invite.id);
          const kitchenIds = invites.map((invite) => invite.kitchen_id);
          const kitchenInfo = await Promise.all(
            kitchenIds.map(async (id) => {
              const kitchen = await getKitchenByID(id);
              return {
                name: kitchen.name,
                kitchen_id: kitchen.id,
              };
            })
          );
          
          const receivedInvites = invites.map((invite, index) => ({
            id: inviteIds[index],
            kitchen_id: kitchenIds[index],
            name: kitchenInfo[index].name,
          }));
            setInviteNames(receivedInvites)
          }
        }
      catch (error){ 
        console.log(error);
        throw error;
      }
    }

    async function handleRefresh() {
      setRefreshing(true)
      await fetchNewInvites();
    }

    function selectInvite(invite: IInvite) {
      navigation.navigate("InviteResponse")
      setCurrentInvite(invite);
    }


    return (
      <View style={styles.container}>
        <View style={styles.verticallySpaced}>
          <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>  
          <Text style={styles.header}>Received Invites</Text>
            <View>
              <View>
                {inviteNames.map(invite => {
                return (
                  <Pressable key={`selectableInvite${invite.id}`} style={styles.list} onPress={async () => selectInvite(await getInviteById(invite.id))}>
                    <Text style={styles.kitchen}>
                      You've been invited to {invite.name}
                    </Text>
                  </Pressable>
                )})}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 0,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
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
    backgroundColor: '#FFD43A',
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