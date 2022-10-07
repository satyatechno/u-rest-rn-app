import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import CustomButton from 'src/components/customButton/CustomButton';
import {findHeight, findSize} from 'src/helper/helper';
import {setSkipLogin} from 'src/redux/reducers/userReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const Welcome = ({navigation}) => {
  // const USER = useSelector(state => state?.userReducer?.user);
  // console.log('USER', USER);
  const dispatch = useDispatch();
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.appGreen} />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.appGreen}}>
        <View style={styles.container}>
          {/* <View>
          <Text style={styles.text1}>Need</Text>
          <Text style={styles.text2}>Cleaning Help?</Text>
          <Text style={styles.text3}>Give us a Chance</Text>
        </View>
        <ImageComponent
          source={require('src/assets/images/welcome.svg')}
          style={{height: 275, width: DEVICE_WIDTH}}
          resizeMode="contain"
        /> */}
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: fonts.Montserrat_Medium,
                fontSize: findSize(50),
                color: colors.defaultWhite,
                marginBottom: 15,
                marginEnd: findSize(25),
              }}>
              Welcome
            </Text>
            <Text
              style={{
                fontFamily: fonts.Montserrat_Regular,
                fontSize: findSize(28),
                color: colors.defaultWhite,
                marginStart: findSize(55),
              }}>
              We work, U-Rest.
            </Text>
          </View>
          <View>
            <CustomButton
              style={styles.createAcc}
              textStyle={{color: colors.appGreen}}
              type={1}
              onPress={() => {
                navigation.navigate('Register');
              }}
              title="Create An Account"
            />
            <CustomButton
              style={styles.signIn}
              textStyle={{color: colors.defaultWhite}}
              type={2}
              onPress={() => {
                navigation.navigate('Login');
              }}
              title="Sign In"
            />
            <CustomButton
              style={{alignSelf: 'center'}}
              onPress={() => {
                dispatch(setSkipLogin(true));
                navigation.reset({index: 0, routes: [{name: 'DrawerStack'}]});
              }}>
              <Text style={styles.skipText}>Skip For Now</Text>
            </CustomButton>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appGreen,
    justifyContent: 'space-around',
  },
  text1: {
    color: colors.defaultWhite,
    marginHorizontal: findSize(15),
    fontSize: findSize(22),
    fontFamily: fonts.Montserrat_Medium,
  },
  text2: {
    color: colors.defaultWhite,
    fontFamily: fonts.Montserrat_Medium,
    marginHorizontal: findSize(15),
    fontSize: findSize(32),
    marginBottom: findHeight(10),
  },
  text3: {
    color: colors.defaultWhite,
    marginHorizontal: findSize(15),
    fontSize: findSize(16),
    fontFamily: fonts.Montserrat_Regular,
    marginBottom: findHeight(30),
  },
  signIn: {
    backgroundColor: colors.appGreen,
    borderColor: colors.defaultWhite,
    width: '80%',
    alignSelf: 'center',
  },
  createAcc: {
    backgroundColor: colors.defaultWhite,
    width: '80%',
    alignSelf: 'center',
  },
  skipText: {
    fontSize: findSize(22),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.defaultWhite,
    textDecorationLine: 'underline',
    marginVertical: findHeight(20),
    alignSelf: 'center',
  },
});
