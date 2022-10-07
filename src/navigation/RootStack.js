import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerStack from './DrawerNavigation';
import Welcome from 'src/screens/welcome/Welcome';
import IntroScreen from 'src/screens/introScreen/IntroScreen';
import Register from 'src/screens/auth/register/Register';
import Login from 'src/screens/auth/login/Login';
import OtpVerification from 'src/screens/auth/otpVerification/OtpVerification';
import MapScreen from 'src/screens/address/MapScreen';
import AddressScreen from 'src/screens/address/AddressScreen';
import LoginAlert from 'src/screens/loginAlert/LoginAlert';
import ServiceDetails from 'src/screens/serviceList/serviceDetails/ServiceDetails';
import AddressList from 'src/screens/address/addressList/AddressList';
import BookingDetails from 'src/screens/bookingDetails/BookingDetails';
import BookService from 'src/screens/bookService/BookService';
import CustomWebview from 'src/components/customWebview/CustomWebview';
import {useSelector} from 'react-redux';
import Payment from 'src/screens/payment/Payment';
const Stack = createNativeStackNavigator();
const RootStack = () => {
  const TOKEN = useSelector(state => state?.userReducer?.token);
  const skipLogin = useSelector(state => state?.userReducer?.skipLogin);
  const manageSkipAddress = useSelector(
    state => state?.userReducer?.manageSkipAddress,
  );
  const INTRO = useSelector(state => state?.staticReducer?.introScreen);
  const FIRST_SCREEN = () => {
    if (INTRO) {
      return (
        <>
          <Stack.Screen name="IntroScreen" component={IntroScreen} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
          <Stack.Screen name="DrawerStack" component={DrawerStack} />
          <Stack.Screen name="Welcome" component={Welcome} />
        </>
      );
    } else if (TOKEN && manageSkipAddress) {
      return (
        <>
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
          <Stack.Screen name="IntroScreen" component={IntroScreen} />
          <Stack.Screen name="DrawerStack" component={DrawerStack} />
          <Stack.Screen name="Welcome" component={Welcome} />
        </>
      );
    } else if (TOKEN || skipLogin) {
      return (
        <>
          <Stack.Screen name="DrawerStack" component={DrawerStack} />
          <Stack.Screen name="IntroScreen" component={IntroScreen} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
          <Stack.Screen name="Welcome" component={Welcome} />
        </>
      );
    } else {
      return (
        <>
          <Stack.Screen name="IntroScreen" component={IntroScreen} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
          <Stack.Screen name="DrawerStack" component={DrawerStack} />
        </>
      );
    }
  };
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {FIRST_SCREEN()}
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="LoginAlert" component={LoginAlert} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen name="AddressList" component={AddressList} />
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="BookService" component={BookService} />
      <Stack.Screen name="CustomWebview" component={CustomWebview} />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: true,
          headerTitle: 'Payment',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
