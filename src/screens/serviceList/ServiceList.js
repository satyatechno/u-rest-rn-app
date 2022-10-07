import React, {useEffect, useState} from 'react';
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
import {
  getServicesApi,
  searchApiToken,
  searchServicesApi,
} from 'src/api/services';
import CustomButton from 'src/components/customButton/CustomButton';
import CustomInput from 'src/components/customInput/CustomInput';
import Header from 'src/components/header/Header';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import LoadingComponent from 'src/components/loadingComponent/LoadingComponent';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
// import {setServiceData} from 'src/redux/reducers/serviceReducer';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const RenderItem = ({item, onPress}) => {
  return (
    <CustomButton
      onPress={onPress}
      key={item?.id?.toString()}
      style={styles.service}>
      <View style={styles.iconContainer}>
        <ImageComponent
          source={{
            uri: item?.image,
          }}
          style={{
            height: findSize(65),
            width: findSize(61),
          }}
          resizeMode={'cover'}
        />
      </View>
      <View style={styles.middile}>
        <Text numberOfLines={2} style={styles.serviceText}>
          {item?.name}
        </Text>

        <Text numberOfLines={2} style={styles.description}>
          {item?.description}
        </Text>
      </View>
    </CustomButton>
  );
};
const ServiceList = ({navigation}) => {
  // const serviceData = useSelector(state => state?.serviceReducer?.serviceData);
  const skipLogin = useSelector(state => state?.userReducer?.skipLogin);

  const [serviceData, setServiceData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const {mutate, isLoading} = useMutation(getServicesApi, {
    onSuccess: (res, req) => {
      if (res.data?.status) {
        if (req.page > 1) {
          setServiceData([...serviceData, ...res.data?.data?.service_groups]);
        } else {
          setServiceData(res.data?.data?.service_groups);
          setTotalPage(res.data.meta?.total_page);
        }
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
    onSettled: () => {
      setInitialLoading(false);
    },
  });
  useEffect(() => {
    mutate({page: 1});
  }, []);
  const SEARCH = useMutation(searchServicesApi, {
    onSuccess: (res, req) => {
      // console.log('search', res.data);
      if (res.data?.status) {
        setServiceData(res.data?.data?.service_groups);
      }
    },

    onError: error => {
      console.log('rerrr', error?.response?.data);
    },
  });

  const loadMore = nextPage => {
    if (totalPage > nextPage) {
      mutate({page: nextPage});
      setPage(nextPage);
    }
  };
  // useEffect(() => {}, [searchText]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchText) {
        if (searchApiToken !== null) searchApiToken('cancel');
        setTimeout(() => {
          SEARCH.mutate({
            search: searchText,
          });
        }, 100);
      } else mutate({page: 1});
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);
  const searching = text => {
    setSearchText(text);
    // if (text) {
    //   if (searchApiToken !== null) searchApiToken('cancel');
    //   setTimeout(() => {
    //     SEARCH.mutate({
    //       search: text,
    //     });
    //   }, 100);
    // } else mutate({page: 1});
  };
  const ListEmptyComponent = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          color: colors.defaultBlack,
          fontSize: findSize(20),
          fontFamily: fonts.Montserrat_SemiBold,
        }}>
        {!searchText?.length ? 'No Service Available Now.' : 'No Search Found'}
      </Text>
    </View>
  );

  if (isLoading && initialLoading) {
    return (
      <>
        <Header
          navigation={navigation}
          location={!skipLogin}
          notificationButton={!skipLogin}
          cart={!skipLogin}
        />
        <LoadingComponent />
      </>
    );
  }
  return (
    <>
      <Header
        navigation={navigation}
        location={!skipLogin}
        notificationButton={!skipLogin}
        profile={!skipLogin}
        cart={!skipLogin}
      />
      <View
        style={{
          flex: 1,
          padding: findSize(15),
          backgroundColor: colors.defaultWhite,
        }}>
        <View style={{paddingVertical: findHeight(10)}}>
          <CustomInput
            icon={require('src/assets/images/search.svg')}
            value={searchText}
            onChangeText={text => searching(text)}
            placeholder="Search here"
            mainContainerStyle={{
              marginBottom: findHeight(15),
              marginTop: findHeight(10),
            }}
            title={''}
            error={''}
            // maxLength={30}
          />
        </View>
        <FlatList
          data={serviceData}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({item, index}) => (
            <RenderItem
              item={item}
              onPress={() =>
                navigation?.navigate('ServiceDetails', {service_id: item?.id})
              }
            />
          )}
          keyExtractor={(item, index) => item?.id?.toString()}
          onEndReachedThreshold={0.2}
          onResponderEnd={() => loadMore(page + 1)}
          refreshing={refresh}
          onRefresh={() => {
            setSearchText('');
            mutate({page: 1});
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

export default ServiceList;

const styles = StyleSheet.create({
  service: {
    backgroundColor: colors.appGray1,
    // height: findHeight(95),

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
    marginEnd: findSize(5),
  },
  serviceContainer: {},
  iconContainer: {
    backgroundColor: colors.defaultWhite,
    height: findSize(65),
    width: findSize(60),
    borderRadius: findSize(7),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: findHeight(5),
    marginBottom: findHeight(8),
  },

  middile: {
    width: DEVICE_WIDTH * 0.75,
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
    marginTop: findHeight(5),
    marginEnd: findSize(10),
    width: '90%',
  },
});
