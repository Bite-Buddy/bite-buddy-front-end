import { supabase } from "./supabaseService";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./header/Header";
import { Auth, Account, Profile, List, EditFood, AddFood, AddKitchen, BarcodeScan, InviteResponse, ReceivedInvites } from "./screens/screens";
import Drawer from "./screens/Drawer";
import { createUser, getBySupabaseID, getUsers } from "./utilities/fetchRequests";
import { IUser } from "./utilities/interfaces";
import { userAtom, kitchensAtom } from './utilities/store/atoms'
import { useAtom } from 'jotai'

const Stack = createStackNavigator();

// const { error } = await supabase.auth.signOut() storing this for later

export default function App() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [kitchens, setKitchens] = useAtom(kitchensAtom);
  const [user, setUser] = useAtom(userAtom);
  const [session, setSession] = useState<Session | null>(null);
 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Kitchen Settings" component={Drawer} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },
        })} />
        <Stack.Screen name="Auth" component={Auth} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Text style={styles.auth}>BiteBuddy</Text>,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="Account" component={Account} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="Profile" component={Profile} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="List" component={List} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="AddFood" component={AddFood} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />

        <Stack.Screen name="AddKitchen" component={AddKitchen} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="Edit Food" component={EditFood} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="Barcode Scan" component={BarcodeScan} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="ReceivedInvites" component={ReceivedInvites} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        <Stack.Screen name="InviteResponse" component={InviteResponse} options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => null,
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },

        })} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  auth: {
    fontSize: 26,
    fontWeight: "bold",

  }
})