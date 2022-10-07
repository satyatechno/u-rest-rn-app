import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import CustomButton from 'src/components/customButton/CustomButton';
import EmptyComponent from 'src/components/emptyComponent/EmptyComponent';
import WrapperComponent from 'src/components/wrapperComponent/WrapperComponent';
import {
  capitalizeFirstLetter,
  DEVICE_WIDTH,
  findHeight,
  findSize,
} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const RenderItem = ({item, onPress}) => {
  return (
    <CustomButton
      onPress={onPress}
      key={item?.id?.toString()}
      style={styles.service}>
      {/* <View style={styles.iconContainer}>
        <ImageComponent
          source={{
            uri: item?.image,
          }}
          style={{
            height: findSize(65),
            width: findSize(60),
          }}
          resizeMode={'contain'}
        />
      </View> */}
      <View style={styles.middile}>
        <Text style={styles.serviceText}>#{item?.booking_number}</Text>
        <View style={[styles.row, {marginVertical: findHeight(4)}]}>
          <View style={[styles.row]}>
            <Image
              style={{
                width: findSize(15),
                height: findSize(15),
                marginEnd: findSize(4),
                marginLeft: -1,
              }}
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
              style={{
                width: findSize(13),
                height: findSize(13),
                marginEnd: findSize(5),
                marginLeft: -1,
              }}
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
              style={{
                // marginLeft: findSize(1),

                marginEnd: findSize(5),
                tintColor: colors.themeColor,
              }}
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
                marginEnd: findSize(5),
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
const CurrentBooking = ({data, navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Current Bookings</Text>
        {data?.length > 3 ? (
          <CustomButton
            type={1}
            style={styles.button}
            title={'See All'}
            textStyle={{fontSize: findSize(12)}}
            onPress={() => {
              navigation.navigate('BookingList');
            }}
          />
        ) : null}
      </View>
      {data?.length ? (
        <View style={styles.serviceContainer}>
          {data?.slice(0, 3)?.map(item => (
            <RenderItem
              key={item?.id?.toString()}
              item={item}
              onPress={() =>
                navigation?.navigate('BookingDetails', {booking_id: item?.id})
              }
            />
          ))}
        </View>
      ) : (
        <EmptyComponent
          image={require('src/assets/images/no-booking.svg')}
          text={'You don’t have any Bookings yet.'}
        />
      )}
    </View>
  );
};

export default CurrentBooking;

const styles = StyleSheet.create({
  container: {
    marginBottom: findHeight(30),
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: findSize(20),
    fontFamily: fonts.Montserrat_Bold,
    color: colors.defaultBlack,
  },
  button: {height: findHeight(30), width: findSize(70)},
  service: {
    backgroundColor: colors.appGray1,
    minHeight: findHeight(90),

    borderRadius: findHeight(15),

    marginVertical: findHeight(10),
    flexDirection: 'row',
    padding: findSize(10),
  },
  serviceText: {
    fontSize: findSize(15),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultBlack,
  },
  serviceContainer: {},
  iconContainer: {
    backgroundColor: colors.defaultWhite,
    height: findSize(65),
    width: findSize(60),
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
    // marginLeft: findSize(8),
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
