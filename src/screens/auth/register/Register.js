import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useMutation} from 'react-query';
import {registerApi} from 'src/api/authentication';
import CustomButton from 'src/components/customButton/CustomButton';
import CustomInput from 'src/components/customInput/CustomInput';
import {DEVICE_HEIGHT, findHeight, findSize} from 'src/helper/helper';
import {errorToast, successToast} from 'src/utils/toast';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {setSkipLogin} from 'src/redux/reducers/userReducer';
import {useDispatch} from 'react-redux';

const Register = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  // const [address, setAddress] = useState('');
  // const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('IN');
  const [countryCode, setCountryCode] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const validation = () => {
    let mobileRgx = /^[6-9]\d{9}$/;
    let firstNameError = '';
    let mobileError = '';
    let lastNameError = '';
    let addressError = '';
    if (!firstName?.trim()) {
      firstNameError = 'Required!';
    } else if (firstName?.trim()?.length < 3) {
      firstNameError = 'Minimum 3 character required!';
    }
    if (!lastName?.trim()) lastNameError = 'Required!';
    if (!mobile) mobileError = 'Required!';
    else if (mobile?.length < 6 || mobile?.length > 15)
      mobileError = 'Invalid Mobile Number';
    // if (!zipCode) zipCodeError = 'Required!';
    // else if (zipCode?.length < 6) zipCodeError = 'Invalid Zipcode';
    // if (!address) addressError = 'Required!';

    if (
      firstNameError.length ||
      lastNameError.length ||
      mobileError.length
      //  ||
      // zipCodeError.length ||
      // addressError.length
    ) {
      setError({
        ...error,
        firstName: firstNameError,
        lastName: lastNameError,
        mobile: mobileError,
        // address: addressError,
        // zipCode: zipCodeError,
      });
      return false;
    } else {
      setError('');
      return true;
    }
  };
  const {mutate, isLoading} = useMutation(registerApi, {
    onSuccess: res => {
      if (res.data?.status) {
        successToast(res.data?.message);
        navigation.replace('OtpVerification', {
          mobile: mobile,
          country_code: countryCode,
          type: 'register',
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
  const onRegister = () => {
    const validate = validation();
    if (validate) {
      PreventTouch(true, false);
      mutate({
        name: `${firstName} ${lastName}`,
        mobile: mobile,
        country_code: countryCode,
        // zipcode: zipCode,
        // address: address,
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
              <Text style={styles.headingSmall}>Join Us</Text>
              <Text style={styles.heading}>Create Account</Text>
              <CustomInput
                icon={require('src/assets/images/user.svg')}
                value={firstName}
                onChangeText={text => setFirstName(text)}
                placeholder="First Name"
                mainContainerStyle={{
                  marginBottom: findHeight(15),
                  marginTop: findHeight(10),
                }}
                title={'First Name'}
                error={error?.firstName}
              />
              <CustomInput
                icon={require('src/assets/images/user.svg')}
                value={lastName}
                onChangeText={text => setLastName(text)}
                placeholder="Last Name"
                mainContainerStyle={{
                  marginBottom: findHeight(15),
                  marginTop: findHeight(10),
                }}
                title={'Last Name'}
                error={error?.lastName}
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
              {/* <CustomInput
              icon={require('src/assets/images/location.svg')}
              value={address}
              onChangeText={text => setAddress(text)}
              placeholder="Address"
              mainContainerStyle={{
                marginBottom: findHeight(15),
                marginTop: findHeight(10),
              }}
              title={'Address'}
              error={error?.address}
            />
            <CustomInput
              icon={require('src/assets/images/location_map.svg')}
              value={zipCode}
              onChangeText={text => setZipCode(text)}
              placeholder="Zip Code"
              mainContainerStyle={{
                marginBottom: findHeight(15),
                marginTop: findHeight(10),
              }}
              title={'Zip Code'}
              error={error?.zipCode}
            /> */}
              <CustomButton
                title={'Create Account'}
                type={1}
                onPress={() => {
                  onRegister();
                }}
                isLoading={isLoading}
                style={{
                  marginTop: findHeight(30),
                  backgroundColor: colors.appGreen,
                }}
              />
            </View>
          </SafeAreaView>
          <Text style={styles.alreadyText}>
            Already have an account?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={styles.signInText}>
              Sign In{'\n'}
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

export default Register;

const styles = StyleSheet.create({
  skipText: {
    fontSize: findSize(13),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.appGreen,
    alignSelf: 'center',
    paddingBottom: findHeight(50),
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
