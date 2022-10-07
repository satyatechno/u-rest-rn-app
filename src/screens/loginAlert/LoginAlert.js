import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import CustomButton from 'src/components/customButton/CustomButton';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const LoginAlert = ({navigation}) => {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.defaultWhite}}>
    <View style={styles.container}>
      <ImageComponent
        source={require('src/assets/images/login-alert.svg')}
        style={{
          width: DEVICE_WIDTH - findSize(40),
          marginBottom: findHeight(20),
        }}
        resizeMode="contain"
      />
      <Text style={styles.heading}>
        Sign In first to access U-Rest Services.
      </Text>
      <Text style={styles.text}>
        It seems you don't have an account on{' '}
        <Text style={{fontFamily: fonts.Montserrat_SemiBold}}>"U-Rest"</Text>{' '}
        yet. But don't worry, you can create it now and then proceed with{' '}
        <Text style={{fontFamily: fonts.Montserrat_SemiBold}}>
          U-Rest services
        </Text>
        .{' '}
      </Text>

      <CustomButton
        type={1}
        title={'Sign In'}
        onPress={() => navigation?.navigate('Login')}
        style={{marginVertical: findHeight(20)}}
      />
    </View>
    </SafeAreaView>
  );
};

export default LoginAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
    justifyContent: 'center',
    alignItems: 'center',
    padding: findSize(20),
  },
  text: {
    fontSize: findSize(17),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_Regular,
    textAlign: 'center',
    marginBottom: findHeight(20),
  },
  heading: {
    fontSize: findSize(27),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_SemiBold,
    textAlign: 'center',
    marginBottom: findHeight(20),
  },
});
