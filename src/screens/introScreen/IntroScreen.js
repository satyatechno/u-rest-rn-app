import React, {useRef, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useDispatch} from 'react-redux';
import CustomButton from 'src/components/customButton/CustomButton';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import {DEVICE_WIDTH, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const data = [
  {
    id: 1,
    image: require('src/assets/images/introduction_1.svg'),
    title: 'Request A Service',
    text: 'Where and when you want a service.',
  },
  {
    id: 2,
    image: require('src/assets/images/introduction_2.svg'),
    title: 'Affordable Price',
    text: 'Affordable professional maintenance.',
  },
  {
    id: 3,
    image: require('src/assets/images/introduction_3.svg'),
    title: 'A Seamless Experience',
    text: 'Seamlessly schedule your property maintenance needs.',
  },
];
const RenderItem = ({item}) => {
  return (
    <View style={{backgroundColor: colors.defaultWhite, alignItems: 'center'}}>
      <ImageComponent
        source={item?.image}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.titleText}>{item?.title}</Text>
      <Text style={styles.detailText}>{item?.text}</Text>
    </View>
  );
};
const IntroScreen = ({navigation}) => {
  const [activeInex, setAtiveIndex] = useState(0);
  const carousel = useRef();
  const dispatch = useDispatch();
  return (
    <>
      <StatusBar
        backgroundColor={colors.defaultWhite}
        barStyle={'dark-content'}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: colors.defaultWhite}}>
        <View style={styles.container}>
          <CustomButton
            style={styles.skipButton}
            onPress={() => {
              // dispatch(setIntroStatus(false));
              navigation?.navigate('Welcome');
            }}>
            <Text style={styles.skipText}>Skip</Text>
          </CustomButton>
          <View style={{flex: 1}}>
            <Carousel
              ref={carousel}
              data={data}
              renderItem={({item, index}) => <RenderItem item={item} />}
              keyExtractor={item => item?.id.toString()}
              sliderWidth={DEVICE_WIDTH}
              itemWidth={DEVICE_WIDTH}
              slideStyle={{backgroundColor: colors.defaultWhite}}
              firstItem={0}
              onSnapToItem={pp => {
                setAtiveIndex(pp);
              }}
              inactiveSlideScale={1}
              scrollEnabled={true}
            />
            <Pagination
              dotsLength={data.length}
              activeDotIndex={activeInex}
              containerStyle={styles.paginationContainer}
              dotStyle={styles.activePage}
              inactiveDotStyle={styles.inactivePage}
              inactiveDotOpacity={1}
              inactiveDotScale={1}
            />
          </View>
          <View
            style={{
              ...styles.buttonContainer,
              justifyContent: activeInex ? 'space-between' : 'flex-end',
            }}>
            <CustomButton
              style={{
                ...styles.nextButton,
                display: activeInex === 0 ? 'none' : 'flex',
                borderColor: colors.appGreen,
              }}
              type={2}
              textStyle={{color: colors.appGreen}}
              onPress={() => {
                carousel.current?.snapToPrev();
              }}
              title="Prev"
            />
            <CustomButton
              style={[
                styles.nextButton,
                {backgroundColor: colors.appGreen},
                // {width: activeInex === data?.length - 1 ? '80%' : '30%'},
              ]}
              type={1}
              onPress={() => {
                if (activeInex === data?.length - 1) {
                  // dispatch(setIntroStatus(false));
                  navigation?.navigate('Welcome');
                } else carousel.current?.snapToNext();
              }}
              title={'Next'}
              // activeInex === data?.length - 1 ? 'Get Started' :
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.defaultWhite},
  skipText: {
    fontSize: findSize(21),
    fontFamily: fonts.Montserrat_SemiBold,
    color: colors.appGreen,
  },
  skipButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginEnd: findSize(10),
    marginTop: findSize(10),
    marginBottom: findSize(5),
  },
  paginationContainer: {
    backgroundColor: colors.defaultWhite,
    padding: 0,
    marginTop: 0,
  },
  activePage: {
    width: findSize(14),
    height: findSize(14),
    borderRadius: findSize(7),
    marginHorizontal: -2,
    backgroundColor: colors.appGreen,
    marginBottom: 0,
    paddingBottom: 0,
  },
  inactivePage: {
    width: findSize(14),
    height: findSize(14),
    borderRadius: findSize(7),
    borderWidth: 1,
    borderColor: colors.appGreen,
    backgroundColor: colors.defaultWhite,
  },
  nextButton: {
    height: findSize(40),
    width: '30%',
  },
  buttonContainer: {
    flexDirection: 'row',

    paddingHorizontal: findSize(20),
  },
  detailText: {
    color: colors.defaultBlack,
    fontSize: findSize(21),
    fontFamily: fonts.Montserrat_Regular,
    textAlign: 'center',
    marginHorizontal: findSize(20),
    // marginTop: findSize(10),
  },
  titleText: {
    color: colors.defaultBlack,
    fontSize: findSize(24),
    fontFamily: fonts.Montserrat_Bold,
    textAlign: 'center',
    marginHorizontal: findSize(20),
    marginVertical: findSize(10),
  },
  image: {
    height: 350,
    width: DEVICE_WIDTH - 60,
    borderRadius: 20,
  },
});
