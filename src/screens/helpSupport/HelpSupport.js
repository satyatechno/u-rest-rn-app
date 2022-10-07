import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useMutation} from 'react-query';
import {useSelector} from 'react-redux';
import {getHelpSupportApi} from 'src/api/address';
import Header from 'src/components/header/Header';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import {findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const HelpSupport = ({navigation}) => {
  const skipLogin = useSelector(state => state?.userReducer?.skipLogin);

  const [data, setData] = useState(null);
  const {mutate, isLoading} = useMutation(getHelpSupportApi, {
    onSuccess: res => {
      if (res.data?.status) {
        console.log('ress help support', res.data);
        setData(res.data.data?.app_setting);
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });
  useEffect(() => {
    mutate();
  }, []);
  if (isLoading) {
    return (
      <>
        <Header backButton={true} navigation={navigation} />
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
      <View
        style={{
          flex: 1,
          backgroundColor: colors.defaultWhite,
          padding: findSize(15),
        }}>
        <Text style={styles.heading}>Help & Support</Text>
        <View style={{flexDirection: 'row', marginBottom: findSize(20)}}>
          <ImageComponent
            source={require('src/assets/images/logo.png')}
            style={{
              height: findSize(59),
              width: findSize(59),
              borderRadius: findSize(7),
            }}
          />
          <Text
            style={[
              styles.heading,
              {
                fontSize: findSize(17),
                marginVertical: 0,
                marginHorizontal: findSize(12),
              },
            ]}>
            {data?.name}
          </Text>
        </View>

        <Text style={styles.smallText}>User Email</Text>
        <Text numberOfLines={1} style={styles.name}>
          {data?.email}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.smallText}>Mobile Number</Text>
        <Text numberOfLines={1} style={styles.name}>
          {data?.mobile_no}
        </Text>
      </View>
    </>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  heading: {
    fontSize: findSize(25),
    fontFamily: fonts.Montserrat_SemiBold,
    marginVertical: findSize(20),
    color: colors.defaultBlack,
  },
  smallText: {
    color: colors.appGray,
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Regular,
    marginVertical: findHeight(5),
    marginTop: findSize(20),
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
    marginTop: findHeight(20),
  },
  lodingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
  },
});
