import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useCallback, useContext} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';
import {LocationContext} from '../LocationContext';
import axios from 'axios';

export default function RetailScreen() {
  const navigation = useNavigation();
  const {location} = useContext(LocationContext);

  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isRetailerOpen, setIsReatailerOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRetailer, setSelectedRetailer] = useState();
  const [areas, setAreas] = useState([]);
  const [retailers, setRetailers] = useState([]);

  const onAreaOpen = () => {
    setIsReatailerOpen(false);
    setIsOpen(false);
  };

  const onRetailerOpen = () => {
    setIsAreaOpen(false);
    setIsOpen(false);
  };

  const onVisitOpen = () => {
    setIsAreaOpen(false);
    setIsReatailerOpen(false);
  };

  // handle retailDCR data

  const handleSubmit = async () => {
    if (!selectedArea || !selectedRetailer || !item || !location) {
      alert('Please fill in all fields before submitting.');
      console.log(postData);
      return;
    }
  
    const selectedAreaName = areas.find(area => area.value === selectedArea)?.label;
    const selectedRetailerName = retailers.find(ret => ret.value === selectedRetailer)?.label ;
    // const selectedVisit_With=visitItems.find(vt => vt.value === selectedVisit_With)?.label;
  
  
    const postData = {
      selectedArea: selectedAreaName, 
      selectedRetailer: selectedRetailerName,
      Visit_With: item.toString(),
      latitude: parseFloat(location.latitude), 
      longitude: parseFloat(location.longitude) 
    };
  console.log("locdata",postData)
  
    try {
      const response = await axios.post('https://visitorApi.iecsl.in/api/RetailDCRAPI', postData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        alert('Submission Successful!');
        setSelectedArea('');
        setSelectedRetailer('');
        setItem('');
        // Optionally, navigate to another screen
        // navigation.navigate('HOME');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Submission failed. Please try again.');
    }
  };

  


  // fetch area using fetch area API

  useEffect(() => {
    axios
      .get('https://visitorApi.iecsl.in/api/SelectAreaAPI')
      .then(response => {
        const areaData = response.data.map(area => ({
          label: area.areaName,
          value: area.areaID,
        }));
        setAreas(areaData);
      })
      .catch(error => console.error('Error fetching areas:', error));
  }, []);

  // fetch retailers area wise using reatilers API

  useEffect(() => {
    if (selectedArea) {
      axios
        .get(
          `https://visitorApi.iecsl.in/api/SelectRetailAPI/sp_GetRetailers?areaId=${selectedArea}`,
        )
        .then(response => {
          console.log('Retailers API Response:', response.data);

          const RetailerData = response.data.map(retail => ({
            label: retail.retailerName,
            value: retail.retailerID, // Ensure unique keys
          }));
          setRetailers(RetailerData);
        })
        .catch(error => console.error('Error fetching retailers:', error));
    }
  }, [selectedArea]);

  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);

  const visitItems = [
    {label: 'Manager', value: 'manager'},
    {label: 'Self', value: 'self'},
  ];


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
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
              fontFamily:'Kanit-SemiBold'
            }}>
            Retailer
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
              fontFamily:'Kanit-SemiBold',
              color: 'black',
              marginTop: 20,
            }}>
            Latitude: {location?.latitude || 'fetching...'}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily:'Kanit-SemiBold',
              color: 'black',
            }}>
            Longitude:  {location?.longitude || 'fetching...'}
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          marginTop: 20,
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            zIndex: 3000,
          }}>
          <DropDownPicker
            items={areas}
            placeholder="Select Area"
            maxHeight={100}
            placeholderStyle={{color: 'black'}}
            open={isAreaOpen}
            setOpen={setIsAreaOpen}
            value={selectedArea}
            listMode='SCROLLVIEW'
            setValue={setSelectedArea}
            dropDownContainerStyle={{maxHeight:150}}
            showTickIcon={true}
            onOpen={onAreaOpen}
          />
        </View>

        <View
          style={{
            zIndex: 2000,
            marginTop: 20,
          }}>
          <DropDownPicker
            items={retailers}
            placeholder="Select Retailer"
            open={isRetailerOpen}
            key={selectedArea}
            setOpen={setIsReatailerOpen}
            value={selectedRetailer}
            setValue={setSelectedRetailer}
            showTickIcon={true}
            dropDownContainerStyle={{maxHeight:150}}
            placeholderStyle={{color: 'black'}}
            disabled={!selectedArea}
            onOpen={onRetailerOpen}
          />
        </View>

        <View
          style={{
            zIndex: 1000,
            marginTop: 20,
          }}>
          <DropDownPicker
            placeholder="Select Visit With"
            items={visitItems}
            open={isOpen}
            setOpen={setIsOpen}
            dropDownContainerStyle={{maxHeight:150}}
            value={item}
            setValue={setItem}
            onOpen={onVisitOpen}
          />
        </View>

        <View
          style={{
            marginTop: 50,
            backgroundColor: '#4d94ff',
            height: 50,
            width: 340,
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              height: 50,
              width: 340,
            }}>
            <Text
              style={{
                alignItems: 'center',
                alignSelf: 'center',
                fontSize: 18,
                color: '#fff',
                fontFamily:'Kanit-SemiBold',
                height: 50,
                textAlignVertical: 'center',
              }}>
              SUBMIT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}


