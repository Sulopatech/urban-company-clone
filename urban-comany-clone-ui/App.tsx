import React from 'react';
import {Provider} from 'react-redux';
import {components} from './src/components';
import {persistor, store} from './src/store/store';
import FlashMessage from 'react-native-flash-message';
import {PersistGate} from 'redux-persist/integration/react';
import StackNavigator from './src/navigation/StackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <PersistGate loading={<components.Loader />} persistor={persistor}>
            <NavigationContainer>
              <StackNavigator />
            </NavigationContainer>
          </PersistGate>
        </Provider>
        <FlashMessage position='top' />
        </ApolloProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
