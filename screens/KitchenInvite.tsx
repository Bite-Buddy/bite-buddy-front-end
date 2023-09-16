import { TextInput, Button, ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import React from 'react'
import { Formik, Form, Field, FormikHelpers} from 'formik';
import { IKitchen, IInviteForm } from "../utilities/interfaces";

import { userAtom, kitchensAtom } from '../utilities/store/atoms'
import { useAtom } from 'jotai'

export default function KitchenInvite() {



    const navigation = useNavigation();

    async function handleSubmit() {
        console.log("submitted")
    }
    return (
        <Formik
            initialValues={{
                selected_kitchen: '',
                recipient_email: '',
            }}
            onSubmit={(values: IInviteForm) => {
                console.log(values)
            }}> 
            {({handleChange, handleSubmit, values}) => (
        <View style={styles.container}>
        <View style={styles.verticallySpaced}>
            <Text>Select a Kitchen:</Text>
        </View>
        <View>
            <Text>Enter the email of the user you want to invite:</Text>
            <TextInput
                onChangeText={handleChange('recipient_email')}
                value={values.recipient_email}
                />
        </View>
        <Button title = "Submit" />
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
    })