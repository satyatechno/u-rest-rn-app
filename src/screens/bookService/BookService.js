import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import CustomButton from 'src/components/customButton/CustomButton';
import CustomInput from 'src/components/customInput/CustomInput';
import Header from 'src/components/header/Header';
import {findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import ConfirmModal from 'src/components/confirmModal/ConfirmModal';
import {useDispatch, useSelector} from 'react-redux';
import {useMutation} from 'react-query';
import {bookServiceApi} from 'src/api/services';
import {errorToast} from 'src/utils/toast';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {navigationRef} from 'src/utils/Navigation';
import {setCartData} from 'src/redux/reducers/serviceReducer';

const BookService = ({navigation, route}) => {
  // const {service} = route?.params;
  const token = useSelector(state => state?.userReducer?.token);

  const primaryAddress = useSelector(
    state => state?.userReducer?.primaryAddress,
  );

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const dispatch = useDispatch();

  const validation = () => {
    let timeError = '';
    let dateError = '';
    let addressError = '';
    if (!time) timeError = 'Required!';
    else if (
      !moment(time).isBetween(
        moment('07:00', 'HH:mm'),
        moment('19:00', 'HH:mm'),
        'minutes',
        '[]',
      )
    ) {
      timeError = 'Time should be in between 7:00 AM and 7:00 PM.';
    }
    if (!date) dateError = 'Required!';
    // if (!primaryAddress?.address) addressError = 'Required!';

    let dateTime = `${moment(date).format('YYYY-MM-DD')} ${moment(time).format(
      'HH:mm',
    )}`;

    if (
      !moment(dateTime, 'YYYY-MM-DD HH:mm').isAfter(
        moment().add(24, 'hours').format('YYYY-MM-DD HH:mm'),
        'hours',
      )
    ) {
      errorToast('We require booking at least 24 hours in advance');
      return false;
    }
    if (timeError.length || dateError?.length) {
      setError({
        ...error,
        date: dateError,
        time: timeError,
        // address: addressError,
      });
      return false;
    } else {
      setError('');
      return true;
    }
  };
  const {mutate, isLoading} = useMutation(bookServiceApi, {
    onSuccess: res => {
      if (res.data?.status) {
        console.log('ress booking', res.data);
        setIsVisible(true);
        dispatch(setCartData({}));
        setBookingDetails(res.data.data?.booking);
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
  const onBookService = () => {
    if (primaryAddress?.address) {
      const validate = validation();
      if (validate) {
        PreventTouch(true, false);
        console.log(
          'timeee',
          `${moment(date).format('YYYY-MM-DD')} ${moment(time).format(
            'HH:mm',
          )}`,
        );
        mutate({
          data: {
            // service_id: service?.id,
            time: `${moment(date).format('YYYY-MM-DD')} ${moment(time).format(
              'HH:mm',
            )}`,
            address_id: primaryAddress?.id,
            further_suggestion: isSelected,
          },
          token: token,
        });
      }
    } else {
      Alert.alert('Error', 'Please add an address to your account.', [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'OK',
          style: 'default',
          onPress: () => {
            navigation?.navigate('AddressList');
          },
        },
      ]);
    }
  };

  return (
    <>
      <Header backButton={true} navigation={navigation} />
      <View style={styles.container}>
        <Text numberOfLines={2} style={styles.serviceTitle}>
          Book Your Service
        </Text>
        <CustomInput
          icon={require('src/assets/images/date-calendar.svg')}
          value={moment(date).format('Do MMM YYYY')}
          placeholder="Date"
          mainContainerStyle={{
            marginVertical: findHeight(20),
          }}
          title={'Date'}
          error={error?.date}
          isTouchable={true}
          onPress={() => setShowDatePicker(true)}
          editable={false}
        />
        <CustomInput
          icon={require('src/assets/images/clock.svg')}
          value={moment(time).format('hh:mm A')}
          onChangeText={text => setTime(text)}
          placeholder="Time"
          mainContainerStyle={{
            marginVertical: findHeight(20),
          }}
          title={'Time'}
          error={error?.time}
          isTouchable={true}
          onPress={() => setShowTimePicker(true)}
          editable={false}
        />
        {/* <CustomInput
          icon={require('src/assets/images/location.svg')}
          value={primaryAddress?.address}
          onChangeText={text => setAddress(text)}
          placeholder="Address"
          mainContainerStyle={{
            marginVertical: findHeight(20),
            marginBottom: findHeight(10),
          }}
          inputStyle={{minWidth: findSize(150)}}
          title={'Address'}
          error={error?.address}
          editable={false}
        />
        <CustomButton
          onPress={() => {
            navigation?.navigate('AddressList');
          }}
          style={styles.changeButton}>
          <Text style={styles.changeText}>
            {primaryAddress !== undefined ? 'Change Address' : 'Add Address'}
          </Text>
        </CustomButton> */}
        <View style={{flexDirection: 'row', marginBottom: findSize(10)}}>
          <CustomButton
            onPress={() => setIsSelected(!isSelected)}
            style={styles.iconContainer}>
            {isSelected && <View style={styles.icon} />}
          </CustomButton>
          <Text style={styles.checkText}>
            Select this if you would like Recommendations for Further Deep
            Cleaning Added To the Invoice
          </Text>
        </View>

        <CustomButton
          title={'Confirm'}
          type={1}
          onPress={() => onBookService()}
          isLoading={isLoading}
        />
        <ConfirmModal
          isVisible={isVisible}
          onButtomPress={() => {
            setIsVisible(false);

            navigation?.replace('BookingDetails', {
              booking_id: bookingDetails?.id,
            });
          }}
        />
      </View>
      <DatePicker
        modal
        mode="date"
        open={showDatePicker}
        minimumDate={new Date()}
        date={date}
        onConfirm={date => {
          setShowDatePicker(false);
          setDate(date);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
      <DatePicker
        modal
        open={showTimePicker}
        date={time}
        mode="time"
        onConfirm={time => {
          console.log('time', time, ` ${moment(time).format('hh:mm A')}`);
          setShowTimePicker(false);
          setTime(time);
        }}
        onCancel={() => {
          setShowTimePicker(false);
        }}
      />
    </>
  );
};

export default BookService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
    padding: findSize(20),
  },
  serviceTitle: {
    fontSize: findSize(25),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultBlack,
    marginVertical: findHeight(15),
  },
  changeButton: {
    height: findHeight(26),
    width: findSize(110),
    borderRadius: findSize(4),
    backgroundColor: colors.themeColor,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: findHeight(30),
  },
  changeText: {
    fontSize: findSize(10),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.defaultWhite,
  },
  iconContainer: {
    height: findSize(16),
    width: findSize(16),
    borderRadius: 2,
    backgroundColor: colors.appGray1,

    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: findSize(5),
  },
  icon: {
    height: findSize(6),
    width: findSize(6),
    backgroundColor: colors.themeColor,
  },
  checkText: {
    fontSize: findSize(12),
    fontFamily: fonts.Montserrat_Regular,
    color: colors.defaultBlack,
    marginTop: -findSize(1),
    flex: 1,
  },
});
