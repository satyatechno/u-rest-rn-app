import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';
import {otpVerifyApi, resendOtpApi, saveDevice} from 'src/api/authentication';
import CustomButton from 'src/components/customButton/CustomButton';
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  findHeight,
  findSize,
} from 'src/helper/helper';
import {errorToast, successToast} from 'src/utils/toast';
import {
  setManageAddressNavigation,
  setSkipLogin,
  userLogin,
} from 'src/redux/reducers/userReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import OneSignal from 'react-native-onesignal';
import {getUniqueId} from 'react-native-device-info';
import {setIntroStatus} from 'src/redux/reducers/staticReducer';
const OtpVerification = ({navigation, route}) => {
  const {type, mobile, country_code} = route?.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRef = useRef();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   otpRef?.current?.focus();
  // }, []);
  const [error, setError] = useState('');
  const validation = () => {
    let otpError = '';
    if (!otp) otpError = 'OTP Required!';
    else if (otp?.length < 4) otpError = 'Invalid OTP';
    if (otpError.length) {
      errorToast(otpError);
      setError({
        ...error,
        otp: otpError,
      });
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const SAVE_DEVICE = useMutation(saveDevice, {
    onSuccess: res => {
      if (res.data?.status) {
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
      dispatch(setSkipLogin(false));
      dispatch(setIntroStatus(false));
      // successToast(res.data?.message);
      if (type === 'register') {
        dispatch(setManageAddressNavigation(true));
      }
      navigation.reset({
        index: 0,
        routes:
          type === 'register'
            ? [{name: 'AddressScreen'}]
            : [{name: 'DrawerStack'}],
      });
    },
  });

  const {mutate, isLoading} = useMutation(otpVerifyApi, {
    onSuccess: res => {
      console.log('success data', res.data);
      if (res.data?.status) {
        OneSignal.getDeviceState().then(device => {
          console.log('DEVICE=======', getUniqueId());
          dispatch(userLogin(res.data));
          SAVE_DEVICE.mutate({
            token: res.data?.auth_token,
            data: {
              player_id: device?.userId,
              device_id: getUniqueId(),
              device_type: Platform.OS,
            },
          });
        });
      }
    },

    onError: error => {
      setLoading(false);
      console.log('rerrr', error?.response?.data);
      if (!error?.response?.data?.status) {
        errorToast(error?.response?.data?.message);
      }
    },
    onSettled: () => {
      PreventTouch(false, false);
    },
  });
  const onVerify = () => {
    const validate = validation();
    if (validate) {
      PreventTouch(true, false);
      setLoading(true);
      mutate({
        type: type,
        data: {mobile: mobile, otp: parseInt(otp), country_code: country_code},
      });
    }
  };
  const resendCode = useMutation(resendOtpApi, {
    onSuccess: res => {
      // console.log('success data', res.data);
      if (res.data?.status) {
        successToast(res.data?.message);
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
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.defaultWhite}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' && 'padding'}
        style={{flex: 1}}>
        <ScrollView
          style={{backgroundColor: colors.defaultWhite}}
          showsVerticalScrollIndicator={false}>
          <View style={{height: DEVICE_HEIGHT}}>
            <SafeAreaView
              style={{flex: 1, backgroundColor: colors.defaultWhite}}>
              <View
                style={{
                  padding: 20,
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text style={styles.heading}>Verify Phone Number</Text>
                <Text style={styles.headingSmall}>
                  We have sent you an SMS with a code to number {country_code}-
                  {mobile}
                </Text>
                <Image source={require('src/assets/images/otp.svg')} />
                <Text
                  style={{
                    fontFamily: fonts.Montserrat_Medium,
                    fontSize: 14,
                    color: colors.defaultBlack,
                    textAlign: 'center',
                    marginVertical: 10,
                  }}>
                  Enter 4 Digit Code Here
                </Text>
                <OtpInputs
                  ref={otpRef}
                  handleChange={code => setOtp(code)}
                  numberOfInputs={4}
                  inputStyles={{
                    backgroundColor: colors.appGray1,
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    marginHorizontal: 10,
                    fontSize: 22,
                    fontFamily: fonts.Montserrat_SemiBold,
                    color: colors.defaultBlack,
                    textAlign: 'center',
                  }}
                  style={{flexDirection: 'row', marginVertical: 20}}
                />
                <CustomButton
                  title={'Verify'}
                  type={1}
                  onPress={() => onVerify()}
                  isLoading={loading}
                  style={{backgroundColor: colors?.appGreen}}
                />
              </View>
            </SafeAreaView>
            <Text style={styles.alreadyText}>
              Didn't receive a code?{'\n'}
              <Text
                onPress={() => {
                  PreventTouch(true, true);
                  resendCode?.mutate({
                    data: {mobile: mobile, country_code: country_code},
                    type: type,
                  });
                }}
                style={styles.signInText}>
                Resend Code
              </Text>
              {/* <ActivityIndicator size={15} color={colors.themeColor} /> */}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  headingSmall: {
    fontSize: findSize(13),
    marginBottom: findHeight(20),
    marginTop: findHeight(10),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.appGray,
    textAlign: 'center',
    width: DEVICE_WIDTH * 0.6,
  },
  heading: {
    fontSize: findSize(29),
    marginTop: findHeight(20),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_Bold,
  },
  alreadyText: {
    fontSize: findSize(13),
    color: colors.defaultBlack,
    paddingBottom: findHeight(50),
    textAlign: 'center',
    fontFamily: fonts.Montserrat_SemiBold,
  },
  signInText: {
    fontSize: findSize(14),
    color: colors.appGreen,
    fontWeight: 'bold',
  },
});
