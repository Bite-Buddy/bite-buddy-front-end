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
import AddKitchen from './screens/AddKitchen'
import { createUser, getBySupabaseID } from "./fetchRequests";
import { StateProvider } from './store/State';

// import 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [userDbData, setUserDbData] = useState<Response | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  
  const initialState = {
    user: {
      id: null,
      supabase_id: null,
      email: null
    },
    kitchens: []
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeUser':
        return {
          ...state,
          user: action.newUser
        };
      case 'changeKitchens':
        return {
          ...state,
          kitchens: action.newKitchens
        };
      case 'addKitchen':
        return {
          ...state,
          kitchens: [...state.kitchens, action.newKitchen]
        };

      default:
        return state;
    }
  };

  useEffect(() => {
    (async () => { //wrapped in IIFE so it invokes immediately
      const session = (await supabase.auth.getSession()).data.session; //iife again
      setSession(session);
      if (session && !userDbData) {
        try {
          const userData = await getBySupabaseID(session.user.id);
          if (!userData) {
            const newUser = await createUser(session.user.id, session.user.email);
            setUserDbData(newUser);
          }
          else {
            setUserDbData(userData);
          }
        }
        catch(error) {
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
    userDbData && console.log("userDbData has changed: ", userDbData);
  }, [session, userDbData]);

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
    <StateProvider initialState={initialState} reducer={reducer}>

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

        <Stack.Screen name="AddKitchen" component={AddKitchen} options={({ navigation }) => ({
          headerTitle: () => <Header />,
          headerStyle: {
            backgroundColor: '#EFCA46',
          },
          
        })}/>
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
    </StateProvider>
  )
}