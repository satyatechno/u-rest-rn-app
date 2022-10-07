import {useFocusEffect} from '@react-navigation/core';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useMutation} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {notificationList, notificationRead} from 'src/api/serviceBooking';
import CustomButton from 'src/components/customButton/CustomButton';
import Header from 'src/components/header/Header';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import LoadingComponent from 'src/components/loadingComponent/LoadingComponent';
import {PreventTouch} from 'src/components/touchPrevent/TouchPrevent';
import {findHeight, findSize} from 'src/helper/helper';
import {setNotificationCount} from 'src/redux/reducers/userReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
const RenderItem = ({item, onPress}) => {
  // console.log('hhhhhhh', item);
  return (
    <CustomButton
      onPress={onPress}
      key={item?.id?.toString()}
      style={[
        styles.notification,
        item?.read_at === 0 && {
          borderLeftWidth: 3,
          borderLeftColor: colors.themeColor,
        },
      ]}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={[
            styles.title,
            item?.read_at === 0 && {
              fontFamily: fonts.Montserrat_Bold,
              fontSize: findSize(16),
            },
          ]}>
          {item?.title}
        </Text>
        <Text
          style={[
            styles.time,
            item?.read_at === 0 && {
              fontFamily: fonts.Montserrat_Bold,
              fontSize: findSize(10),
            },
          ]}>
          {moment.unix(item?.created_at).format('DD MMM YYYY')}
        </Text>
      </View>
      <Text
        style={[
          styles.description,
          item?.read_at === 0 && {
            fontFamily: fonts.Montserrat_Bold,
            fontSize: findSize(12),
          },
        ]}>
        {item?.message}
      </Text>
    </CustomButton>
  );
};
const ListEmptyComponent = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Image
      resizeMode={'contain'}
      source={require('src/assets/images/no-notification.svg')}
      style={{height: findSize(200), width: findSize(200)}}
    />
    <Text
      style={{
        color: colors.defaultBlack,
        fontSize: findSize(20),
        fontFamily: fonts.Montserrat_Regular,
        marginTop: findHeight(20),
        marginHorizontal: findSize(30),
        textAlign: 'center',
      }}>
      You don’t have any notifications yet.
    </Text>
  </View>
);
const NotificationScreen = ({navigation}) => {
  const token = useSelector(state => state?.userReducer?.token);
  const [notificationData, setNotificationData] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const {mutate, isLoading} = useMutation(notificationList, {
    onSuccess: (res, req) => {
      if (res.data?.status) {
        // console.log('ress notification', res.data.data?.latest);

        if (req.page > 1) {
          setNotificationData([
            ...notificationData,
            ...res.data.data?.previous,
          ]);
          dispatch(setNotificationCount(res.data?.data?.notification_count));
        } else {
          setNotificationData([
            ...res.data.data?.latest,
            ...res.data.data?.previous,
          ]);
          dispatch(setNotificationCount(res.data?.data?.notification_count));
          setTotalPage(res.data.meta?.total_page);
        }
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      setIsRefresh(false);
      setInitialLoading(false);
    },
  });

  useFocusEffect(
    useCallback(() => {
      setInitialLoading(true);
      mutate({token: token, page: 1});
    }, []),
  );
  const loadMore = nextPage => {
    if (totalPage > nextPage) {
      mutate({page: nextPage, token: token});
      setPage(nextPage);
    }
  };
  const READ_NOTIFICATION = useMutation(notificationRead, {
    onSuccess: (res, req) => {
      if (res.data?.status) {
        // console.log('notification read', res.data);
        dispatch(setNotificationCount(res.data?.data?.notification_count));
        navigation?.navigate('BookingDetails', {booking_id: req?.booking_id});
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      PreventTouch(false, false);
    },
  });
  if (isLoading && initialLoading) {
    return (
      <>
        <Header cart={true} location={true} navigation={navigation} />
        <View style={styles.container}>
          <Text style={styles.heading}>Notifications</Text>
          <LoadingComponent />
        </View>
      </>
    );
  }
  return (
    <>
      <Header cart={true} location={true} navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.heading}>Notifications</Text>
        <FlatList
          data={notificationData}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({item, index}) => (
            <RenderItem
              item={item}
              onPress={() => {
                if (item?.read_at == 0) {
                  PreventTouch(true, true);
                  READ_NOTIFICATION.mutate({
                    token: token,
                    notificationId: item?.id,
                    booking_id: item?.booking?.id,
                  });
                } else {
                  navigation?.navigate('BookingDetails', {
                    booking_id: item?.booking?.id,
                  });
                }
              }}
            />
          )}
          keyExtractor={(item, index) => item?.id?.toString()}
          onEndReachedThreshold={0.2}
          onResponderEnd={() => loadMore(page + 1)}
          refreshing={isRefresh}
          onRefresh={() => {
            setIsRefresh(true);
            mutate({token: token, page: 1});
          }}
          ListFooterComponent={
            isLoading && page > 1 ? (
              <ActivityIndicator
                color={colors.themeColor}
                size="small"
                style={{marginVertical: 20}}
              />
            ) : null
          }
        />
      </View>
    </>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultWhite,
    padding: findSize(15),
  },
  notification: {
    backgroundColor: colors.appGray1,
    minHeight: findHeight(60),
    borderRadius: findHeight(15),
    marginVertical: findHeight(10),
    padding: findSize(13),
  },
  title: {
    fontSize: findSize(15),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_SemiBold,
    flex: 1,
  },
  time: {
    fontSize: findSize(10),
    color: colors.appGray,
    fontFamily: fonts.Montserrat_Regular,
  },
  description: {
    fontSize: findSize(12),
    color: colors.appGray,
    fontFamily: fonts.Montserrat_Regular,
    marginTop: findSize(10),
  },
  heading: {
    fontSize: findSize(25),
    color: colors.defaultBlack,
    fontFamily: fonts.Montserrat_SemiBold,
    marginVertical: findSize(20),
  },
});
