import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { Text } from "react-native-elements";
import Profile from './Profile'; 
import Kitchen  from './Kitchen';
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
      <Drawer.Screen name="Kitchen Details" component={Kitchen} options={({ navigation }) => ({
            headerTitle: () => <Text>{`${currentKitchen.name}`}</Text>,
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