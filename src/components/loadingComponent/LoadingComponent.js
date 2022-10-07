import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import colors from 'src/styles/colors/colors';

const LoadingComponent = ({style}) => {
  return (
    <View style={[styles.lodingView, style]}>
      <ActivityIndicator color={colors.themeColor} size={'large'} />
    </View>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({
  lodingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
  },
});
