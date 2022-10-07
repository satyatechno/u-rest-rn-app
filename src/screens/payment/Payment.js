import {StyleSheet, Text, ActivityIndicator, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import WebView from 'react-native-webview';
import colors from 'src/styles/colors/colors';
import {useSelector, useDispatch} from 'react-redux';
import {errorToast, infoToast, successToast} from 'src/utils/toast';

const Payment = ({route, navigation}) => {
  const webWiewRef = useRef();
  const bookingData = useSelector(state => state?.bookingReducer?.bookingData);

  const handleWebViewNavigationStateChange = async newNavState => {
    const {url} = newNavState;
    if (url?.includes('check-status')) {
      const code = await getCodeFromWindowURL(url);
      webWiewRef?.current?.stopLoading();
      console.log('aakash', bookingData?.[0]?.payment_status, 'code', code);
      navigation?.goBack();
      code?.status === 'completed'
        ? successToast(code?.status)
        : code?.status === 'pending'
        ? infoToast(code?.status)
        : code?.status === 'failed' || 'cancelled'
        ? errorToast(code?.status)
        : successToast(code?.status);
      console.log(code?.status);
    }
  };

  const getCodeFromWindowURL = url => {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;
    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
    }
    return params;
  };
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <WebView
        source={{
          uri: route?.params?.url,
        }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        ref={webWiewRef}
        startInLoadingState={true}
        renderLoading={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: colors.defaultWhite,
            }}>
            <ActivityIndicator size="large" color={colors.themeColor} />
          </View>
        )}
      />
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({});
