import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Account from "./components/Account";
import { View } from "react-native";
import { supabase } from "./supabaseService";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(session?.user.email);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> 
      : 
    <Auth />}
    </View>
  )
}