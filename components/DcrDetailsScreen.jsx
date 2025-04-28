import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, View, Image, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

import WebView from 'react-native-webview';

export default function DcrDetailsScreen()  {

  

  // const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=10&maptype=satelite`;

  const navigation = useNavigation();
  const route = useRoute();
  const {area, doctorName, retailerName, latitude, longitude, selectedTab} =
    route.params || {};

  const displayName = selectedTab === 'Doctors' ? doctorName : retailerName;

  // console.log(latitude, longitude);

  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          marginTop: 15,
          alignSelf: 'flex-start',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('DCR')}>
          <Image
            style={{height: 20, width: 20, marginLeft: 25}}
            source={require('../images/backbtn.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={{alignSelf: 'center', marginTop: 50}}>
        <Text style={{fontSize: 17, fontFamily: 'Kanit-SemiBold'}}>
          {' '}
          DCR Details
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#ffe066',
          width: '80%',
          height: 120,
          alignSelf: 'center',
          marginTop: 30,
          borderRadius: 15,
        }}>
        <Text style={styles.textinput}>
          {selectedTab === 'Doctors' ? 'Doctor Name : ' : 'Retailer Name : '}{' '}
          {displayName}
        </Text>

        <Text style={styles.textinput}>Area : {area}</Text>
      </View>

      <View style={{marginTop: 50, height: 450, width: '100%'}}>
      <WebView
    source={{ uri: `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=10` }}
    style={{ flex: 1 }}
    javaScriptEnabled={true}
    domStorageEnabled={true}
/>
      </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  textinput: {
    marginTop: 10,
    alignSelf: 'center',
    fontSize: 16,
    padding: 10,
    fontFamily: 'Kanit-Medium',
  },

  mapsty: {
    flex: 1,
    height: 450,
    width: '100%',
  },
});

// import MapView ,{Marker,PROVIDER_GOOGLE} from "react-native-maps";

{
  /* <View style={{ marginTop:50 ,height: 450, width: '100%' }}>
<WebView
    source={{ uri: googleMapsUrl }}
    style={{ flex: 1 }}
    javaScriptEnabled={true}
    domStorageEnabled={true}
/>
</View> */
}
