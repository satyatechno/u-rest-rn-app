import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from 'src/styles/colors/colors';

const WrapperComponent = ({text, color}) => {
  return (
    <View style={[styles.wc_main_container, {backgroundColor: color}]}>
      <Text
        style={{
          color: '#fff',
          textTransform: 'capitalize',
          fontSize: 10,
          marginTop: -1,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default WrapperComponent;

const styles = StyleSheet.create({
  wc_main_container: {
    marginHorizontal: 2,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
