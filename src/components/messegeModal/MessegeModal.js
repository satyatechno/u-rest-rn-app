import React, {ReactNode, useEffect} from 'react';
import {Button, Dimensions, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {findSize} from 'src/helper/helper';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';

const MessageModal = ({children}) => {
  const [handler, setHandeler] = React.useState({
    title: '',
    message: '',
    isVisible: false,
  });
  useEffect(() => {
    showMessage = ({message, title, successFn}) => {
      setHandeler({
        isVisible: true,
        message,
        title,
        ...(successFn && {successFn}),
      });
      return null;
    };

    hideMessage = () => {
      setHandeler({...handler, isVisible: false});
      return null;
    };
  }, [handler]);

  return (
    <View style={{flex: 1}}>
      {children}
      {handler.isVisible ? (
        <View
          style={{
            height: Dimensions.get('window').height,

            width: Dimensions.get('window').width,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',

            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <View
            style={{
              backgroundColor: colors.defaultWhite,
              alignSelf: 'center',
              borderRadius: 10,
              paddingTop: 15,
              paddingBottom: 20,
            }}>
            <Text
              style={{
                fontSize: findSize(20),
                fontFamily: fonts.Montserrat_Bold,
                color: colors.defaultBlack,
                paddingHorizontal: 20,
              }}>
              {handler.title}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: colors.defaultBlack,
                marginVertical: 10,
              }}></View>
            <Text
              style={{
                fontSize: findSize(16),
                fontFamily: fonts.Montserrat_Regular,
                color: colors.appGray,
                paddingHorizontal: 20,
                marginBottom: 10,
              }}>
              {handler.message}
            </Text>

            {handler.successFn && (
              <Button
                title="OK"
                onPress={() => {
                  handler.successFn();
                  setHandeler(prev => {
                    return {
                      ...prev,
                      isVisible: false,
                    };
                  });
                }}
                color={colors.themeColor}
              />
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export let showMessage = () => null;
export let hideMessage = () => null;

export default MessageModal;
