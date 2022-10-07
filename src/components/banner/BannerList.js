import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ImageComponent from 'src/components/ImageComponent/ImageComponent';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
const data = [
  {
    id: 1,
    image: require('src/assets/images/slider_1.svg'),
    title: 'Request A Service',
    text: 'Where and when you want a service.',
  },
  {
    id: 2,
    image: require('src/assets/images/slider_2.svg'),
    title: 'Affordable Price',
    text: 'We believe that everyone should be able to afford a professional cleaning service.',
  },
  {
    id: 3,
    image: require('src/assets/images/slider_3.svg'),
    title: 'Security Of Our Customers',
    text: 'We ensure that all our cleaners are properly checked and verified.',
  },
];
const RenderItem = ({item}) => {
  return (
    <View>
      <ImageComponent
        source={item?.image}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};
const BannerList = () => {
  const [activeInex, setAtiveIndex] = useState(0);
  return (
    <View style={{marginTop: findHeight(30)}}>
      <Carousel
        data={data}
        renderItem={({item, index}) => <RenderItem item={item} />}
        keyExtractor={item => item?.id.toString()}
        sliderWidth={DEVICE_WIDTH - findSize(40)}
        itemWidth={DEVICE_WIDTH - findSize(40)}
        slideStyle={{
          backgroundColor: colors.defaultWhite,
          height: findHeight(140),
        }}
        firstItem={0}
        onSnapToItem={pp => {
          setAtiveIndex(pp);
        }}
        inactiveSlideScale={1}
        pagingEnabled={true}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeInex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.activePage}
        inactiveDotStyle={styles.inactivePage}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
        dotContainerStyle={{marginTop: -findHeight(20)}}
      />
    </View>
  );
};

export default BannerList;

const styles = StyleSheet.create({
  paginationContainer: {
    backgroundColor: colors.defaultWhite,
    padding: 0,
    marginTop: 0,
  },
  activePage: {
    width: findSize(13),
    height: findSize(13),
    borderRadius: findSize(7),
    marginHorizontal: -2,
    backgroundColor: colors.themeColor,
    marginBottom: 0,
    paddingBottom: 0,
  },
  inactivePage: {
    width: findSize(13),
    height: findSize(13),
    borderRadius: findSize(7),
    borderWidth: 1,
    borderColor: colors.themeColor,
    backgroundColor: colors.defaultWhite,
  },

  image: {
    height: '100%',
    width: '100%',
  },
});
