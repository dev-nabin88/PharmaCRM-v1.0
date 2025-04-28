import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useCallback, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import {getCurrentPosition} from 'react-native-geolocation-service';
import Geolocation from 'react-native-geolocation-service';
import {LocationContext} from '../LocationContext';

export default function DcrScreen() {
  const navigation = useNavigation();
  const {location} = useContext(LocationContext);

  const [selectedTab, setSelectedTab] = useState('Doctors'); //by default this tab will open
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //



  const DOCTOR_DCR_API = `http://visitorApi.iecsl.in/api/getDoctorDCRAPI/sp_getDoctorDCR`;
  const RETAILER_DCR_API = `https://visitorApi.iecsl.in/api/getRetailDCRAPI/sp_getRetailDCR`;

  //fetch dcr data when selected

  useFocusEffect(
    useCallback(() => {
      fetchDCRData();
    }, [selectedTab])
  );
  

  const fetchDCRData = async () => {
    setLoading(true);
    setError(null);
    const apiUrl =
      selectedTab === 'Doctors' ? DOCTOR_DCR_API : RETAILER_DCR_API;

    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
    } catch (err) {
      console.error(`Error fetching ${selectedTab} DCR data:`, err);
      setError('Failed to fetch data. Please try again.');
      setData([]);
    }
    setLoading(false);
  };



    //Show DCR data
  const showDCRItem = ({ item }) => (
    <TouchableOpacity 
    onPress={() =>
      navigation.navigate('DcrDetails', {
        area: item.selectedArea || 'N/A',
        doctorName: item.selectedDoctor || 'N/A', 
        retailerName: item.selectedRetailer || 'N/A', 
        latitude: item.latitude || 0,
        longitude: selectedTab === 'Doctors' ? item.longitute || 0 : item.longitude || 0,
        selectedTab: selectedTab, 
      })
    }
    >
    <View style={styles.dcrCard}>
      <Text style={styles.boldText}>{`Area: ${item.selectedArea || 'N/A'}`}</Text>
      <Text style={styles.boldText}>
        {selectedTab === 'Doctors'
          ? `Doctor: ${item.selectedDoctor || 'N/A'}`
          : `Retailer: ${item.selectedRetailer || 'N/A'}`}
      </Text>
      <Text style={styles.boldText}>{`Visit With: ${item.visit_With || 'N/A'}`}</Text>
      <Text style={styles.boldText}>{`Latitude: ${String(item.latitude || 'N/A')}`}</Text>
      <Text style={styles.boldText}>{`Longitude: ${String(selectedTab === 'Doctors' ? item.longitute || 'N/A' : item.longitude || 'N/A')}`}</Text>
    </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={{flex:1}}>
      <View
        style={{
          height: 50,
          width: '100%',
          backgroundColor: '#4d94ff',
          borderBottomEndRadius: 1,
          borderBottomStartRadius: 1,
        }}>
        <View
          style={{
            height: 25,
            width: 25,
            marginLeft: 10,
          }}>
          <TouchableOpacity
            style={{
              marginTop: 10,
            }}
            onPress={()=>navigation.navigate('HOME')}>
            <Image source={require('../images/leftarrow.png')} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: 140,
            height: 50,
            marginLeft: 50,
            marginTop: -15,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: '#fff',
              fontFamily:"Kanit-SemiBold"
            }}>
            Daily call Report
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#BFCAE5',
          height: 80,
          width: '80%',
          alignSelf: 'center',
          marginTop: 25,
          borderRadius: 5,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 5,
        }}>
        <View
          style={{
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily:"Kanit-SemiBold",
              color: 'black',
              marginTop: 20,
            }}>
            Latitude: {location?.latitude || 'fetching...'}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily:"Kanit-SemiBold",
              color: 'black',
            }}>
            Longitude: {location?.longitude || 'fetching...'}
          </Text>
        </View>
      </View>



      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'Doctors' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('Doctors')}>
          <Text style={styles.tabText}>Doctors</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'Retailers' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('Retailers')}>
          <Text style={styles.tabText}>Retailers</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={{
          backgroundColor:'#d1cfcf',
          marginTop:50,
          height:'30%',
          borderRadius:10,
          width:'80%',
          alignSelf:'center'
        }}>
          
        </View> */}
      <View style={{ flex:1
      }}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{marginTop: 20}} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (

        <FlatList 
          data={data}
          keyExtractor={(item, index) => `${selectedTab}-${index}`}
          renderItem={showDCRItem}
          ListEmptyComponent={
            <Text style={styles.noData}> No {selectedTab} DCR found</Text>
          }
        />
        
      )}

</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dcrCard: {
    backgroundColor: '#ffe066',
    width:'70%',
    alignSelf:'center',
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#38B6FF',
  },

  noData: {
    alignSelf: 'center',
  },

  tabContainer: {
    marginTop:25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#DFDFDF',
    borderRadius: 10,
    padding: 10,
  },

  tabButton: {flex: 1, alignItems: 'center', padding: 10},

  activeTab: {backgroundColor: '#38B6FF', borderRadius: 10},

  boldText: { fontSize: 16, fontFamily:"Kanit-Medium" },

  tabText: {fontSize: 16,  fontFamily:"Kanit-SemiBold", color: '#000'},
});

