import React, {useEffect} from 'react';
import {Alert, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from 'src/components/customButton/CustomButton';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import {setManageAddressNavigation} from 'src/redux/reducers/userReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const AddressScreen = ({navigation}) => {
  const manageSkipAddress = useSelector(
    state => state?.userReducer?.manageSkipAddress,
  );
  const dispatch = useDispatch();
  // useEffect(() => {
  //   console.log('object', navigation);
  //   navigation.addListener('beforeRemove', e => {
  //     console.log('eeeeee', e);
  //     if (e?.data?.action?.type === 'GO_BACK') {
  //       Alert.alert(
  //         'Exit Bedrock',
  //         'Are you sure, you want to exit Application',
  //         [
  //           {
  //             text: 'Cancel',
  //             style: 'cancel',
  //             onPress: () => {
  //               return;
  //             },
  //           },
  //           {
  //             text: 'Exit',
  //             onPress: () => navigation.dispatch(e.data.action),
  //           },
  //         ],
  //       );
  //     }
  //   });
  // }, []);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.defaultWhite}}>
    <View style={styles.container}>
      
      <Image
        source={require('src/assets/images/address-map.svg')}
        style={{
          width: DEVICE_WIDTH - findSize(40),
          marginBottom: findHeight(20),
        }}
        resizeMode="contain"
      />
      <CustomButton
        type={1}
        title={'Set Your Location'}
        onPress={() => navigation?.navigate('MapScreen', {register: true})}
        style={{marginVertical: findHeight(20)}}
      />
      <CustomButton
        //   style={styles.skipButton}
        onPress={() => {
          dispatch(setManageAddressNavigation(false));
          navigation.reset({index: 0, routes: [{name: 'DrawerStack'}]});
        }}>
        <Text style={styles.skipText}>Skip For Now</Text>
      </CustomButton>
    </View>
    </SafeAreaView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
    justifyContent: 'center',
    alignItems: 'center',
    padding: findSize(20),
  },
  skipText: {
    fontSize: findSize(22),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.themeColor,
    textDecorationLine: 'underline',
    marginVertical: findHeight(20),
  },
});
