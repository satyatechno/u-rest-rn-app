import {useFocusEffect} from '@react-navigation/core';
import React, {useCallback, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {getAddressApi} from 'src/api/address';
import {bookingListApi} from 'src/api/serviceBooking';
import {getServicesApi} from 'src/api/services';
import Header from 'src/components/header/Header';
import {findHeight, findSize} from 'src/helper/helper';
import {setBookingData} from 'src/redux/reducers/bookingReducer';
import {setServiceData} from 'src/redux/reducers/serviceReducer';
import {
  setAddressData,
  setManageAddressNavigation,
  setNotificationCount,
} from 'src/redux/reducers/userReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {navigationRef} from 'src/utils/Navigation';
import BannerList from '../../components/banner/BannerList';
import CurrentBooking from './currentBooking/CurrentBooking';
import Services from './services/Services';

const Home = ({navigation}) => {
  const token = useSelector(state => state?.userReducer?.token);
  const skipLogin = useSelector(state => state?.userReducer?.skipLogin);
  const user = useSelector(state => state?.userReducer?.user);
  const serviceData = useSelector(state => state?.serviceReducer?.serviceData);
  const bookingData = useSelector(state => state?.bookingReducer?.bookingData);

  const dispatch = useDispatch();
  const ADDRESS = useMutation(getAddressApi, {
    onSuccess: res => {
      if (res.data?.status) {
        dispatch(setAddressData(res.data?.data?.addresses));
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });
  const SERVICE = useMutation(getServicesApi, {
    onSuccess: res => {
      if (res.data?.status) {
        dispatch(setServiceData(res.data?.data?.service_groups));
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });
  const BOOKINGS = useMutation(bookingListApi, {
    onSuccess: res => {
      if (res.data?.status) {
        dispatch(setBookingData(res.data?.data?.bookings));
        dispatch(setNotificationCount(res.data?.data?.notification_count));
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });

  useEffect(() => {
    if (token && !skipLogin) {
      ADDRESS?.mutate({token: token});
      BOOKINGS?.mutate({token: token});
    }
    SERVICE?.mutate();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (token && !skipLogin) {
        BOOKINGS?.mutate({token: token});
      }
    }, []),
  );
  useEffect(() => {
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        if (token && !skipLogin) {
          BOOKINGS?.mutate({token: token});
        }
        // console.log(
        //   'OneSignal: notification will show in foreground:',
        //   notificationReceivedEvent,
        // );
        let notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);

        // Complete with null means don't show a notification.
        // notificationReceivedEvent.complete(notification);
      },
    );
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:Home', notification);
      navigationRef.current?.navigate('NotificationScreen');
    });
  }, []);
  if (SERVICE.isLoading) {
    return (
      <>
        <Header
          navigation={navigation}
          location={!skipLogin}
          notificationButton={!skipLogin}
          cart={!skipLogin}
        />
        <View style={styles.lodingView}>
          <ActivityIndicator color={colors.themeColor} size={'large'} />
        </View>
      </>
    );
  }
  return (
    <>
      <Header
        navigation={navigation}
        location={!skipLogin}
        notificationButton={!skipLogin}
        cart={!skipLogin}
      />
      <View showsVerticalScrollIndicator={false} style={styles.container}>
        <Text style={styles.text1}>Hello, {user?.name}</Text>
        <Text style={{...styles?.text2, color: colors.defaultBlack}}>
          Find Your{' '}
        </Text>
        <Text style={{...styles?.text2, color: colors.themeColor}}>
          Cleaning Service!
        </Text>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <BannerList />
          <Services data={serviceData} navigation={navigation} />
          {skipLogin ? null : (
            <CurrentBooking data={bookingData} navigation={navigation} />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
    paddingHorizontal: findSize(20),
    paddingVertical: findHeight(10),
  },
  text1: {
    color: colors.appGray,
    fontSize: findSize(12),
    fontFamily: fonts.Montserrat_SemiBold,
  },
  text2: {
    fontSize: findSize(20),
    fontFamily: fonts.Montserrat_Bold,
    marginTop: findHeight(5),
  },
  lodingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
  },
});
