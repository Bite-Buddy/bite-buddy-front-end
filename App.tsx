import { useState, useEffect } from "react";
import { View } from "react-native";
import { supabase } from "./supabaseService";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from './screens/Auth';
import Account from "./screens/Account";

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log("THE CURRENT USER EMAIL", session?.user.email);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("THE NEW USER EMAIL", session?.user.email);
    })
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Account" component={Account} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}