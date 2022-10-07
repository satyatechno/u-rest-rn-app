import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {getAddressApi, setPrimaryAddress} from 'src/api/address';
import CustomButton from 'src/components/customButton/CustomButton';
import EmptyComponent from 'src/components/emptyComponent/EmptyComponent';
import Header from 'src/components/header/Header';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import {setCartData} from 'src/redux/reducers/serviceReducer';
import {
  setAddressAsPrimary,
  setAddressData,
} from 'src/redux/reducers/userReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {successToast} from 'src/utils/toast';
const RenderItem = ({item, onPress, primary}) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: findHeight(10)}}>
      <CustomButton
        onPress={onPress}
        disabled={item.id == primary}
        style={styles.iconContainer}>
        {item.id == primary && <View style={styles.icon} />}
      </CustomButton>
      <CustomButton onPress={onPress} disabled={item.id == primary}>
        <Text numberOfLines={1} style={styles.tag}>
          {item?.type}
        </Text>
        <Text numberOfLines={3} style={styles.adrress}>
          {item?.address}
        </Text>
      </CustomButton>
    </View>
  );
};
const AddressList = ({navigation}) => {
  const token = useSelector(state => state?.userReducer?.token);
  const addressData = useSelector(state => state?.userReducer?.addressData);
  const primaryAddress = useSelector(
    state => state?.userReducer?.primaryAddress,
  );
  const [primary, setPrimary] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    if (primaryAddress) setPrimary(primaryAddress?.id);
  }, [primaryAddress]);
  const ADDRESS = useMutation(getAddressApi, {
    onSuccess: res => {
      if (res.data?.status) {
        console.log(
          'Address',
          JSON.stringify(res.data?.data?.addresses, null, 2),
        );
        dispatch(setAddressData(res.data?.data?.addresses));
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });
  const SET_PRIMARY = useMutation(setPrimaryAddress, {
    onSuccess: res => {
      if (res.data?.status) {
        successToast('Set as primary');
        dispatch(setAddressAsPrimary(res.data?.data?.address?.id));
        dispatch(setCartData([]));
        navigation?.goBack();
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      PreventTouch(false, false);
    },
  });
  useEffect(() => {
    ADDRESS?.mutate({token: token});
  }, []);
  if (ADDRESS.isLoading) {
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
      <View style={{flex: 1, backgroundColor: colors.defaultWhite}}>
        <Text style={styles.myAddress}>My Address</Text>
        <View style={{flex: 1}}>
          <FlatList
            data={addressData}
            renderItem={({item, index}) => (
              <RenderItem
                item={item}
                primary={primary}
                onPress={() => setPrimary(item?.id)}
              />
            )}
            keyExtractor={(item, index) => index?.toString()}
            style={{
              paddingHorizontal: findSize(20),
              paddingVertical: findHeight(10),
            }}
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={
              <EmptyComponent
                image={require('src/assets/images/no-address.svg')}
                text={'You haven’t added any address yet.'}
              />
            }
          />
        </View>
        {addressData?.length ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: findSize(20),
              marginVertical: findHeight(20),
            }}>
            <CustomButton
              disabled={primary === primaryAddress?.id}
              style={{width: DEVICE_WIDTH * 0.44, height: findSize(55)}}
              type={1}
              title={'Set Address'}
              textStyle={{fontSize: findSize(16)}}
              onPress={() => {
                Alert.alert(
                  'Alert',
                  'Changing address will cause to empty your cart. Would you like to continue?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                      onPress: () => {},
                    },
                    {
                      text: 'OK',
                      style: 'default',
                      onPress: () => {
                        PreventTouch(true, true);
                        SET_PRIMARY?.mutate({
                          address_id: primary,
                          token: token,
                        });
                      },
                    },
                  ],
                );
              }}
            />
            <CustomButton
              style={{width: DEVICE_WIDTH * 0.44, height: findSize(55)}}
              type={2}
              title={'Add New Address'}
              textStyle={{fontSize: findSize(16)}}
              onPress={() =>
                navigation?.navigate('MapScreen', {register: false})
              }
            />
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: findSize(15),
              marginVertical: findHeight(20),
            }}>
            <CustomButton
              style={{}}
              type={1}
              title={'Add Address'}
              textStyle={{fontSize: findSize(16)}}
              onPress={() =>
                navigation?.navigate('MapScreen', {register: false})
              }
            />
          </View>
        )}
      </View>
    </>
  );
};

export default AddressList;

const styles = StyleSheet.create({
  myAddress: {
    color: colors.defaultBlack,
    fontSize: findSize(24),
    fontFamily: fonts.Montserrat_SemiBold,
    margin: findHeight(20),
  },
  adrress: {
    color: colors.appGray,
    fontSize: findSize(14),
    fontFamily: fonts.Montserrat_Regular,
    marginVertical: findHeight(5),
    width: DEVICE_WIDTH * 0.8,
  },
  tag: {
    color: colors.defaultBlack,
    fontSize: findSize(17),
    fontFamily: fonts.Montserrat_SemiBold,
    marginTop: -2,
  },
  iconContainer: {
    height: findSize(17),
    width: findSize(17),
    borderRadius: findSize(2),
    borderWidth: 1,
    borderColor: colors.appGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: findSize(10),
    marginTop: findHeight(2),
  },
  icon: {
    height: findSize(6),
    width: findSize(6),
    backgroundColor: colors.themeColor,
  },
  lodingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
  },
});
