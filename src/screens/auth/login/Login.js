import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';
import {loginApi} from 'src/api/authentication';
import CustomButton from 'src/components/customButton/CustomButton';
import CustomInput from 'src/components/customInput/CustomInput';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {DEVICE_HEIGHT, findHeight, findSize} from 'src/helper/helper';
import {setSkipLogin} from 'src/redux/reducers/userReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {errorToast, successToast} from 'src/utils/toast';

const Login = ({navigation}) => {
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('IN');
  const [countryCode, setCountryCode] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const validation = () => {
    let mobileRgx = /\d{6,15}/;
    let mobileError = '';
    if (!mobile) mobileError = 'Required!';
    else if (mobile?.length < 6 || mobile?.length > 15)
      mobileError = 'Invalid Mobile Number';
    if (mobileError.length) {
      setError({
        ...error,
        mobile: mobileError,
      });
      return false;
    } else {
      setError('');
      return true;
    }
  };
  const {mutate, isLoading} = useMutation(loginApi, {
    onSuccess: res => {
      if (res.data?.status) {
        successToast(res.data?.message);
        navigation.navigate('OtpVerification', {
          mobile: mobile,
          country_code: countryCode,
          type: 'login',
        });
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
      if (!error?.response?.data?.status) {
        errorToast(error?.response?.data?.message);
      }
    },
    onSettled: () => {
      PreventTouch(false, false);
    },
  });
  const onLogin = () => {
    const validate = validation();
    if (validate) {
      PreventTouch(true, false);

      mutate({
        mobile: mobile,
        country_code: countryCode,
      });
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.defaultWhite}
      />
      <ScrollView
        style={{backgroundColor: colors.defaultWhite}}
        showsVerticalScrollIndicator={false}>
        <View style={{height: DEVICE_HEIGHT}}>
          <SafeAreaView style={{flex: 1, backgroundColor: colors.defaultWhite}}>
            <View
              style={{
                padding: findSize(20),
                alignItems: 'center',
                flex: 1,
              }}>
              <Text style={styles.headingSmall}>Welcome</Text>
              <Text style={styles.heading}>Sign In</Text>
              <Image
                source={require('src/assets/images/signin.jpg')}
                style={{
                  height: findSize(250),
                  width: findSize(250),
                }}
              />
              <CustomInput
                icon={require('src/assets/images/phone.svg')}
                value={mobile}
                onChangeText={text => setMobile(text)}
                placeholder="Mobile Number"
                mainContainerStyle={{
                  marginBottom: findHeight(15),
                  marginTop: findHeight(10),
                }}
                keyboardType="phone-pad"
                title={'Mobile Number'}
                error={error?.mobile}
                countryPick={true}
                countryCode={country}
                onCountrySelect={code => {
                  setCountryCode(code);
                }}
              />

              <CustomButton
                title={'Sign In'}
                type={1}
                onPress={() => onLogin()}
                isLoading={isLoading}
                style={{backgroundColor: colors.appGreen}}
              />
            </View>
          </SafeAreaView>
          <Text style={styles.alreadyText}>
            Don’t have an account?{' '}
            <Text
              onPress={() => navigation.navigate('Register')}
              style={styles.signInText}>
              Create{'\n'}
            </Text>
            <Text
              style={{
                color: colors?.appGray2,
                lineHeight: 20,
              }}>
              or
            </Text>
          </Text>
          <CustomButton
            style={{alignSelf: 'center'}}
            onPress={() => {
              dispatch(setSkipLogin(true));
              navigation.reset({index: 0, routes: [{name: 'DrawerStack'}]});
            }}>
            <Text style={styles.skipText}>Skip For Now</Text>
          </CustomButton>
        </View>
      </ScrollView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  skipText: {
    fontSize: findSize(13),
    fontFamily: fonts.Montserrat_SemiBold,
    paddingBottom: findHeight(50),
    color: colors.appGreen,
    alignSelf: 'center',
  },
  headingSmall: {
    fontSize: findSize(13),
    marginTop: findHeight(20),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.appGray,
  },
  heading: {
    fontSize: findSize(29),
    marginBottom: findHeight(20),
    marginTop: findHeight(10),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_Bold,
  },
  alreadyText: {
    fontSize: findSize(13),
    color: colors.defaultBlack,

    textAlign: 'center',
    fontFamily: fonts.Montserrat_SemiBold,
  },
  signInText: {
    fontSize: findSize(14),
    color: colors.appGreen,
    fontWeight: 'bold',
  },
});
