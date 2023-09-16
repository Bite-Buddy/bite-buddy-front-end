import { supabase } from "./supabaseService";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./header/Header";
import { Auth, Account, Profile, List, EditFood, AddFood, AddKitchen, BarcodeScan, ReceivedInvites } from "./screens/screens";
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
  // useEffect(() => {
  //   (async () => {
  //     const session = (await supabase.auth.getSession()).data.session;
  //     if (session) {
  //       setSession(session);
  //       const sessionUser = await getSessionUser();
  //       if (sessionUser) {
  //         setUser(sessionUser);
  //         setKitchens(user.kitchens);
  //       }
  //     }
  //     setSessionChecked(true);

  //     // supabase.auth.onAuthStateChange((event, session) => {
  //     //   if (event == 'SIGNED_IN') console.log('SIGNED_IN', session)
  //     // })
  //     // supabase.auth.onAuthStateChange((event, session) => {
  //     //   if (event == 'SIGNED_OUT') console.log('SIGNED_OUT', session)
  //     // })

  //   })()
  // }, [])
  // useEffect(() => {
  //   if (user.id > 0 && sessionChecked) {
  //     console.log("THE USER", user);
  //   }
  // }, [user, sessionChecked])

  // async function getSessionUser() {
  //   try {
  //     const user = await getBySupabaseID(session?.user.id);
  //     return user;
  //   }
  //   catch (error) {
  //     throw error;
  //   }
  // }

  // if (!sessionChecked) {
  //   // Render a loading screen while authentication check is in progress
  //   // it's normally too quick to see anyway
  //   return (
  //     <NavigationContainer>
  //       <View>
  //         <Text>Loading</Text>
  //       </View>
  //     </NavigationContainer>
  //   );
  // }

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
        <Stack.Screen name="Received Invites" component={ReceivedInvites} options={({ navigation }) => ({
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