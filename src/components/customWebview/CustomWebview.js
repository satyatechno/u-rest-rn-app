import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import WebView from 'react-native-webview';
import colors from 'src/styles/colors/colors';
import Header from '../header/Header';

const CustomWebview = ({route, navigation}) => {
  const {url} = route?.params;
  return (
    <>
      <Header backButton={true} navigation={navigation} />
      <WebView
        source={{uri: url}}
        startInLoadingState={true}
        renderLoading={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor:colors.defaultWhite
            }}>
            <ActivityIndicator size="large" color={colors.themeColor} />
          </View>
        )}
      />
    </>
  );
};

export default CustomWebview;
