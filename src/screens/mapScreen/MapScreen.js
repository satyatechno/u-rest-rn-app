import React, {Component, useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, StyleSheet, View} from 'react-native';
import MapboxGL, {Logger} from '@react-native-mapbox-gl/maps';
import {MAPBOX_TOKEN} from 'src/helper/credentials';
import colors from 'src/styles/colors/colors';
import axios from 'axios';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bedrock needs access to your Location ',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use Location');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
MapboxGL.setAccessToken(MAPBOX_TOKEN);
// edit logging messages
Logger.setLogCallback(log => {
  const {message} = log;

  // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed')
  ) {
    return true;
  }
  return false;
});
const MapScreen = () => {
  const [userLocation, setUserLocation] = useState([]);
  const [markerLocation, setMarkerLocation] = useState([]);
  const [userLocationFlag, setUserLocationFlag] = useState(false);
  const map = useRef();
  const location = useRef();
  const camera = useRef();
  useEffect(async () => {
    // camera.current?.moveTo([26.8404116, 75.81852]);
    // camera?.current?.zoomTo(5);
    console.log(userLocation);
    if (userLocation.length == 2) {
      setMarkerLocation(userLocation);
      setTimeout(() => {
        camera.current?.setCamera({
          centerCoordinate: userLocation,
          zoomLevel: 16,
          animationDuration: 2000,
        });
      }, 500);
    }
  }, [userLocationFlag]);
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const polygon = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [75.80507384096114, 26.85689058320787],
          [75.80545397073618, 26.85675477743702],
          [75.80633570095614, 26.85584193087996],
          [75.80550070457153, 26.855175177580534],
          [75.80386838899034, 26.85558749491136],
          [75.80507384096114, 26.85689058320787],
        ],
      ],
    },
  };

  const getAddress = async () => {
    try {
      const result = await axios(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
          markerLocation?.[0] +
          ',' +
          markerLocation?.[1] +
          '.json?access_token=' +
          MAPBOX_TOKEN,
      );
      console.log('Address: ', result.data?.features[0].place_name);
    } catch (error) {}
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          // styleURL="mapbox://styles/mapbox/satellite-streets-v11"
          zoomEnabled={true}
          userTrackingMode={true}
          ref={map}
          style={styles.map}
          nativeID="hhhhh">
          <MapboxGL.UserLocation
            ref={location}
            showsUserHeadingIndicator={false}
            visible={true}
            onUpdate={event => {
              setUserLocation([
                event?.coords?.longitude,
                event?.coords?.latitude,
              ]);
              if (!userLocationFlag) setUserLocationFlag(true);
            }}
          />
          <MapboxGL.Camera ref={camera} />
          {markerLocation?.length == 2 && (
            <MapboxGL.PointAnnotation
              id="gggg"
              coordinate={markerLocation}
              draggable={true}
              onDragEnd={event => {
                // console.log('event', event);
                setMarkerLocation(event?.geometry?.coordinates);
                // createZone();
                getAddress();
              }}
            />
          )}
          <MapboxGL.ShapeSource id="source" shape={polygon}>
            <MapboxGL.FillLayer
              id="fill"
              style={{fillColor: 'blue', fillOpacity: 0.3}}
            />
            <MapboxGL.LineLayer
              id="line"
              style={{lineColor: 'red', lineWidth: 2}}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

export default MapScreen;
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.defaultWhite,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.defaultWhite,
  },
  map: {
    flex: 1,
  },
});
