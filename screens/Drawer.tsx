import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { Text } from "react-native-elements";
import { StyleSheet } from 'react-native'
import Profile from './Profile'; 
import KitchenManagement from './KitchenManagement';
import KitchenDetails from './KitchenDetails';
import KitchenMembers from './KitchenMembers';
import KitchenInvite from './KitchenInvite';
import { useAtomValue } from 'jotai'
import { currentKitchenAtom } from '../utilities/store/atoms'
import KitchenSelect from './KitchenSelect';




//screens import
// import Home from '../screens/Home';
// import Settings from '../screens/Home';

const Drawer = () => {
  const currentKitchen = useAtomValue(currentKitchenAtom)
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Kitchen" component={KitchenDetails} options={({ navigation }) => ({
            headerTitle: () => <Text style={styles.drawerHeader}>{`${currentKitchen ? currentKitchen.name : ""}`}</Text>,
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            drawerActiveBackgroundColor: '#F5F5F5',
            drawerActiveTintColor: '#1D1D1D',
            drawerInactiveTintColor: '#1D1D1D',
            drawerLabelStyle: {
              fontSize: 17
            }
          })} />
    
    <Drawer.Screen name="Settings" component={KitchenManagement} options={({ navigation }) => ({
        headerTitle: () => <Text style={styles.drawerHeader} >{`${currentKitchen ? currentKitchen.name : ""} Settings`}</Text>,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        drawerActiveBackgroundColor: '#F5F5F5',
        drawerActiveTintColor: '#1D1D1D',
        drawerInactiveTintColor: '#1D1D1D',
        drawerLabelStyle: {
          fontSize: 17
        }    
      })} />
        <Drawer.Screen name="Invite" component={KitchenInvite} options={({ navigation }) => ({
          headerTitle: () => <Text style={styles.drawerHeader} >{`Invite to ${currentKitchen ? currentKitchen.name : ""}`}</Text>,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          drawerActiveBackgroundColor: '#F5F5F5',
          drawerActiveTintColor: '#1D1D1D',
          drawerInactiveTintColor: '#1D1D1D',
          drawerLabelStyle: {
            fontSize: 17
          }
        })} />
      <Drawer.Screen name="Members" component={KitchenMembers} options={({ navigation }) => ({
        headerTitle: () => <Text style={styles.drawerHeader} >{`${currentKitchen ? currentKitchen.name : ""} Members`}</Text>,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        drawerActiveBackgroundColor: '#F5F5F5',
        drawerActiveTintColor: '#1D1D1D',
        drawerInactiveTintColor: '#1D1D1D',
        drawerLabelStyle: {
          fontSize: 17
        }
      })} />
      <Drawer.Screen name="All Kitchens" component={KitchenSelect} options={({ navigation }) => ({
        headerTitle: () => <Text style={styles.drawerHeader} >All Kitchens</Text>,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        drawerActiveBackgroundColor: '#F5F5F5',
        drawerActiveTintColor: '#1D1D1D',
        drawerInactiveTintColor: '#1D1D1D',
        drawerLabelStyle: {
          fontSize: 17
        }
      })} />
      {/* Drawer Screens here */}
      {/* <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Settings" component={Settings} /> */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#1D1D1D"
  }
})


export default Drawer;