/**Please make sure you add DEVURI in your .env.local file.
 * It should look like this:
DEVURI=exp://<your local IPv4 address>:8081/
 * replace <your local IPv4 address> to your acrtual IP address.
*/
import React, { useState } from "react";
import { Alert, StyleSheet, View, Image, Text, Pressable } from "react-native";
import { Button, Input } from "react-native-elements";
import { supabase } from "../supabaseService";
import { Provider, Session } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
// import * as Linking from "expo-linking";
import { createUser, getBySupabaseID } from "../utilities/fetchRequests";
import { userAtom, kitchensAtom, currentKitchenAtom, currentFoodListAtom, invitesAtom } from "../utilities/store/atoms";
import { useAtom } from "jotai";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [kitchens, setKitchens] = useAtom(kitchensAtom);
  const [invites, setInvites] = useAtom(invitesAtom);
  const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom)
  const navigation = useNavigation();

  // async function signInWithEmail() {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email: email,
  //     password: password,
  //   })

  //   if (error) Alert.alert(error.message)

  //   setLoading(false);
  //   console.log("USER ON SIGN IN, SUPABASE ID: ", (await supabase.auth.getSession()).data.session?.user.id);
  // }

  // async function signUpWithEmail() {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signUp({
  //     email: email,
  //     password: password,
  //   })

  //   if (error) Alert.alert(error.message)
  //   setLoading(false);
  // }

  //this long ass mess is a workaround for supabase.auth.signInWithOauth
  // which doesn't seem to want to store the session tokens etc
  async function authenticate(provider: Provider) {
    try {
      const supabase_url = "https://qlpmqnbgyofvhqyhxvhi.supabase.co";
      const redirectUri = process.env.FRONTEND_URL;
      const response = await WebBrowser.openAuthSessionAsync(
        `${supabase_url}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUri}`,
        redirectUri
      );

      if (response.type === "success") {
        const url = response.url;
        const params = url.split("#")[1];
        const accessToken = params.split("&")[0].split("=")[1];
        const refreshToken = params.split("&")[2].split("=")[1];

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) Alert.alert(error.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      console.log("FINISHED AUTHENTICATION");
    }
  }
  async function logInWithThirdParty(provider: Provider) {
    setLoading(true);
    await authenticate(provider);

    const session = (await supabase.auth.getSession()).data.session;
    const supabaseUser = await (await supabase.auth.getUser()).data.user;
    const dbData = await getBySupabaseID(supabaseUser.id);
    if (dbData.failed) {
      const newUser = await createUser(supabaseUser?.id, supabaseUser?.email);
      if (newUser) {
        newUser.kitchens = []
        setUser(newUser);
        setKitchens(newUser.kitchens);
        setLoading(false);
        if (dbData.kitchens.length > 0) {
          setCurrentKitchen(dbData.kitchens[0])
          navigation.navigate("Kitchen Settings", { screen: 'Kitchen ' });
        }
        else {
          navigation.navigate("Account");
        }
      }
    }
    else {
      setUser(dbData);
      setKitchens(dbData.kitchens);
      setInvites(dbData.invites)
      setLoading(false);
      if (user.kitchens.length > 0) {
        navigation.navigate("Kitchen");
      }
      else {
        navigation.navigate("Account")
      }
    }
    // if (user.id > 0) navigation.navigate("Account");

    // if (dbData.failed) {
    //   console.log("Supabase ID", supabaseUser.id);
    //   console.log("DATBASE DATA", dbData);
    //   try {
    //     const newUser = await createUser(supabaseId, session.user.email);
    //     if (newUser) {
    //       setUser(newUser);
    //       setKitchens(newUser.kitchens);
    //       console.log("THE NEW USER", newUser);
    //     }
    //   }
    //   catch (error) {
    //     console.error(error);
    //     throw error;
    //   }
    // }
    // else {
    //   try {
    //     setUser(dbData);
    //     console.log(dbData);
    //     console.log(user);
    //   }
    //   catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    //   finally {
    //     console.log("final user", user);
    //   }
    // }
    // if (user.id > 0) navigation.navigate("Account");
    // setLoading(false);

  }

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <View style={styles.authTop}>
          <Text style={styles.welcome}>Welcome to</Text>
          <Image style={styles.logoH} source={require('../assets/header.png')}/>
          <Image style={styles.groceries} source={require('../assets/groceries.png')}/>
          <Pressable style={styles.button} disabled={loading} onPress={() => logInWithThirdParty("google")}><Text style={styles.buttonText}><Image style={styles.google} source={require('../assets/google.png')}/>    Login with Google</Text></Pressable>
        </View>
        <View style={styles.authBottom}>
              <Text style={styles.slogan}>Manage food in {"\n"}your 
                <Text style={styles.highlight}> kitchen</Text>
              </Text>
             
              <Text style={styles.small}>share your kitchen with any buddy</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
    // marginTop: 40,
    // padding: 12,
  },
  google: {
    
  },
  slogan: {
    fontSize: 30,
    color: '#1D1D1D',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  highlight: {
    fontSize: 30,
    color: '#FFD43A',
    fontWeight: 'bold',
  },
  small: {
    fontSize: 18,
    color: "#767676"
  },
  welcome: {
    fontSize: 20,
    marginBottom: 20
  },
  logoH: {
    marginBottom: 30,
  },
  verticallySpaced: {
    // paddingTop: 4,
    // paddingBottom: 4,
    alignSelf: 'stretch',
  },
  authTop: {
    backgroundColor: '#FFD43A',
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    // flex: 1,
  },
  groceries: {
    marginLeft: 100,
    marginBottom: 50,
  },
  authBottom: {
    backgroundColor: '#FFF',
    padding: 30,
    alignItems: 'center'
    // flex: 1,
  },
  button: {
    // width: 300,
    backgroundColor: "#4285F4",
    paddingTop: 12,
    paddingBottom: 18,
    paddingHorizontal: 30,
    borderRadius: 6
  },
  buttonText: {
    color: 'white',
    fontSize: 19,
  },
  mt20: {
    // marginTop: 20,
  },
})
