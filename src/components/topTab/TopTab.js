import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import ImageComponent from '../ImageComponent/ImageComponent';

const TopTab = ({data, activeIndex, onChangeIndex}) => {
  return (
    <View style={styles.container}>
      {data?.map((item, index) => (
        <TouchableOpacity
          delayPressIn={0}
          delayPressOut={0}
          key={index?.toString()}
          disabled={index === activeIndex}
          onPress={() => onChangeIndex(index)}
          style={[styles.tab, index === activeIndex && styles.activeTab]}>
          <ImageComponent
            source={require('src/assets/images/check.svg')}
            style={[
              styles.Icon,
              index === activeIndex && {tintColor: colors.defaultWhite},
            ]}
          />
          <Text
            style={[
              styles.text,
              index === activeIndex && {color: colors.defaultWhite},
            ]}>
            {item}
          </Text>
          {index === activeIndex && <View style={styles.triangle} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TopTab;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.defaultWhite,
    width: '100%',
    marginVertical: findHeight(10),
    marginBottom: findHeight(30),
  },
  Icon: {
    height: findSize(30),
    width: findSize(30),
    tintColor: colors.appGray,
    marginVertical: findHeight(10),
  },
  tab: {
    backgroundColor: colors.appGray2,
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH / 2,
    height: findHeight(90),
  },
  activeTab: {
    backgroundColor: colors.themeColor,

    height: findHeight(110),
  },
  text: {
    fontFamily: fonts.Montserrat_Medium,
    color: colors.appGray,
    fontSize: findSize(15),
  },
  triangle: {
    backgroundColor: 'transparent',
    borderTopWidth: 11,
    borderBottomWidth: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderTopColor: colors.themeColor,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    bottom: -10,
  },
});
