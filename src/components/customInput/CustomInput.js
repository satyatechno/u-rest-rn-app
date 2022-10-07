import React, {forwardRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from 'src/styles/colors/colors';
import * as Animatable from 'react-native-animatable';
import {DEVICE_WIDTH, findHeight, findSize} from 'src/helper/helper';
import fonts from 'src/styles/texts/fonts';
import CountryModal from '../countryModal/CountryModal';
// import CountryPicker from 'react-native-country-picker-modal';
const CustomInput = forwardRef(
  (
    {
      containerStyle,
      onChangeText,
      value,
      inputStyle,
      title,
      titleStyle,
      placeholder,
      keyboardType,
      error,
      errorStyle,
      mainContainerStyle,
      icon,
      isTouchable = false,
      onPress = () => {},
      editable = true,
      countryPick = false,
      countryCode = 'IN',
      onCountrySelect,
      placeholderTextColor,
      ...rest
    },
    ref,
  ) => {
    return (
      <View style={mainContainerStyle}>
        {title ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={1}
          disabled={!isTouchable}
          onPress={onPress}
          style={[styles.container, containerStyle]}>
          <Image
            resizeMode="contain"
            source={icon}
            style={{
              height: findSize(20),
              width: findSize(20),
              marginLeft: 5,
              tintColor: colors.appGreen,
            }}
          />
          <View style={styles.divider} />
          {countryPick ? (
            <CountryModal onCountrySelect={onCountrySelect} />
          ) : null}
          {editable ? (
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              style={[styles.input, inputStyle]}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor ?? colors.appGray}
              keyboardType={keyboardType ?? 'default'}
              editable={!isTouchable && editable}
              selectionColor={colors.themeColor}
              {...rest}
            />
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TextInput
                ref={ref}
                value={value}
                onChangeText={onChangeText}
                style={[styles.input, inputStyle]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor ?? colors.appGray}
                keyboardType={keyboardType ?? 'default'}
                editable={!isTouchable && editable}
                selectionColor={colors.themeColor}
                {...rest}
              />
            </ScrollView>
          )}
        </TouchableOpacity>
        {error ? (
          <View style={{overflow: 'hidden'}}>
            <Animatable.Text
              animation={'shake'}
              numberOfLines={2}
              style={[styles.error, errorStyle]}>
              {error}
            </Animatable.Text>
          </View>
        ) : null}
      </View>
    );
  },
);

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appGray1,
    height: findHeight(55),
    width: '100%',
    borderRadius: findHeight(28),
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  divider: {
    backgroundColor: colors.appGray2,
    height: findHeight(30),
    width: 1.5,
    marginHorizontal: findSize(10),
  },
  input: {
    color: colors.defaultBlack,
    fontSize: findSize(15),
    flex: 1,
    fontFamily: fonts.Montserrat_Medium,
  },
  title: {
    color: colors.defaultBlack,
    fontSize: findSize(14),
    // fontWeight: 'bold',
    fontFamily: fonts.Montserrat_Medium,
  },
  error: {
    fontSize: findSize(14),
    color: colors.appRed,
    marginLeft: 5,
    maxWidth: DEVICE_WIDTH * 0.82,
    fontFamily: fonts.Montserrat_Medium,
  },
});
