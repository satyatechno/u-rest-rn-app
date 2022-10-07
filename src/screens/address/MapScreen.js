import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  AppState,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapboxGL, {Logger} from '@react-native-mapbox-gl/maps';
import {MAPBOX_TOKEN} from 'src/helper/credentials';
import colors from 'src/styles/colors/colors';
import axios from 'axios';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import CustomButton from 'src/components/customButton/CustomButton';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import Modal from 'react-native-modal';
import CustomInput from 'src/components/customInput/CustomInput';
import {useMutation} from 'react-query';
import {addAddressApi} from 'src/api/address';
import {useDispatch, useSelector} from 'react-redux';
import {errorToast, successToast} from 'src/utils/toast';
import {
  setManageAddressNavigation,
  setNewAddress,
} from 'src/redux/reducers/userReducer';
import Geolocation from 'react-native-geolocation-service';
import {useFocusEffect} from '@react-navigation/core';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import fonts from 'src/styles/texts/fonts';
import {requestLocationPermission} from 'src/utils/locationPermission';
MapboxGL.setAccessToken(MAPBOX_TOKEN);
// edit logging messages
Logger.setLogCallback(log => {
  const {message} = log;
  // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  console.log('LOGER=======', log);
  return false;
});
const MapScreen = ({navigation, route}) => {
  const TOKEN = useSelector(state => state?.userReducer?.token);
  const {register} = route?.params;
  const [userLocation, setUserLocation] = useState([]);
  const [markerLocation, setMarkerLocation] = useState([]);
  const [userLocationFlag, setUserLocationFlag] = useState(false);
  const [address, setAddress] = useState('');
  const [tag, setTag] = useState('');
  const [error, setError] = useState({});
  const [modalVisible, setmodalVisible] = useState(false);
  const [modalVisible1, setmodalVisible1] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState('');
  const map = useRef();
  const location = useRef();
  const camera = useRef();
  const dispatch = useDispatch();

  const manageLacationPermission = tempCode => {
    Geolocation.getCurrentPosition(
      position => {
        setmodalVisible1(false);
        console.log('geoLocation', position);
        setUserLocation([
          position?.coords?.longitude,
          position?.coords?.latitude,
        ]);
        if (tempCode !== 1) {
          setMarkerLocation([
            position?.coords?.longitude,
            position?.coords?.latitude,
          ]);
        }
        setTimeout(() => {
          camera.current?.setCamera({
            centerCoordinate: [
              position?.coords?.longitude,
              position?.coords?.latitude,
            ],
            zoomLevel: 12,
            animationDuration: 2000,
          });
        }, 500);
        setUserLocationFlag(true);
      },
      error => {
        // See error code charts below.
        console.log('Error code ,Message', error.code, error.message);
        if (error.code === 1) {
          checkLocation();
        }
        if (error.code === 2) {
          Alert.alert('Please turn on device location!');
        }
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
    );
  };

  const checkLocation = React.useCallback(async () => {
    let isLocationPermission = await requestLocationPermission();
    setLocationPermissionGranted(isLocationPermission);
    if (isLocationPermission === 'granted') {
      manageLacationPermission();
      setmodalVisible1(false);
    } else {
      setmodalVisible1(true);
    }
    console.log({isLocationPermission});
  }, [requestLocationPermission]);

  useEffect(() => {
    AppState.addEventListener('change', handleStateChange);
    checkLocation();
  }, []);

  const handleStateChange = React.useCallback(state => {
    console.log('state', state);
    if (state === 'active') {
      checkLocation();
    }
  }, []);

  useEffect(async () => {
    console.log('userLocation', userLocation);
    if (userLocation.length == 2) {
    }
  }, [userLocationFlag]);

  const getAddress = async () => {
    PreventTouch(true, true);
    try {
      const result = await axios(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
          markerLocation?.[0] +
          ',' +
          markerLocation?.[1] +
          '.json?access_token=' +
          MAPBOX_TOKEN,
      );

      console.log('Address: ', result.data?.features[0].place_name);
      setAddress(result.data?.features[0].place_name);
      setmodalVisible(true);
    } catch (error) {
    } finally {
      PreventTouch(false, false);
    }
  };
  const validation = () => {
    let addressError = '';
    let tagError = '';
    if (!address) addressError = 'Required!';
    if (!tag) tagError = 'Required!';

    if (addressError.length || tagError.length) {
      setError({
        ...error,
        address: addressError,
        tag: tagError,
      });
      return false;
    } else {
      setError('');
      return true;
    }
  };
  const {mutate, isLoading} = useMutation(addAddressApi, {
    onSuccess: res => {
      if (res.data?.status) {
        console.log('addresss', res.data);
        successToast(res.data?.message);
        dispatch(setNewAddress(res.data?.data?.address));
        if (register) {
          dispatch(setManageAddressNavigation(false));
          navigation.reset({index: 0, routes: [{name: 'DrawerStack'}]});
        } else {
          navigation?.goBack();
        }
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
  const onSaveAddress = () => {
    const validate = validation();
    if (validate) {
      PreventTouch(true, false);
      mutate({
        data: {
          address: address,
          latitude: markerLocation?.[1],
          longitude: markerLocation?.[0],
          type: tag,
        },
        token: TOKEN,
      });
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{backgroundColor: colors.appGray1}}>
        <CustomButton
          style={{
            marginLeft: findSize(15),
          }}
          onPress={() => {
            navigation?.goBack();
          }}>
          <Image
            source={require('src/assets/images/back-arrow.svg')}
            style={{
              height: findSize(38),
              width: findSize(38),
              borderRadius: findSize(20),
            }}
          />
        </CustomButton>
      </View>
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView
            // styleURL="mapbox://styles/mapbox/satellite-streets-v11"

            zoomEnabled={true}
            // userTrackingMode={true}
            ref={map}
            style={styles.map}
            nativeID="hhhhh"
            onPress={res => {
              setMarkerLocation(res?.geometry?.coordinates);
            }}>
            <MapboxGL.UserLocation
              ref={location}
              showsUserHeadingIndicator={false}
              visible={true}
              // onUpdate={event => {
              //   setUserLocation([
              //     event?.coords?.longitude,
              //     event?.coords?.latitude,
              //   ]);
              //   if (!userLocationFlag) setUserLocationFlag(true);
              // }}
            />
            <MapboxGL.Camera ref={camera} />
            {markerLocation?.length && Platform.OS === 'ios' ? (
              <MapboxGL.PointAnnotation
                selected
                id="marker"
                coordinate={markerLocation}
                draggable={true}
                onDragEnd={event => {
                  setMarkerLocation(event?.geometry?.coordinates);
                }}
                children={
                  <Image
                    resizeMode={'contain'}
                    source={require('src/assets/images/marker.svg')}
                    style={{
                      height: findSize(40),
                      width: findSize(27),
                      marginTop: -findSize(20),
                    }}
                  />
                }
              />
            ) : null}
            {markerLocation?.length && Platform.OS === 'android' ? (
              <MapboxGL.MarkerView
                selected
                id="marker"
                coordinate={markerLocation}
                // draggable={true}
                // onDragEnd={event => {
                //   setMarkerLocation(event?.geometry?.coordinates);
                // }}
                children={
                  <Text
                    style={{
                      alignSelf: 'center',
                      textAlignVertical: 'center',
                      paddingBottom: 40,
                      lineHeight: 70,
                    }}>
                    <Image
                      resizeMode={'contain'}
                      source={require('src/assets/images/marker.svg')}
                      style={{
                        height: findSize(40),
                        width: findSize(27),
                        marginTop: -findSize(40),
                      }}
                    />
                  </Text>
                }
              />
            ) : null}
          </MapboxGL.MapView>

          {markerLocation?.length > 0 ? (
            <View
              style={{
                position: 'absolute',
                bottom: findHeight(20),
                alignSelf: 'center',
              }}>
              <CustomButton
                onPress={() => {
                  manageLacationPermission(1);
                }}
                style={{
                  height: findSize(32),
                  width: findSize(32),

                  backgroundColor: colors.defaultWhite,
                  borderRadius: findSize(17),
                  elevation: 5,
                  alignSelf: 'flex-end',
                  marginBottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ImageComponent
                  source={require('src/assets/images/current-location.svg')}
                />
              </CustomButton>
              <CustomButton
                type={1}
                title={'Next'}
                onPress={() => getAddress()}
                style={{width: DEVICE_WIDTH * 0.9}}
              />
            </View>
          ) : null}
        </View>
        <Modal
          animationInTiming={500}
          animationOutTiming={300}
          hasBackdrop
          onBackdropPress={() => setmodalVisible(false)}
          onBackButtonPress={() => setmodalVisible(false)}
          style={{margin: 0, justifyContent: 'flex-end'}}
          avoidKeyboard
          isVisible={modalVisible}>
          <View style={styles.modalContainer}>
            <CustomInput
              icon={require('src/assets/images/location.svg')}
              value={address}
              onChangeText={text => setAddress(text)}
              mainContainerStyle={{
                marginBottom: findHeight(15),
                marginTop: findHeight(10),
              }}
              title={'Address'}
              error={error?.address}
            />
            <CustomInput
              icon={require('src/assets/images/tag.svg')}
              value={tag}
              onChangeText={text => setTag(text)}
              mainContainerStyle={{
                marginBottom: findHeight(15),
                marginTop: findHeight(10),
              }}
              title={'Save As'}
              error={error?.tag}
              maxLength={30}
            />
            <CustomButton
              type={1}
              title={'Save Address'}
              onPress={() => onSaveAddress()}
              isLoading={isLoading}
            />
          </View>
        </Modal>
        <Modal
          animationInTiming={500}
          animationOutTiming={300}
          hasBackdrop={false}
          // onBackdropPress={() => setmodalVisible1(false)}
          onBackButtonPress={() => {
            setmodalVisible1(false);
            navigation?.goBack();
          }}
          style={{margin: 0, justifyContent: 'flex-end'}}
          isVisible={modalVisible1}>
          <View style={[styles.modalContainer]}>
            <Text
              style={{
                fontFamily: fonts.Montserrat_Bold,
                fontSize: findSize(20),
                color: colors.defaultBlack,
              }}>
              Location permission
            </Text>
            <Text
              style={{
                fontFamily: fonts.Montserrat_Regular,
                fontSize: findSize(17),
                color: colors.defaultBlack,
              }}>
              Location permission denied, Please grant location permission.{' '}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <CustomButton
                textStyle={{fontSize: findSize(18)}}
                style={{width: DEVICE_WIDTH * 0.44, height: findSize(45)}}
                type={2}
                title={'Cancel'}
                onPress={() => {
                  setmodalVisible1(false);
                  navigation?.goBack();
                }}
                // isLoading={isLoading}
              />
              <CustomButton
                textStyle={{fontSize: findSize(18)}}
                style={{width: DEVICE_WIDTH * 0.44, height: findSize(45)}}
                type={1}
                title={'Open Settings'}
                onPress={() => {
                  setmodalVisible1(false);
                  navigation?.goBack();
                  Linking.openSettings();
                }}
                // isLoading={isLoading}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.defaultWhite,
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: colors.defaultWhite,
    padding: findSize(20),
    paddingTop: findHeight(50),
    borderTopEndRadius: findSize(40),
    borderTopStartRadius: findSize(40),
  },
});
