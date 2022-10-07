import {useFocusEffect} from '@react-navigation/core';
import {StackActions} from '@react-navigation/routers';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {addToCartApi, getServicesDetailApi} from 'src/api/services';
import CustomButton from 'src/components/customButton/CustomButton';
import Header from 'src/components/header/Header';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import {addCart} from 'src/redux/reducers/serviceReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {errorToast, successToast} from 'src/utils/toast';
import * as Animatable from 'react-native-animatable';

const RenderItem = ({item, isSelected, onSelect, onChangetext, value}) => {
  // console.log('serviveee', JSON.stringify(item, null, 2));
  const [animate, setAnimate] = useState(false);

  return (
    <View
      style={{
        backgroundColor: colors.appGray1,
        borderRadius: findSize(15),
        padding: findSize(15),
        marginVertical: findHeight(7),
      }}>
      {!item?.available_at_location ? (
        animate ? (
          <Animatable.Text
            iterationCount={1}
            animation={'shake'}
            style={[
              styles.description,
              {
                color: colors.appRed,
                marginBottom: findSize(5),
                marginTop: findSize(0),
              },
            ]}>
            This service is not available at your location
          </Animatable.Text>
        ) : (
          <Text
            style={[
              styles.description,
              {
                color: colors.appRed,
                marginBottom: findSize(5),
                marginTop: findSize(0),
              },
            ]}>
            This service is not available at your location
          </Text>
        )
      ) : null}
      {item?.special_note?.length ? (
        <Text
          style={[
            styles.description,
            {
              color: colors.themeColor,
              marginBottom: findSize(8),
              marginTop: findSize(0),
            },
          ]}>
          Note : {item?.special_note}
        </Text>
      ) : null}
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={styles.heading}>{item?.name}</Text>
        <CustomButton
          // disabled={!item?.available_at_location}
          onPress={() => {
            if (item?.available_at_location) onSelect();
            else {
              setAnimate(true);
              setTimeout(() => {
                setAnimate(false);
              }, 1000);
            }
          }}
          style={styles.iconContainer}>
          {isSelected && <View style={styles.icon} />}
        </CustomButton>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.row}>
          <Image
            style={{marginEnd: findSize(5), tintColor: colors.themeColor}}
            source={require('src/assets/images/dollar.svg')}
          />
          <Text style={styles.dollarText}>{item?.price}</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={{marginEnd: findSize(2), tintColor: colors.themeColor}}
            source={require('src/assets/images/clock.svg')}
          />
          <Text style={styles.timeText}>
            {' '}
            {item?.time_to_complete} Hour(s)
            <Text
              style={{
                fontSize: findSize(9),
                color: colors.appGray,
                fontFamily: fonts.Montserrat_Regular,
                textAlignVertical: 'center',
              }}>
              (Approx.)
            </Text>
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{item?.description}</Text>
      {isSelected ? (
        <TextInput
          value={value}
          onChangeText={onChangetext}
          style={{
            backgroundColor: colors.defaultWhite,
            paddingHorizontal: findSize(15),
            borderRadius: findHeight(25),
            minHeight: findHeight(45),
            color: colors?.defaultBlack,
          }}
          placeholder="Special Instructions (Optional)"
          placeholderTextColor={colors.appGray}
        />
      ) : null}
    </View>
  );
};
const ServiceDetails = ({navigation, route}) => {
  const skipLogin = useSelector(state => state?.userReducer?.skipLogin);
  const token = useSelector(state => state?.userReducer?.token);
  const cart = useSelector(state => state?.serviceReducer?.cart);

  const {service_id} = route?.params;
  const [service, setService] = useState();
  const [selectedServices, setSelectedServices] = useState([]);

  const dispatch = useDispatch();

  const {mutate, isLoading} = useMutation(getServicesDetailApi, {
    onSuccess: res => {
      if (res.data?.status) {
        setService(res.data?.data?.service_group);
        let Temp = [];
        if (cart?.cart_items?.length) {
          [...cart?.cart_items].forEach(group => {
            if (group?.service_group_id === res.data?.data?.service_group?.id) {
              [...group?.services]?.forEach(data => {
                [...res.data?.data?.service_group?.services]?.forEach(x => {
                  if (x?.id === data?.id) {
                    Temp.push({id: data?.id, description: data?.comment});
                  }
                });
              });
            }
          });
        }
        setTimeout(() => {
          setSelectedServices([...Temp]);
        }, 500);
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });
  useFocusEffect(
    useCallback(() => {
      if (service_id) mutate({service_id: service_id, token: token});
    }, []),
  );

  const onPressServive = ID => {
    if (selectedServices?.findIndex(x => x?.id === ID) !== -1) {
      setSelectedServices(selectedServices?.filter(x => x?.id !== ID));
    } else {
      setSelectedServices([...selectedServices, {id: ID, description: ''}]);
    }
  };
  const onChangeServiceText = (ID, text) => {
    if (selectedServices?.findIndex(x => x?.id === ID) !== -1) {
      setSelectedServices([
        ...selectedServices?.map(x => {
          if (x?.id === ID) {
            x.description = text;
          }
          return x;
        }),
      ]);
    }
  };
  const ADD_TO_CART = useMutation(addToCartApi, {
    onSuccess: res => {
      if (res.data?.status) {
        successToast(res.data?.message);
        // console.log('Response', res.data?.data);
        setSelectedServices([]);
        navigation.dispatch(StackActions.push('DrawerStack', {screen: 'Cart'}));
        dispatch(addCart(res.data?.data?.cart));
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
  const onAdd = () => {
    if (selectedServices?.length) {
      PreventTouch(true, false);
      ADD_TO_CART.mutate({
        data: {
          service_group_id: service?.id,
          services: selectedServices,
        },
        token: token,
      });
    } else {
      errorToast('Please add atleast one service.');
    }
  };
  if (isLoading) {
    return (
      <>
        <Header backButton={true} navigation={navigation} />
        <View style={styles.lodingView}>
          <ActivityIndicator color={colors.themeColor} size={'large'} />
        </View>
      </>
    );
  }

  return (
    <>
      <Header backButton={true} navigation={navigation} />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' && 'padding'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          {/* <View style={{flexDirection: 'row'}}> */}
          <Text numberOfLines={3} style={styles.serviceTitle}>
            {service?.name}
          </Text>
          <View style={styles.imageContainer}>
            <ImageComponent
              source={{
                uri: service?.image,
              }}
              style={styles.imageContainer}
              resizeMode={'contain'}
            />
          </View>
          {/* <View>
            <View style={styles.middile}>
              <Text numberOfLines={3} style={styles.serviceTitle}>
                {service?.name}
              </Text>
            </View>
          </View> */}
          {/* </View> */}
          <Text style={styles.description}>{service?.description}</Text>
          <Text style={styles.heading}>Choose Your Services</Text>
          <View style={{paddingTop: findHeight(15)}}>
            {service?.services?.some(x => x?.available_at_location) ? (
              service?.services?.map(item => {
                if (item?.available_at_location)
                  return (
                    <RenderItem
                      item={item}
                      key={item?.id}
                      isSelected={
                        selectedServices?.findIndex(x => x?.id === item?.id) !==
                        -1
                      }
                      onSelect={() => onPressServive(item?.id)}
                      onChangetext={text => onChangeServiceText(item?.id, text)}
                      value={
                        selectedServices?.find(x => x?.id === item?.id)
                          ?.description
                      }
                    />
                  );
              })
            ) : (
              <Text style={styles.noData}>No services available.</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: colors.defaultWhite,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}>
        <CustomButton
          type={1}
          onPress={() => {
            if (skipLogin) {
              navigation?.navigate('LoginAlert');
            } else {
              onAdd();
            }
          }}
          title={'Add To Cart'}
          style={{
            marginBottom: findHeight(10),
          }}
          isLoading={ADD_TO_CART.isLoading}
        />
      </View>
    </>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  noData: {
    fontSize: findSize(16),
    fontFamily: fonts.Montserrat_Regular,
    color: colors.defaultBlack,
    marginTop: findHeight(30),
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
    padding: findSize(20),
  },
  service: {
    backgroundColor: colors.appGray1,
    height: findSize(110),
    width: findSize(110),
    borderRadius: findSize(38),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: findHeight(10),
  },
  serviceText: {
    fontSize: findSize(10),
    fontFamily: fonts.Montserrat_Regular,
    color: colors.defaultBlack,
    marginTop: findHeight(10),
    textAlign: 'center',
    marginHorizontal: findSize(2),
  },
  middile: {
    width: DEVICE_WIDTH * 0.6,
    paddingHorizontal: findSize(10),
    paddingTop: findHeight(10),
    marginHorizontal: findSize(10),
  },
  dollarText: {
    fontSize: findSize(12),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_SemiBold,
    marginEnd: findSize(10),
  },
  timeText: {
    fontSize: findSize(12),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_SemiBold,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: findHeight(5),
  },
  serviceTitle: {
    fontSize: findSize(20),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultBlack,
    // marginBottom: findHeight(20),
  },
  description: {
    fontSize: findSize(11),
    fontFamily: fonts.Montserrat_Regular,
    color: colors.defaultBlack,
    marginBottom: findHeight(15),
    lineHeight: findHeight(17),
  },
  lodingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
  },
  heading: {
    fontSize: findSize(13),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_SemiBold,
    flex: 1,
  },
  iconContainer: {
    height: findSize(18),
    width: findSize(18),
    borderRadius: 2,
    backgroundColor: colors.defaultWhite,

    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: findSize(6),
    width: findSize(6),
    backgroundColor: colors.themeColor,
  },
  imageContainer: {
    height: findHeight(110),
    width: findHeight(110),
    // marginBottom: findHeight(10),
    marginVertical: findSize(15),
    borderRadius: findSize(15),
    alignSelf: 'center',
  },
});
