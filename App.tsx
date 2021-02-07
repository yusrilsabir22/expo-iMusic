import 'reflect-metadata';
import 'react-native-gesture-handler'

import React from 'react';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from './src/redux/reducers';
import rootSaga from './src/redux';
import {StatusBar} from 'expo-status-bar'
import { DatabaseConnectionProvider } from './src/database/connection';
import { SocketIOConnProvider } from './src/config/socket-conn';
import MyApp from './src';
import { enableScreens } from 'react-native-screens';


// declare const global: {HermesInternal: null | {}};
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware));

enableScreens();
const App = () => {

  return (
    <Provider store={store}>
      <DatabaseConnectionProvider>
        <SocketIOConnProvider>
          {/* <TrackPlayerProvider> */}
            <StatusBar hidden />
            <MyApp/>
          {/* </TrackPlayerProvider> */}
        </SocketIOConnProvider>
      </DatabaseConnectionProvider>
    </Provider>
  );
};

sagaMiddleware.run(rootSaga)

export default App;
