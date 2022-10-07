import * as React from 'react';
import {Alert} from 'react-native';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

// export function dispatch(args) {
//   if (isReadyRef.current && navigationRef.current) {
//     navigationRef.current?.dispatch(args);
//   }
// }
export function dispatch(...args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(StackActions.replace(...args));
  }
}
export function reset(args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.reset(args);
  }
}

export const checkBack = () => {
  console.log('back Event');
  navigationRef?.current?.addListener('beforeRemove', e => {
    if (navigationRef?.current?.canGoBack()) {
      console.log('if Event');
      return;
    } else {
      console.log('else Event');
      e.preventDefault();
      Alert.alert('Exit', 'Are you sure, You want to exit app?', [
        {text: 'Cancel', style: 'cancel', onPress: () => {}},
        {
          text: 'Ok',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => navigationRef?.current.dispatch(e.data.action),
        },
      ]);
    }
  });
};
