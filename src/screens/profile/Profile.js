import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useMutation} from 'react-query';
import {useSelector} from 'react-redux';
import {deleteAccountApi, logoutApi} from 'src/api/authentication';
import CustomButton from 'src/components/customButton/CustomButton';
import Header from 'src/components/header/Header';
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  findHeight,
  findSize,
} from 'src/helper/helper';
import {store} from 'src/redux/store';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {navigationRef} from 'src/utils/Navigation';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Profile = ({navigation}) => {
  const user = useSelector(state => state.userReducer?.user);
  const TOKEN = useSelector(state => state.userReducer?.token);
  const primaryAddress = useSelector(
    state => state?.userReducer?.primaryAddress,
  );
  const LOGOUT = useMutation(logoutApi, {
    onSuccess: res => {
      if (res.data?.status) {
        store?.dispatch({type: 'LOGOUT'});
        navigationRef.current?.reset({
          index: 0,
          routes: [{name: 'IntroScreen'}],
        });
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });
  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure, you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Ok',
        onPress: () => {
          LOGOUT.mutate({
            token: TOKEN,
          });
        },
      },
    ]);
  };
  const DELETE_ACCOUNT = useMutation(deleteAccountApi, {
    onSuccess: res => {
      if (res.data?.status) {
        store?.dispatch({type: 'LOGOUT'});
        navigationRef.current?.reset({
          index: 0,
          routes: [{name: 'IntroScreen'}],
        });
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });

  return (
    <>
      <Header
        notificationButton={true}
        location={true}
        navigation={navigation}
        cart={true}
      />
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.profile}>Profile</Text>
          <CustomButton
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure, You want to delete your account?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {},
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      DELETE_ACCOUNT.mutate({
                        token: TOKEN,
                      });
                    },
                  },
                ],
              );
            }}>
            <AntDesign name="delete" color={colors.appRed} size={20} />
          </CustomButton>
        </View>

        <View style={{marginVertical: findHeight(20)}}>
          <Text style={styles.smallText}>Name</Text>
          <Text numberOfLines={1} style={styles.name}>
            {user?.name}
          </Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.smallText}>Mobile Number</Text>

            <Image
              source={require('src/assets/images/check-double.svg')}
              style={{height: findSize(14), width: findSize(24)}}
            />
          </View>
          <Text numberOfLines={1} style={styles.name}>
            {`${user?.country_code} ${user?.mobile}`}
          </Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.smallText}>Location</Text>
            <CustomButton
              onPress={() => navigation?.navigate('AddressList')}
              style={styles.row}>
              <Text
                style={[
                  styles.smallText,
                  {color: colors.themeColor, fontSize: findSize(15)},
                ]}>
                {primaryAddress !== undefined ? 'Change' : 'Add'}
              </Text>
              <View style={styles.iconContainer}>
                <Image
                  source={require('src/assets/images/edit.svg')}
                  style={{height: findSize(9), width: findSize(9)}}
                />
              </View>
            </CustomButton>
          </View>
          <Text numberOfLines={1} style={styles.name}>
            {primaryAddress?.type}
          </Text>
          <Text numberOfLines={1} style={styles.smallText}>
            {primaryAddress?.address}
          </Text>
        </View>
        <CustomButton
          type={1}
          title={'Logout'}
          onPress={() => {
            onLogout();
          }}
        />
      </View>
      <Modal visible={LOGOUT.isLoading} transparent={true}>
        <View style={styles.logoutView}>
          <ActivityIndicator color={colors.themeColor} size={50} />
          <Text style={styles.logout}>Logging out...</Text>
        </View>
      </Modal>
      <Modal visible={DELETE_ACCOUNT.isLoading} transparent={true}>
        <View style={styles.logoutView}>
          <ActivityIndicator color={colors.themeColor} size={50} />
          <Text style={styles.logout}>Deleting...</Text>
        </View>
      </Modal>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: findHeight(10),
  },
  container: {
    backgroundColor: colors.defaultWhite,
    flex: 1,
    padding: findSize(20),
  },
  profile: {
    color: colors.defaultBlack,
    fontSize: findSize(25),
    fontFamily: fonts.Montserrat_SemiBold,
  },
  smallText: {
    color: colors.appGray,
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Regular,
    marginVertical: findHeight(5),
  },
  name: {
    color: colors.defaultBlack,
    fontSize: findSize(17),
    fontFamily: fonts.Montserrat_SemiBold,
    marginVertical: findHeight(5),
  },
  divider: {
    backgroundColor: colors.appGray2,
    height: 1,
    width: '100%',
    marginVertical: findHeight(15),
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    height: findSize(17),
    width: findSize(17),
    backgroundColor: colors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginStart: 5,
  },
  logoutView: {
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: colors.appGray1,
    opacity: 0.7,
  },
  logout: {
    color: colors.themeColor,
    fontSize: findSize(20),
    fontFamily: fonts.Montserrat_Bold,
  },
});
