/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import MessageModal from 'src/components/messegeModal/MessegeModal';
import App from './App';
import {name as appName} from './app.json';

const URest = () => (
  <MessageModal>
    <App />
  </MessageModal>
);

AppRegistry.registerComponent(appName, () => URest);
