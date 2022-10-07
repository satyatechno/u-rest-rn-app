import React, {useEffect} from 'react';
import {View, Text, ImageBackground, StatusBar, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {BUILD_VERSION, DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';

const Splash = ({navigation}) => {
  const TOKEN = useSelector(state => state?.userReducer?.token);
  const skipLogin = useSelector(state => state?.userReducer?.skipLogin);
  const manageSkipAddress = useSelector(
    state => state?.userReducer?.manageSkipAddress,
  );
  const INTRO = useSelector(state => state?.staticReducer?.introScreen);
  useEffect(() => {
    setTimeout(() => {
      if (INTRO) {
        navigation?.replace('IntroScreen');
      } else if (TOKEN && manageSkipAddress) {
        navigation.reset({
          index: 0,
          routes: [{name: 'AddressScreen'}],
        });
      } else if (TOKEN || skipLogin) {
        navigation?.replace('DrawerStack');
      } else {
        navigation?.replace('Welcome');
      }
    }, 2000);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.themeColor} />
      <ImageBackground
        source={require('src/assets/images/splash-u-rest.svg')}
        style={{height: DEVICE_HEIGHT, width: DEVICE_WIDTH}}>
        <Text
          style={{
            color: colors.defaultWhite,
            position: 'absolute',
            top: 10,
            end: 10,
          }}>
          {BUILD_VERSION}
        </Text>
      </ImageBackground>
    </>
  );
};

export default Splash;
