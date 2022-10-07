import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {deleteFromCart, fetchCartList} from 'src/api/services';
import CustomButton from 'src/components/customButton/CustomButton';
import EmptyComponent from 'src/components/emptyComponent/EmptyComponent';
import Header from 'src/components/header/Header';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import LoadingComponent from 'src/components/loadingComponent/LoadingComponent';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import {removeCart, setCartData} from 'src/redux/reducers/serviceReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
const RenderItem = ({item, onPress}) => {
  return (
    <View style={styles.service}>
      <View style={styles.iconContainer}>
        <ImageComponent
          source={{uri: item?.image}}
          style={{
            height: findHeight(61),
            width: findSize(59),
          }}
          resizeMode={'cover'}
        />
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.serviceTextContainer}>
          <Text numberOfLines={2} style={styles.serviceText}>
            {item?.service_group_name}
          </Text>
          <CustomButton onPress={onPress} style={styles.deleteContainer}>
            <Image
              source={require('src/assets/images/delete.svg')}
              style={{height: findSize(9), width: findSize(9)}}
              resizeMode="contain"
            />
          </CustomButton>
        </View>
        <View style={styles.itemContainer}>
          <View style={{width: DEVICE_WIDTH * 0.5}}>
            {item?.services?.map(x => (
              <View
                key={x?.id}
                style={[styles.row, {marginBottom: findHeight(5)}]}>
                <Image
                  source={require('src/assets/images/check-circle.svg')}
                  style={styles.check}
                  resizeMode="contain"
                />
                <Text numberOfLines={2} style={styles.itemText}>
                  {x?.name}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.row}>
            <Image
              source={require('src/assets/images/dollar.svg')}
              style={styles.dollar}
              resizeMode="contain"
            />
            <Text style={styles.price}>
              {parseFloat(item?.total_price)?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
const Cart = ({navigation}) => {
  const token = useSelector(state => state?.userReducer?.token);
  const cart = useSelector(state => state?.serviceReducer?.cart);

  const dispatch = useDispatch();
  const {mutate, isLoading} = useMutation(fetchCartList, {
    onSuccess: res => {
      if (res.data?.status) {
        dispatch(setCartData(res.data.data?.cart));
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });
  useFocusEffect(
    useCallback(() => {
      mutate({token: token});
    }, []),
  );
  const REMOVE_CART = useMutation(deleteFromCart, {
    onSuccess: (res, req) => {
      console.log('ress, delete cart', req);
      if (res.data?.status) {
        dispatch(removeCart(req?.group_id));
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      PreventTouch(false, false);
    },
  });
  const onRemove = id => {
    Alert.alert('Remove', 'Are you sure, you want to remove ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          PreventTouch(true, true);
          REMOVE_CART.mutate({token: token, group_id: id});
        },
      },
    ]);
  };
  const FINAL_PRICE = () => {
    let price = 0;
    cart?.cart_items?.forEach(x => {
      price = parseFloat(price) + parseFloat(x?.total_price);
    });
    return price?.toFixed(2);
  };
  if (isLoading && !cart?.cart_items?.length) {
    return (
      <>
        <Header
          navigation={navigation}
          notificationButton={true}
          location={true}
        />
        <LoadingComponent />
      </>
    );
  }
  return (
    <>
      <Header
        navigation={navigation}
        notificationButton={true}
        location={true}
      />
      {cart?.cart_items?.length ? (
        <ScrollView
          style={{flex: 1, backgroundColor: colors.defaultWhite}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.cartText}>Cart</Text>
            {cart?.cart_items?.map(item => (
              <RenderItem
                onPress={() => onRemove(item?.service_group_id)}
                key={item?.service_group_id?.toString()}
                item={item}
              />
            ))}
            <View style={[styles.row, {justifyContent: 'space-between'}]}>
              <Text style={[styles.cartText, {fontSize: findSize(20)}]}>
                Total
              </Text>
              <Text style={[styles.cartText, {fontSize: findSize(20)}]}>
                $ {FINAL_PRICE()}
              </Text>
            </View>
            <CustomButton
              type={1}
              title={'Book Now'}
              onPress={() => navigation?.navigate('BookService')}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.cartText}>Cart</Text>
          <EmptyComponent
            image={require('src/assets/images/no-cart.svg')}
            text={'You haven’t added any cleaning service yet.'}
          />
        </View>
      )}
    </>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.defaultWhite,
    flex: 1,
    padding: findSize(20),
  },
  cartText: {
    color: colors.defaultBlack,
    fontSize: findSize(25),
    fontFamily: fonts.Montserrat_SemiBold,
    marginVertical: findHeight(10),
  },
  service: {
    backgroundColor: colors.appGray1,
    borderRadius: findHeight(15),
    marginVertical: findHeight(10),
    flexDirection: 'row',
    padding: findSize(13),
    // marginHorizontal
  },
  serviceText: {
    fontSize: findSize(15),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultBlack,
    marginTop: -findHeight(3),
    flex: 1,
  },
  itemText: {
    fontSize: findSize(11),
    fontFamily: fonts.Montserrat_Regular,
    color: colors.defaultBlack,
    flex: 1,
  },
  price: {
    fontSize: findSize(12),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultBlack,
  },
  iconContainer: {
    backgroundColor: colors.defaultWhite,
    height: findHeight(58),
    width: findSize(56),
    borderRadius: findSize(7),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  deleteContainer: {
    height: findSize(23),
    width: findSize(23),
    borderRadius: findSize(13),
    borderWidth: findSize(1),
    borderColor: colors.lightRed,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.appRed,
    marginTop: -2,
  },
  detailContainer: {
    width: DEVICE_WIDTH * 0.67,
    marginStart: findSize(8),
  },
  serviceTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: findHeight(5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    height: findSize(12),
    width: findSize(12),
    marginEnd: findSize(10),
    tintColor: colors.themeColor,
  },
  dollar: {
    height: findSize(14),
    width: findSize(14),
    marginEnd: findSize(5),
    tintColor: colors.themeColor,
  },
});
