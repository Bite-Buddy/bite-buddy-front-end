import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { supabase } from "./supabaseService";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Auth, Account, Kitchen, Profile, List, AddFood, AddKitchen } from "./screens/screens";
import Header from "./header/Header";
import { createUser, getBySupabaseID } from "./utilities/fetchRequests";
import { useAtom } from 'jotai'
import { userAtom } from './utilities/store/atoms'
import { kitchensAtom } from "./utilities/store/atoms";
import { IUser } from "./utilities/interfaces";

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [kitchens, setKitchens] = useAtom(kitchensAtom);
  
  useEffect(() => {
    (async () => { //wrapped in IIFE so it invokes immediately
      const session = (await supabase.auth.getSession()).data.session; //iife again
      setSession(session);
      if (session && !user) {
        try {
          const userData = (await getBySupabaseID(session.user.id));
          setUser(userData);
        }
        catch (error) {
          console.error(error);
        }
      }
      setSessionChecked(true);
    })();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionChecked(true);
    });
  }, [])

  useEffect(() => {
    session && console.log("session has changed: ", session.user.email);
  }, [session]);
  useEffect(() => {
    session && console.log("user has changed: ", user);
  }, [user]);

  if (!sessionChecked) {
    // Render a loading screen while authentication check is in progress
    // it's normally too quick to see anyway
    return (
      <NavigationContainer>
        <View>
          <Text>Loading</Text>
        </View>
      </NavigationContainer>
    );
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={session ? "Account" : "Auth"}>
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
          {/* Add more screens as needed */}
        </Stack.Navigator>
      </NavigationContainer>
  )
}