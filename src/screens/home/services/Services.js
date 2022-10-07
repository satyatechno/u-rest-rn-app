import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import CustomButton from 'src/components/customButton/CustomButton';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import {findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import assistant from 'react-native-vector-icons/MaterialIcons';

const Services = ({data = [], navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Services</Text>
        {data?.length > 4 ? (
          <CustomButton
            type={1}
            style={styles.button}
            title={'See All'}
            textStyle={{fontSize: findSize(12)}}
            onPress={() => {
              navigation?.navigate('ServiceStack');
            }}
          />
        ) : null}
      </View>
      <View style={styles.serviceContainer}>
        {data?.slice(0, 4)?.map(item => (
          <CustomButton
            onPress={() => {
              navigation?.navigate('ServiceDetails', {
                service_id: item?.id,
              });
            }}
            key={item?.id?.toString()}
            style={styles.service}>
            <View
              style={{
                alignSelf: 'center',
                paddingBottom: 25,
              }}>
              <ImageComponent
                source={{
                  uri: item?.image,
                }}
                style={{
                  height: findSize(40),
                  width: findSize(40),
                }}
                resizeMode={'cover'}
              />
            </View>
            <View style={styles.serviceTextContaner}></View>
            <View
              style={[
                styles.serviceTextContaner,
                {
                  backgroundColor: 'trasparent',
                  opacity: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                },
              ]}>
              <Text
                numberOfLines={2}
                style={[styles.serviceText, {color: colors.appGreen}]}>
                {item?.name}
              </Text>
            </View>
          </CustomButton>
        ))}
      </View>
    </View>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    marginBottom: findHeight(20),
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
    height: findSize(110),
    width: findSize(178),
    borderRadius: findSize(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: findHeight(10),
    overflow: 'hidden',
  },
  serviceText: {
    fontSize: findSize(10),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultWhite,
    // marginTop: findHeight(10),
    marginHorizontal: 15,
    textAlign: 'center',
    // position: 'absolute',
    // bottom: Platform.OS === 'android' ? 0 : 0,
    // backgroundColor: colors.themeColor,
    width: '100%',
    // minHeight: findHeight(3),
    textAlignVertical: 'center',
    opacity: 1,
  },
  serviceTextContaner: {
    fontSize: findSize(10),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.defaultWhite,
    // marginTop: findHeight(10),
    marginHorizontal: findSize(10),
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    // backgroundColor: colors.themeColor,
    width: '100%',
    minHeight: findHeight(42),
    textAlignVertical: 'center',
    opacity: 0.7,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
