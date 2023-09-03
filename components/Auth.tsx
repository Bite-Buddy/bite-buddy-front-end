import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { supabase } from "../supabaseService";
import { Provider } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WebBrowser.WebBrowserResult | null>();

  async function handleThirdPartyRedirect(url: string) {
    let result = await WebBrowser.openBrowserAsync(url);
    setResult(result);
  };

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)

    setLoading(false)
    console.log("USER ON SIGN IN, SUPABASE ID: ", (await supabase.auth.getSession()).data.session?.user.id);
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function logInWithThirdParty(provider: Provider) {
    setLoading(true);
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });

    if (error) Alert.alert(error.message)

    setLoading(false);

    console.log(data);
    await handleThirdPartyRedirect(data.url);
    console.log("LOGIN WITH GOOGLE", (await supabase.auth.getSession()).data.session?.user.id);
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