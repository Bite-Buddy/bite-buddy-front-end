import React, { useState } from "react";
import { Alert, StyleSheet, View, Pressable } from "react-native";
import { Text, Button, Input } from "react-native-elements";
import { supabase } from "../supabaseService";
import { Provider } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
// import * as Linking from "expo-linking";
import { devUrls } from "../utilities/developmentUrls";
import { createUser, getBySupabaseID } from "../utilities/fetchRequests";
import { userAtom, kitchensAtom } from "../utilities/store/atoms";
import { useAtom } from "jotai";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const [kitchens, setKitchens] = useAtom(kitchensAtom);
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
  async function logInWithThirdParty(provider: Provider) {
    setLoading(true);
    // try {
    //   const supabase_url = "https://qlpmqnbgyofvhqyhxvhi.supabase.co";
    //   const redirectUri = devUrls.izaUrl; 
    //   const response = await WebBrowser.openAuthSessionAsync(
    //     `${supabase_url}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUri}`,
    //     redirectUri
    //   );

    //   if (response.type === "success") {
    //     const url = response.url;
    //     const params = url.split("#")[1];
    //     const accessToken = params.split("&")[0].split("=")[1];
    //     const refreshToken = params.split("&")[2].split("=")[1];

    //     const { data, error } = await supabase.auth.setSession({
    //       access_token: accessToken,
    //       refresh_token: refreshToken,
    //     });
    //     if (error) Alert.alert(error.message);
    //   }
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   WebBrowser.maybeCompleteAuthSession();
    // }
    // const sesh = await supabase.auth.getSession();
    if (true) {
      // const supabaseId = sesh.data.session?.user.id;

      const dbData = await getBySupabaseID("5777eeba-1c47-48e6-aae8-c45a44fhd54");
      // if (dbData.failed) {
      //   // console.log("Supabase ID", sesh.data.session?.user.id);
      //   console.log("DATBASE DATA", dbData);
      //   try {
      //     const newUser = await createUser(supabaseId, sesh.data.session?.user.email);
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
          setUser(dbData);
          console.log(dbData)
          setKitchens(dbData.kitchens)
          console.log(dbData.kitchens)
    //     }
    //     catch (error) {
    //       console.log(error);
    //       throw error;
        }
    //   }
    // }
    user.kitchens.length > 0 ? navigation.navigate("Kitchen") : navigation.navigate("Account");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Pressable disabled={loading} style={styles.button} onPress={() => signInWithEmail()} ><Text style={styles.buttonText}>Sign in</Text></Pressable>
      </View>
      <View style={styles.verticallySpaced}>
        <Pressable disabled={loading} style={styles.button} onPress={() => signUpWithEmail()} ><Text style={styles.buttonText}>Sign up</Text></Pressable>
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Google" disabled={loading} onPress={() => logInWithThirdParty("google")} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: '#EFCA46',
    height: 40,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold"
  },
  mt20: {
    marginTop: 20,
  },
})