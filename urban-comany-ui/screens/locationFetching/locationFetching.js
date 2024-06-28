import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const LocationFetching = () => {
  return (
    <View style={styles.container}>

    
        <Image
          source={require('../../assets/images/location1.png')}
          style={styles.image}
        />
        <Text style={styles.text}>Location Fetching ....</Text>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    //flex:1,
    height:"100%",
    width:"100",
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  image: {
    width: 40,
    height: 40,
    marginBottom: 10, 
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default LocationFetching;

