import { Pressable, StyleSheet, View } from "react-native";
import { Text, Input } from "react-native-elements";
import React from 'react'
import { Formik} from 'formik';
import { IInviteForm } from "../utilities/interfaces";
import { currentKitchenAtom, userAtom } from "../utilities/store/atoms";
import { useAtom } from 'jotai'
import { getByEmail, createInvite } from "../utilities/fetchRequests";

export default function KitchenInvite() {
    const [currentKitchen, setCurrentKitchen] = useAtom(currentKitchenAtom)
    const [user, setUser] = useAtom(userAtom);
    return (
        <Formik
            initialValues={{
                recipient_email: '',
            }}
            onSubmit={async (values: IInviteForm) => {
                if (!values.recipient_email) {
                    alert("Error: Please enter an email.");
                }
                else if (values.recipient_email === user.email) {
                    alert("Error: Cannot send invitations to yourself. But you can invite yourself to go and get a glass of water - remember to stay hydrated.")
                }
                else {
                    const valid = await getByEmail(values.recipient_email);
                    if (!valid.failed) {
                        await createInvite(currentKitchen.id, values.recipient_email)
                        alert("Invite sent!")
                    }
                    else {
                        alert("Error: There is no user with this email")
                    }
                }
            }}> 
            {({handleChange, handleSubmit, values}) => (
        <View style={styles.container}>
        <View>
            <Text>Enter the email of the user you want to invite:</Text>
            <Input
                onChangeText={handleChange('recipient_email')}
                value={values.recipient_email}
                />
        </View>
        <Pressable style={styles.button} onPressIn={() => handleSubmit()}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        </View>
            )}
        </Formik>
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
    button: {
        backgroundColor: '#EFCA46',
        height: 40,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
      },
      buttonText: {
        fontWeight: "bold"
      },
    })