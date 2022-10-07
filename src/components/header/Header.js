import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import {store} from 'src/redux/store';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {navigationRef} from 'src/utils/Navigation';
import CustomButton from '../customButton/CustomButton';

const Header = ({
  backButton,
  navigation,
  location,
  notificationButton,
  cart,
}) => {
  const primaryAddress = useSelector(
    state => state?.userReducer?.primaryAddress,
  );
  const notificationCount = useSelector(
    state => state?.userReducer?.notificationCount,
  );
  const cartData = useSelector(state => state?.serviceReducer?.cart);

  return (
    <SafeAreaView style={{backgroundColor: colors.defaultWhite}}>
      <View style={styles.container}>
        <View style={styles.left}>
          {backButton ? (
            <CustomButton
              onPress={() => {
                navigation?.goBack();
              }}>
              <Image
                source={require('src/assets/images/back-arrow.svg')}
                style={{
                  backgroundColor: colors.defaultWhite,
                  height: findSize(38),
                  width: findSize(38),
                }}
              />
            </CustomButton>
          ) : (
            <Pressable
              hitSlop={5}
              onPress={() => {
                navigation.openDrawer();
              }}>
              <Image
                source={require('src/assets/images/hamburger.svg')}
                style={{
                  backgroundColor: colors.defaultWhite,
                  height: findSize(15),
                  width: findSize(33),
                  marginLeft: findSize(5),
                }}
              />
            </Pressable>
          )}
        </View>
        <CustomButton
          onPress={() => {
            navigation?.navigate('AddressList');
          }}
          style={styles.center}>
          {location ? (
            <>
              <Image
                style={styles.location}
                source={require('src/assets/images/location-fill.svg')}
              />
              <Text numberOfLines={1} style={styles.locationText}>
                {primaryAddress !== undefined
                  ? primaryAddress?.address
                  : 'Set Your Address'}
              </Text>
            </>
          ) : null}
        </CustomButton>
        <View style={styles.right}>
          {cart ? (
            <CustomButton
              onPress={() => {
                navigation?.navigate('Cart');
              }}
              style={styles.notification}>
              <Image source={require('src/assets/images/cart.svg')} />
              {cartData?.cart_items?.length ? (
                <View style={styles.bedge}>
                  <Text style={styles.bedgeText}>
                    {cartData?.cart_items?.length}
                  </Text>
                </View>
              ) : null}
            </CustomButton>
          ) : null}
          {notificationButton ? (
            <CustomButton
              onPress={() => {
                navigation?.navigate('NotificationScreen');
              }}
              style={styles.notification}>
              <Image source={require('src/assets/images/notification.svg')} />
              {notificationCount ? (
                <View style={styles.bedge}>
                  <Text style={styles.bedgeText}>{notificationCount}</Text>
                </View>
              ) : null}
            </CustomButton>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.defaultWhite,
    height: findHeight(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: findSize(15),
    justifyContent: 'space-between',
  },
  left: {paddingEnd: findSize(25)},
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingEnd: findSize(1),
  },
  notification: {
    backgroundColor: colors.themeColor,
    borderRadius: findSize(20),
    height: findSize(38),
    width: findSize(38),
    borderWidth: findSize(3),
    borderColor: colors.appGray1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: findSize(4),
  },
  location: {
    height: findHeight(16),
    width: findSize(11),
    tintColor: colors?.themeColor,
    marginHorizontal: 2,
  },
  locationText: {
    color: colors.themeColor,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: findSize(13),
    maxWidth: DEVICE_WIDTH * 0.48,
    marginLeft: 2,
  },
  bedge: {
    color: colors.defaultWhite,
    backgroundColor: colors.appRed,
    height: findSize(17),
    width: findSize(17),
    borderRadius: findSize(9),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -findSize(8),
    end: -findSize(8),
  },
  bedgeText: {
    color: colors.defaultWhite,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: findSize(10),
  },
});
