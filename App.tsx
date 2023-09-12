import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { supabase } from "./supabaseService";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Auth, Account, Kitchen, Profile, List, AddFood, AddKitchen } from "./screens/screens";
import Header from "./header/Header";
import { createUser, getBySupabaseID, getUsers } from "./utilities/fetchRequests";
import { useAtom } from 'jotai'
import { userAtom } from './utilities/store/atoms'
import { kitchensAtom } from "./utilities/store/atoms";
import { IUser } from "./utilities/interfaces";
import Drawer from "./screens/Drawer";
import EditFood from "./screens/EditFood";

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
            headerTitle: () => <Header />,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },
          })}  />
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Account" component={Account} options={({ navigation }) => ({
            headerTitle: () => <Header />,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },

          })} />
          <Stack.Screen name="Kitchen" component={Kitchen} options={({ navigation }) => ({
            headerTitle: () => <Header />,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },

          })} />
          <Stack.Screen name="Profile" component={Profile} options={({ navigation }) => ({
            headerTitle: () => <Header />,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },

          })} />
          <Stack.Screen name="List" component={List} options={({ navigation }) => ({
            headerTitle: () => <Header />,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },

          })} />
          <Stack.Screen name="AddFood" component={AddFood} options={({ navigation }) => ({
            headerTitle: () => <Header />,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },

          })} />

          <Stack.Screen name="AddKitchen" component={AddKitchen} options={({ navigation }) => ({
            headerTitle: () => <Header />,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },

          })} />
          <Stack.Screen name="Edit Food" component={EditFood} options={({ navigation }) => ({
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