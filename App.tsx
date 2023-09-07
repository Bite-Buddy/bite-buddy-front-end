import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { supabase } from "./supabaseService";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Auth from "./screens/Auth";
import Account from "./screens/Account";
import Kitchen from "./screens/Kitchen";
import Profile from "./screens/Profile";
import List from "./screens/List";
import Header from "./header/Header";
import AddFood from "./screens/AddFood";
import 'react-native-gesture-handler';
import { getBySupabaseID, getUsers } from "./fetchRequests";

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userDbData, setUserDbData] = useState<Response | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && !userDbData) getBySupabaseID(session.user.id).
      then(result => setUserDbData(result));
      setSessionChecked(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionChecked(true);
    })
  }, [])

  useEffect(() => {
    userDbData && console.log("userDbData has changed: ", userDbData);
    session && console.log("session has changed: ", session.user.email);
  }, [session, userDbData]);

  if (!sessionChecked) {
    // Render a loading screen while authentication check is in progress
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
          
        })}/>
        <Stack.Screen name="Profile" component={Profile} options={({ navigation }) => ({
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },
          
        })}/>
        <Stack.Screen name="List" component={List} options={({ navigation }) => ({
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },
          
        })}/>
        <Stack.Screen name="AddFood" component={AddFood} options={({ navigation }) => ({
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },
          
        })}/>
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}