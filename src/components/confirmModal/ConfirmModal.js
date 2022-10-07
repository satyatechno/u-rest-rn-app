import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  findHeight,
  findSize,
} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import CustomButton from '../customButton/CustomButton';
import ImageComponent from '../ImageComponent/ImageComponent';
const ConfirmModal = ({isVisible, onButtomPress}) => {
  return (
    <Modal
      animationInTiming={500}
      animationOutTiming={300}
      style={{marginBottom: 0, justifyContent: 'flex-end'}}
      isVisible={isVisible}>
      <View style={styles.container}>
        <ImageComponent
          source={require('src/assets/images/booking-confirm.svg')}
        />
        <Text style={styles.heading}>Booking Successful!</Text>
        <Text style={styles.smallText}>
          Thank you for choosing{' '}
          <Text style={{fontFamily: fonts.Montserrat_Bold}}>U-Rest</Text> for
          service.
        </Text>
        <CustomButton
          title={'Booking Details'}
          onPress={onButtomPress}
          type={1}
          style={styles.buttonStyle}
          textStyle={{color: colors?.themeColor, fontSize: findSize(18)}}
        />
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.themeColor,
    // height: DEVICE_HEIGHT * 0.8,
    borderTopEndRadius: DEVICE_WIDTH / 2,
    borderTopStartRadius: DEVICE_WIDTH / 2,
    alignItems: 'center',
    paddingTop: findHeight(60),
    paddingBottom: findHeight(20),
  },
  buttonStyle: {
    backgroundColor: colors.defaultWhite,
    width: DEVICE_WIDTH * 0.5,
    height: findHeight(50),
  },
  smallText: {
    color: colors.defaultWhite,
    fontFamily: fonts.Montserrat_Regular,
    fontSize: findSize(20),
    textAlign: 'center',
    width: DEVICE_WIDTH * 0.65,
    marginVertical: findHeight(20),
  },
  heading: {
    color: colors.defaultWhite,
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: findSize(43),
    textAlign: 'center',
    width: DEVICE_WIDTH * 0.7,
    marginTop: findHeight(20),
  },
});
