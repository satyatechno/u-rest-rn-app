import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {color} from 'react-native-reanimated';
import {useMutation} from 'react-query';
import {useSelector} from 'react-redux';
import {payUser} from 'src/api/payUser';
import {bookingDetailsApi} from 'src/api/serviceBooking';
import CustomButton from 'src/components/customButton/CustomButton';
import Header from 'src/components/header/Header';
import LoadingComponent from 'src/components/loadingComponent/LoadingComponent';
import WrapperComponent from 'src/components/wrapperComponent/WrapperComponent';
import {capitalizeFirstLetter, findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {downloadFile} from 'src/utils/downloadFile';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BookingDetails = ({navigation, route}) => {
  const {booking_id} = route?.params;
  console.log(moment(1662337800).toDate());

  const token = useSelector(state => state?.userReducer?.token);
  const [bookingDetails, setBookingDetails] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    mutate({token: token, booking_id: booking_id});
  }, []);

  const {mutate, isLoading} = useMutation(bookingDetailsApi, {
    onSuccess: res => {
      if (res.data?.status) {
        setBookingDetails(res.data?.data?.booking);
        console.log(
          'data==>',
          JSON.stringify(res.data?.data?.booking, null, 2),
        );
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      setRefreshing(false);
    },
  });

  useFocusEffect(
    useCallback(() => {
      mutate({token: token, booking_id: booking_id});
    }, []),
  );

  if (isLoading && !refreshing) {
    return (
      <>
        <Header backButton={true} navigation={navigation} />
        <LoadingComponent />
      </>
    );
  }
  const handlePay = async () => {
    setButtonLoading(true);
    try {
      let fd = new FormData();
      fd.append('booking_id', booking_id);
      const res = await payUser(fd, token);
      navigation.navigate('Payment', {url: res?.data?.data?.url});
      setButtonLoading(false);
    } catch (err) {
      console.log('err', err);
      setButtonLoading(false);
    }
  };

  return (
    <>
      <Header backButton={true} navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{flex: 1, backgroundColor: colors.defaultWhite}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, padding: findSize(20)}}>
          {/* <View style={styles.imageContainer}>
            <View style={styles.image}>
              <ImageComponent
                source={require('src/assets/images/cleaning-hand.svg')}
                style={{height: findSize(25), width: findSize(25)}}
              />
            </View>
            <Text style={styles.name}>Carpet Cleaning</Text>
          </View> */}
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.heading}>
              Booking ID
            </Text>
            <View
              style={[
                styles.statusContainer,
                {backgroundColor: bookingDetails?.status_color},
              ]}>
              <View style={styles.statusIcon}>
                <Image
                  style={{tintColor: bookingDetails?.status_color}}
                  source={require('src/assets/images/stopwatch.svg')}
                />
              </View>
              <Text style={styles.status}>
                {bookingDetails?.status
                  ? capitalizeFirstLetter(bookingDetails?.status)?.replace(
                      '_',
                      ' ',
                    )
                  : null}
              </Text>
            </View>
          </View>
          <Text numberOfLines={1} style={styles.smallText}>
            #{bookingDetails?.booking_number}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#000'}}>Payment Status : </Text>
            <WrapperComponent
              text={bookingDetails?.payment_status}
              color={bookingDetails?.payment_color}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: findHeight(10),
              marginBottom: findHeight(20),
            }}>
            <View style={styles.locationIcon}>
              <Image
                style={{
                  tintColor: colors.defaultWhite,
                  height: findSize(13),
                  width: findSize(9),
                }}
                source={require('src/assets/images/location.svg')}
              />
            </View>
            <Text style={styles.location}>
              {bookingDetails?.user_address?.address}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: findHeight(20),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '50%',
              }}>
              <View style={styles.dateIcon}>
                <Image
                  style={{
                    height: findSize(24),
                    width: findSize(24),
                    tintColor: colors.themeColor,
                  }}
                  source={require('src/assets/images/date-calendar.svg')}
                />
              </View>
              <View>
                <Text style={styles.date}>Date</Text>
                <Text style={styles.dateValue}>
                  {moment(
                    bookingDetails?.booking_time,
                    'YYYY-MM-DD HH:mm:ss',
                  ).format('DD MMM YYYY')}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                alignItems: 'center',
              }}>
              <View style={styles.dateIcon}>
                <Image
                  style={{
                    height: findSize(24),
                    width: findSize(24),
                    tintColor: colors.themeColor,
                  }}
                  source={require('src/assets/images/watch.svg')}
                />
              </View>
              <View>
                <Text style={styles.date}>Time</Text>
                <Text style={styles.dateValue}>
                  {moment(
                    bookingDetails?.booking_time,
                    'YYYY-MM-DD HH:mm:ss',
                  ).format('hh:mm A')}
                </Text>
              </View>
            </View>
          </View>
          <Text numberOfLines={1} style={styles.summary}>
            Booking Summary
          </Text>

          {bookingDetails?.details?.map((serviceGroup, index) => (
            <View key={serviceGroup.service_group_id}>
              <View style={styles.group}>
                <Text numberOfLines={2} style={styles.serviceGroup}>
                  {serviceGroup?.service_group_name}
                </Text>
              </View>
              {serviceGroup?.services?.map((service, i) => (
                <View key={service.id}>
                  <View style={styles.serviceContainer}>
                    <Text numberOfLines={2} style={styles.service}>
                      {service?.name}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{
                          height: findSize(13),
                          width: findSize(6),
                          marginEnd: findSize(1),
                          tintColor: colors.appGray,
                        }}
                        source={require('src/assets/images/price.svg')}
                      />
                      <Text style={styles.price}>{service?.price}</Text>
                    </View>
                  </View>
                  {service?.comment?.length ? (
                    <>
                      <Text
                        style={{
                          fontSize: findSize(10),
                          color: colors.themeColor,
                          fontFamily: fonts.Montserrat_SemiBold,
                          marginHorizontal: 10,
                          marginTop: findSize(6),
                        }}>
                        Special Instructions:
                      </Text>
                      <Text
                        style={{
                          fontSize: findSize(10),
                          color: colors.appGray,
                          fontFamily: fonts.Montserrat_Regular,
                          marginHorizontal: 10,
                          marginTop: findSize(3),
                        }}>
                        {service?.comment}
                      </Text>
                    </>
                  ) : null}
                </View>
              ))}
            </View>
          ))}

          <View style={[styles.priceConatiner]}>
            <Text style={[styles.cartText]}>Total</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  height: findSize(13),
                  width: findSize(6),
                  marginEnd: findSize(1),

                  tintColor: colors.defaultBlack,
                }}
                source={require('src/assets/images/price.svg')}
              />
              <Text style={[styles.cartText]}>{bookingDetails?.price}</Text>
            </View>
          </View>

          <View style={{marginTop: 10}}>
            <Text numberOfLines={1} style={styles.summary}>
              Cleaner Details
            </Text>
            {bookingDetails?.service_provider?.first_name ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <FontAwesome5
                  name="user-cog"
                  color={colors.appGray}
                  size={14}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    {
                      color: colors.appGray,
                      marginStart: 5,
                      fontFamily: fonts.Montserrat_Regular,
                      fontSize: 13,
                    },
                  ]}>
                  {`${bookingDetails?.service_provider?.first_name} ${bookingDetails?.service_provider?.last_name}`}
                </Text>
              </View>
            ) : (
              <Text
                numberOfLines={1}
                style={[
                  {
                    color: colors.appGray,
                    marginTop: 5,
                    fontFamily: fonts.Montserrat_Regular,
                    fontSize: 13,
                  },
                ]}>
                Not assign yet
              </Text>
            )}
            {/* {bookingDetails?.service_provider?.email?.length ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom : 10,
                  }}>
                  <FontAwesome5 name="at" color={colors.appGray} size={14} />
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        color: colors.appGray,
                        marginStart: 5,
                        fontFamily: fonts.Montserrat_Regular,
                        fontSize: 13,
                      },
                    ]}>
                    {`${bookingDetails?.service_provider?.email}`}
                  </Text>
                </View>
              ) : null} */}
          </View>

          {bookingDetails?.further_suggestion?.length ? (
            <View
              style={{
                marginBottom: 10,
              }}>
              <>
                <Text
                  style={{
                    fontSize: findSize(10),
                    color: colors.themeColor,
                    fontFamily: fonts.Montserrat_SemiBold,

                    marginTop: findSize(6),
                  }}>
                  Further Suggestion:
                </Text>
                <Text
                  style={{
                    fontSize: findSize(11),
                    color: colors.appGray,
                    fontFamily: fonts.Montserrat_Regular,

                    marginTop: findSize(3),
                  }}
                  numberOfLines={readMore ? null : 3}>
                  {bookingDetails?.further_suggestion}
                </Text>
                {bookingDetails?.further_suggestion?.length > 200 ? (
                  <CustomButton
                    onPress={() => {
                      setReadMore(prev => !prev);
                    }}>
                    <Text
                      style={{
                        color: colors.themeColor,
                        fontSize: findSize(10),

                        fontFamily: fonts.Montserrat_Medium,
                      }}>
                      {readMore ? 'Read less' : 'Read more'}
                    </Text>
                  </CustomButton>
                ) : null}
              </>
            </View>
          ) : null}

          {bookingDetails?.status === 'completed' &&
            bookingDetails?.payment_status === 'Pending' && (
              <BouncyCheckbox
                size={20}
                onPress={() => setServiceStatus(!serviceStatus)}
                text="I confirm that my service is completed"
                style={{marginTop: 20}}
                iconStyle={{
                  borderColor: colors?.themeColor,
                  backgroundColor: serviceStatus
                    ? colors?.themeColor
                    : colors?.defaultWhite,
                  color: colors?.defaultWhite,
                }}
                textStyle={{textDecorationLine: 'none'}}
              />
            )}

          {bookingDetails?.status === 'completed' &&
          bookingDetails?.payment_status === 'Pending' ? (
            <CustomButton
              disabled={buttonLoading || !serviceStatus}
              type={serviceStatus ? 1 : 3}
              onPress={() => {
                handlePay();
              }}
              isLoading={buttonLoading}
              title={'Pay'}
              style={{
                marginVertical: findHeight(25),
                marginBottom: findHeight(15),
                backgroundColor: serviceStatus
                  ? colors?.themeColor
                  : colors?.appGray2,
              }}
            />
          ) : null}
          {bookingDetails?.status === 'completed' ? (
            <CustomButton
              type={1}
              onPress={() => {
                downloadFile({
                  path: bookingDetails?.invoice_pdf,
                  type: 'pdf',
                  name: bookingDetails?.invoice_pdf.split('/')?.pop(),
                });
              }}
              title="Download Invoice"
              style={{marginBottom: findHeight(25)}}
            />
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: findHeight(15),
  },
  cartText: {
    color: colors.defaultBlack,
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Bold,
  },
  image: {
    height: findSize(50),
    width: findSize(50),
    borderRadius: findSize(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.appGray1,
  },
  name: {
    color: colors.appGray,
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Regular,
    marginTop: findHeight(10),
  },
  smallText: {
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: findSize(23),
    color: colors.defaultBlack,
    marginVertical: findSize(5),
  },
  heading: {
    color: colors.appGray,
    fontSize: findSize(13),
    fontFamily: fonts.Montserrat_Regular,
    marginVertical: findHeight(5),
    marginTop: findHeight(20),
  },
  statusContainer: {
    backgroundColor: colors.appYellow,
    height: findHeight(16),
    width: findSize(70),
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
    textAlignVertical: 'center',
  },
  statusIcon: {
    backgroundColor: colors.defaultWhite,
    position: 'absolute',
    height: findSize(16),
    width: findSize(16),
    borderRadius: findSize(8),
    tintColor: colors.appYellow,
    justifyContent: 'center',
    left: -findSize(8),
  },
  locationIcon: {
    backgroundColor: colors.themeColor,
    height: findSize(22),
    width: findSize(22),
    borderRadius: findSize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    fontSize: findSize(13),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.defaultBlack,
    marginStart: findSize(10),
    flex: 1,
  },
  dateIcon: {
    height: findSize(50),
    width: findSize(50),
    borderRadius: findSize(26),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.themeColor,
    borderWidth: 1,
    marginEnd: findSize(10),
  },
  date: {
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Regular,
    color: colors.appGray,
  },
  dateValue: {
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.defaultBlack,
  },
  summary: {
    fontSize: findSize(12),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.themeColor,
  },
  serviceGroup: {
    fontSize: findSize(13),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultWhite,
  },
  price: {
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Medium,
    color: colors.appGray,
  },
  group: {
    backgroundColor: colors.themeColor,
    justifyContent: 'center',
    padding: findSize(15),
    borderRadius: findSize(5),
    marginVertical: findHeight(10),
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: findSize(10),
    paddingBottom: 1,
  },
  service: {
    color: colors.appGray,
    fontSize: findSize(12),
    fontFamily: fonts.Montserrat_Regular,
    flex: 1,
  },
  priceConatiner: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: colors.appGray,
    marginTop: findSize(20),
    paddingTop: findSize(10),
    borderTopWidth: 1,
    marginHorizontal: findSize(10),
  },
});
