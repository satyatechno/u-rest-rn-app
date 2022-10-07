import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {findHeight, findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import ImageComponent from '../ImageComponent/ImageComponent';

const EmptyComponent = ({image, text = 'No Data Available'}) => {
  return (
    <View style={styles.container}>
      {image && (
        <ImageComponent
          resizeMode={'contain'}
          source={image}
          style={styles.image}
        />
      )}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
    padding: findSize(15),
  },
  image: {height: findSize(200), width: findSize(200)},
  text: {
    color: colors.defaultBlack,
    fontSize: findSize(20),
    fontFamily: fonts.Montserrat_Regular,
    marginTop: findHeight(20),
    marginHorizontal: findSize(30),
    textAlign: 'center',
  },
});
