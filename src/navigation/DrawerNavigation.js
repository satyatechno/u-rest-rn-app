import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from 'src/screens/home/Home';
import ServiceList from 'src/screens/serviceList/ServiceList';
import BookingList from 'src/screens/bookingList/BookingList';
import DrawerComponent from 'src/components/drawerComponent/DrawerComponent';
import {DEVICE_WIDTH} from 'src/helper/helper';
import Profile from 'src/screens/profile/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Cart from 'src/screens/cart/Cart';
import NotificationScreen from 'src/screens/notification/NotificationScreen';
import HelpSupport from 'src/screens/helpSupport/HelpSupport';
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const ServiceStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ServiceList" component={ServiceList} />
    </Stack.Navigator>
  );
};
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: DEVICE_WIDTH,
        },
      }}
      drawerContent={props => <DrawerComponent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="ServiceStack" component={ServiceStack} />
      <Drawer.Screen name="NotificationScreen" component={NotificationScreen} />
      <Drawer.Screen name="BookingList" component={BookingList} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="HelpSupport" component={HelpSupport} />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
