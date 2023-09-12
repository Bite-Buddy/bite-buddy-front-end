/**Please make sure you add DEVURI in your .env.local file.
 * It should look like this:
DEVURI=exp://<your local IPv4 address>:8081/
 * replace <your local IPv4 address> to your acrtual IP address.
*/
/**Please make sure you add DEVURI in your .env.local file.
 * It should look like this:
DEVURI=exp://<your local IPv4 address>:8081/
 * replace <your local IPv4 address> to your acrtual IP address.
*/
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { supabase } from "../supabaseService";
import { Provider, Session } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
// import * as Linking from "expo-linking";
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
  async function authenticate(provider: Provider) {
    try {
      const supabase_url = "https://qlpmqnbgyofvhqyhxvhi.supabase.co";
      const redirectUri = devUrls.danUrl; 
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
        if (user.kitchens.length > 0) {
          navigation.navigate("Kitchen");
        }
        else {
          navigation.navigate("Account");
        }
      }
    }
    else {
      setUser(dbData);
      setKitchens(dbData.kitchens);
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
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
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
  mt20: {
    marginTop: 20,
  },
})