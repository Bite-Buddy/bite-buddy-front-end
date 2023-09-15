import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function KitchenInvite() {
const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>
        <Text>Kitchen Invite</Text>
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