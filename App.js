import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, Text, View, LogBox, Platform, Linking} from 'react-native';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {getAppDataApi} from 'src/api/authentication';
import TouchPrevent from 'src/components/touchPrevent/TouchPrevent';
import {APP_VERSION, ONE_SIGNAL_APP_ID} from 'src/helper/credentials';
import {DEVICE_WIDTH} from 'src/helper/helper';
import RootStack from 'src/navigation/RootStack';
import {persistor, store} from 'src/redux/store';
import colors from 'src/styles/colors/colors';
import {isReadyRef, navigationRef} from 'src/utils/Navigation';
import DeviceInfo from 'react-native-device-info';
import {showMessage} from 'src/components/messegeModal/MessegeModal';

// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
const toastConfig = {
  success: ({text1, props, ...rest}) => (
    <View
      style={{
        paddingVertical: 5,
        flex: 1,
        minHeight: 60,
        width: '95%',
        backgroundColor: colors.defaultWhite,
        shadowColor: colors.themeColor,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: colors.lightGreen,
        borderLeftWidth: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
      <Text style={{fontSize: 16, flex: 1, color: colors.defaultBlack}}>
        {text1}
      </Text>
      <Text>{props.guid}</Text>
      <Ionicons onPress={() => Toast.hide()} name="close" size={20} />
    </View>
  ),
  error: ({text1, onPress, props, ...rest}) => (
    <View
      style={{
        paddingVertical: 5,
        flex: 1,
        minHeight: 60,
        width: '95%',
        backgroundColor: colors.defaultWhite,
        shadowColor: colors.appRed,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: colors.appRed,
        borderLeftWidth: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
      <Text style={{fontSize: 16, flex: 1, color: colors.defaultBlack}}>
        {text1}
      </Text>
      <Text>{props.guid}</Text>
      <Ionicons onPress={onPress} name="close" size={20} />
    </View>
  ),
  info: ({text1, onPress, props, ...rest}) => (
    <View
      style={{
        paddingVertical: 5,
        flex: 1,
        minHeight: 60,
        width: '95%',
        backgroundColor: colors.defaultWhite,
        shadowColor: colors.error,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: colors.error,
        borderLeftWidth: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
      <Text style={{fontSize: 16, flex: 1, color: colors.defaultBlack}}>
        {text1}
      </Text>
      <Text>{props.guid}</Text>
      <Ionicons onPress={onPress} name="close" size={20} />
    </View>
  ),
  network: ({text1, onPress, props, ...rest}) => (
    <View
      style={{
        paddingVertical: 5,
        flex: 1,
        minHeight: 60,
        width: '95%',
        backgroundColor: colors.defaultWhite,
        shadowColor: colors.appRed,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.34,
        shadowRadius: 4.65,
        elevation: 6,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftColor: colors.appRed,
        borderLeftWidth: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
      }}>
      <Text style={{fontSize: 16}}>{text1}</Text>
      <Text>{props.guid}</Text>
    </View>
  ),
};

export default function App() {
  console.log('App');
  const queryClient = new QueryClient();
  const [showNetwork, setShowNetwork] = useState();
  const setupNotification = () => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(ONE_SIGNAL_APP_ID);

    // Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response:', response);
    });

    if (navigationRef.current?.navigate) {
      OneSignal.setNotificationOpenedHandler(notification => {
        console.log('OneSignal: notification opened:', notification);
        navigationRef.current?.navigate('NotificationScreen');
      });
    }
  };
  useEffect(() => {
    checkAppVersion();
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    setupNotification();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setShowNetwork(true);
      } else {
        setShowNetwork(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  LogBox.ignoreAllLogs();
  const checkAppVersion = async () => {
    try {
      const res = await getAppDataApi();
      if (res.data.status) {
        if (APP_VERSION != res.data.data?.setting?.app_version) {
          showMessage({
            title: 'Update Available',
            message: 'Please update your app.',
            successFn: () => {
              if (Platform.OS == 'ios') {
                Linking.openURL(res.data.data?.setting?.app_store_url);
              } else {
                Linking.openURL(res.data.data?.setting?.play_store_url);
              }
            },
          });
        } else if (res.data.data?.setting?.app_under_maintenance) {
          showMessage({
            title: 'Under Maintenance',
            message:
              'App is in under maintenance, Please come back again after some time.',
          });
        }
      }
    } catch (error) {}
  };
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.defaultWhite}
      />
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                isReadyRef.current = true;
              }}>
              <TouchPrevent>
                {/* <View style={{flex: 1}}> */}
                <RootStack />
                <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
                {showNetwork ? (
                  <View
                    style={{
                      position: 'absolute',
                      height: 50,
                      backgroundColor: 'red',
                      justifyContent: 'center',
                      width: DEVICE_WIDTH,
                    }}>
                    <Text
                      style={{
                        color: colors.defaultWhite,
                        textAlign: 'center',
                      }}>
                      No Internet Connection
                    </Text>
                  </View>
                ) : null}
                {/* </View> */}
              </TouchPrevent>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </>
  );
}
