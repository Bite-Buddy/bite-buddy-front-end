import { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Input } from "react-native-elements";
import { supabase } from "../supabaseService";
import { Session } from "@supabase/supabase-js";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)

  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
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