import { Platform} from 'react-native';
import { PERMISSIONS, RESULTS, request} from 'react-native-permissions';

export const requestLocationPermission = async () => {
  let platform = Platform.OS;
  let a = '';
  await request(
    platform === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  )
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          // console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
      a = result;
    })
    .catch(error => {
      // …
      console.log('location permission err', error);
    });
  return a;
};