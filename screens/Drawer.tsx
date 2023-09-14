import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { Text } from "react-native-elements";
import Profile from './Profile'; 
import Kitchen  from './Kitchen';
import KitchenManagement from './KitchenManagement';
import KitchenDetails from './KitchenDetails';
import KitchenMembers from './KitchenMembers';
import { useAtomValue } from 'jotai'
import { currentKitchenAtom } from '../utilities/store/atoms'




//screens import
// import Home from '../screens/Home';
// import Settings from '../screens/Home';

const Drawer = () => {
  const currentKitchen = useAtomValue(currentKitchenAtom)
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Kitchen Details" component={KitchenDetails} options={({ navigation }) => ({
            headerTitle: () => <Text>{`${currentKitchen ? currentKitchen.name : ""}`}</Text>,
            headerStyle: {
              backgroundColor: '#EFCA46',
            },
          })} />
    <Drawer.Screen name="Members" component={KitchenMembers} options={({ navigation }) => ({
        headerTitle: () => <Text>{`${currentKitchen ? currentKitchen.name : ""} Members`}</Text>,
        headerStyle: {
          backgroundColor: '#EFCA46',
        },
      })} />
    <Drawer.Screen name="Manage" component={KitchenManagement} options={({ navigation }) => ({
        headerTitle: () => <Text>{`Manage ${currentKitchen ? currentKitchen.name : ""}`}</Text>,
        headerStyle: {
          backgroundColor: '#EFCA46',
        },
      })} />
      {/* Drawer Screens here */}
      {/* <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Settings" component={Settings} /> */}
    </Drawer.Navigator>
  );
};

export default Drawer;