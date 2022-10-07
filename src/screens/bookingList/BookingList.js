import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {bookingListApi} from 'src/api/serviceBooking';
import CustomButton from 'src/components/customButton/CustomButton';
import CustomInput from 'src/components/customInput/CustomInput';
import EmptyComponent from 'src/components/emptyComponent/EmptyComponent';
import Header from 'src/components/header/Header';
import LoadingComponent from 'src/components/loadingComponent/LoadingComponent';
import TopTab from 'src/components/topTab/TopTab';
import WrapperComponent from 'src/components/wrapperComponent/WrapperComponent';
import {
  capitalizeFirstLetter,
  DEVICE_WIDTH,
  findHeight,
  findSize,
} from 'src/helper/helper';
import {setBookingData} from 'src/redux/reducers/bookingReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const RenderItem = ({item, onPress}) => {
  return (
    <CustomButton
      onPress={onPress}
      key={item?.id?.toString()}
      style={styles.service}>
      {/* <View style={styles.iconContainer}>
        <Image source={item?.serviceIcon} />
      </View> */}
      <View style={styles.middile}>
        <Text style={styles.serviceText}>#{item?.booking_number}</Text>
        <View style={[styles.row, {marginVertical: findHeight(4)}]}>
          <View style={[styles.row]}>
            <Image
              style={{marginEnd: findSize(3)}}
              source={require('src/assets/images/calendar.svg')}
            />
            <Text style={styles.timeText}>
              {moment(item?.booking_time, 'YYYY-MM-DD HH:mm:ss').format(
                'DD MMM YYYY',
              )}
            </Text>
          </View>
          <View style={styles.row}>
            <Image
              style={{marginEnd: findSize(3)}}
              source={require('src/assets/images/clock.svg')}
            />
            <Text style={styles.timeText}>
              {moment(item?.booking_time, 'YYYY-MM-DD HH:mm:ss').format(
                'hh:mm A',
              )}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={[styles.row]}>
            <Image
              style={{marginEnd: findSize(3), tintColor: colors.themeColor}}
              source={require('src/assets/images/dollar.svg')}
            />
            <Text
              style={[
                styles.timeText,
                {fontFamily: fonts.Montserrat_SemiBold},
              ]}>
              {item?.price}
            </Text>
          </View>
          <View style={styles.row}>
            <Image
              style={{
                marginEnd: findSize(3),
                height: findSize(16),
                width: findSize(11),
                tintColor: colors.themeColor,
              }}
              source={require('src/assets/images/location.svg')}
            />
            <Text
              style={[
                styles.timeText,
                {fontFamily: fonts.Montserrat_SemiBold},
              ]}>
              {item?.user_address}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
          }}>
          <Text
            style={[
              styles.timeText,
              {fontFamily: fonts.Montserrat_SemiBold, marginTop: findSize(1)},
            ]}>
            Payment Status :{' '}
          </Text>
          <WrapperComponent
            text={item?.payment_status}
            color={item.payment_color}
          />
        </View>
      </View>
      <View
        style={[styles.statusContainer, {backgroundColor: item?.status_color}]}>
        <View style={styles.statusIcon}>
          <Image
            style={{tintColor: item?.status_color}}
            source={require('src/assets/images/stopwatch.svg')}
          />
        </View>
        <Text style={styles.status}>
          {capitalizeFirstLetter(item?.status)?.replace('_', ' ')}
        </Text>
      </View>
    </CustomButton>
  );
};
const BookingList = ({navigation}) => {
  const token = useSelector(state => state?.userReducer?.token);
  const bookingData = useSelector(state => state?.bookingReducer?.bookingData);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const dispatch = useDispatch();
  const BOOKINGS = useMutation(bookingListApi, {
    onSuccess: res => {
      if (res.data?.status) {
        dispatch(setBookingData(res.data?.data?.bookings));
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      setIsRefresh(false);
    },
  });

  useEffect(() => {
    BOOKINGS?.mutate({token: token});
  }, []);
  useEffect(() => {
    if (bookingData?.length) {
      let CURRENT = [];
      let COMPLETED = [];
      bookingData?.forEach(item => {
        if (item?.status === 'pending' || item?.status === 'in_progress') {
          CURRENT = [...CURRENT, item];
        }
        if (item?.status === 'completed' || item?.status === 'cancelled') {
          COMPLETED = [...COMPLETED, item];
        }
      });
      setCurrentData([...CURRENT]);
      setCompletedData([...COMPLETED]);
    }
  }, [bookingData]);
  if (BOOKINGS?.isLoading && !isRefresh) {
    return (
      <>
        <Header
          navigation={navigation}
          location={true}
          notificationButton={true}
          cart={true}
        />
        <View
          style={{
            flex: 1,

            backgroundColor: colors.defaultWhite,
          }}>
          <Text
            style={{
              fontFamily: fonts.Montserrat_Bold,
              color: colors.defaultBlack,
              fontSize: findSize(25),
              marginVertical: findHeight(20),
              marginStart: findSize(15),
            }}>
            My Bookings
          </Text>

          <LoadingComponent />
        </View>
      </>
    );
  }
  return (
    <>
      <Header
        navigation={navigation}
        location={true}
        notificationButton={true}
        cart={true}
      />
      <View
        style={{
          flex: 1,

          backgroundColor: colors.defaultWhite,
        }}>
        <Text
          style={{
            fontFamily: fonts.Montserrat_Bold,
            color: colors.defaultBlack,
            fontSize: findSize(25),
            marginVertical: findHeight(20),
            marginStart: findSize(15),
          }}>
          My Bookings
        </Text>
        <TopTab
          data={['Current Bookings', 'Completed Bookings']}
          activeIndex={activeIndex}
          onChangeIndex={index => setActiveIndex(index)}
        />
        <FlatList
          data={activeIndex ? completedData : currentData}
          ListEmptyComponent={
            <EmptyComponent
              image={require('src/assets/images/no-booking.svg')}
              text={
                'You don’t have any ' +
                ['Current Bookings', 'Completed Bookings']?.[activeIndex] +
                ' yet.'
              }
            />
          }
          contentContainerStyle={{flexGrow: 1}}
          renderItem={({item, index}) => (
            <RenderItem
              item={item}
              onPress={() =>
                navigation?.navigate('BookingDetails', {booking_id: item?.id})
              }
            />
          )}
          keyExtractor={(item, index) => item?.id?.toString()}
          style={{paddingHorizontal: findSize(15)}}
          refreshing={isRefresh}
          onRefresh={() => {
            setIsRefresh(true);
            BOOKINGS?.mutate({token: token});
          }}
        />
      </View>
    </>
  );
};

export default BookingList;
// const ListHeaderComponent = () => (
//   <View style={{paddingVertical: findHeight(10)}}>
//     <CustomInput
//       icon={require('src/assets/images/search.svg')}
//       value={searchText}
//       onChangeText={text => setSearchText(text)}
//       placeholder="Search here"
//       mainContainerStyle={{
//         marginBottom: findHeight(15),
//         marginTop: findHeight(10),
//       }}
//       keyboardType="phone-pad"
//       title={''}
//       error={''}
//     />
//   </View>
// );
const styles = StyleSheet.create({
  service: {
    backgroundColor: colors.appGray1,
    minHeight: findHeight(90),

    borderRadius: findHeight(15),

    marginVertical: findHeight(10),
    flexDirection: 'row',
    padding: findSize(13),
  },
  serviceText: {
    fontSize: findSize(15),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultBlack,
    marginTop: -findHeight(3),
  },
  serviceContainer: {},
  iconContainer: {
    backgroundColor: colors.defaultWhite,
    height: findHeight(61),
    width: findSize(59),
    borderRadius: findSize(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    width: DEVICE_WIDTH * 0.3,
  },

  middile: {
    width: DEVICE_WIDTH * 0.67,
    paddingHorizontal: findSize(10),
  },
  timeText: {
    fontSize: findSize(10),
    color: colors.appGray,
    fontFamily: fonts.Montserrat_Regular,
  },
  description: {
    fontSize: findSize(8),
    color: colors.appGray,
    fontFamily: fonts.Montserrat_Regular,
  },
  statusContainer: {
    backgroundColor: colors.appYellow,
    height: findHeight(16),
    minWidth: findSize(70),
    borderRadius: findHeight(3),
    justifyContent: 'center',
    marginLeft: findSize(8),
  },
  status: {
    fontSize: findSize(8),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultWhite,
    alignSelf: 'center',
    marginStart: findSize(5),
  },
  statusIcon: {
    backgroundColor: colors.appGray1,
    position: 'absolute',
    height: findSize(16),
    width: findSize(16),
    borderRadius: findSize(8),
    tintColor: colors.appYellow,
    left: -findSize(8),
    justifyContent: 'center',
  },
});
